import { prisma } from "../prisma";
import { AgentKey } from "./types";

export interface CreateDecisionTraceParams {
  agentKey: AgentKey;
  eventType: string;
  customerId?: string;
  entityType?: string;
  entityId?: string;
  context: {
    event: string;
    details: string;
    viewCount?: number;
    cartValue?: number;
    previousOrders?: number;
  };
  intentScore?: number;
  riskLevel?: "Low" | "Medium" | "High";
  optionsConsidered: string[];
  decision: string;
  confidence: number;
  reasoning: string;
  requiresApproval?: boolean;
  status?: "EXECUTED" | "PENDING_APPROVAL" | "REJECTED" | "FALLBACK";
  outcome?: string;
  revenueImpact?: number;
}

export class DecisionTracer {
  static async record(params: CreateDecisionTraceParams) {
    try {
      const record = await prisma.aIDecision.create({
        data: {
          agentKey: params.agentKey,
          eventType: params.eventType,
          customerId: params.customerId,
          entityType: params.entityType,
          entityId: params.entityId,
          contextJson: JSON.stringify(params.context),
          intentScore: params.intentScore ?? 80,
          riskLevel: params.riskLevel ?? "Medium",
          optionsConsideredJson: JSON.stringify(params.optionsConsidered),
          decision: params.decision,
          confidence: params.confidence,
          reasoning: params.reasoning,
          status: params.status ?? (params.requiresApproval ? "PENDING_APPROVAL" : "EXECUTED"),
          requiresApproval: params.requiresApproval ?? false,
          outcome: params.outcome,
          revenueImpact: params.revenueImpact ?? 0,
        },
      });

      // Also log to ActivityLog
      await prisma.activityLog.create({
        data: {
          actor: `${params.agentKey} Agent`,
          agentKey: params.agentKey,
          action: params.decision,
          entityType: params.entityType,
          entityId: params.entityId,
          outcome: params.status ?? "Executed",
          details: params.reasoning,
        },
      });

      // Update Agent statistics
      await prisma.aIAgent.updateMany({
        where: { key: params.agentKey },
        data: {
          totalExecutions: { increment: 1 },
          successfulActions: { increment: 1 },
          lastActiveAt: new Date(),
        },
      });

      return record;
    } catch (error) {
      console.error("[DecisionTracer] Failed to persist decision trace:", error);
      return null;
    }
  }

  static async markOutcome(decisionId: string, outcome: string, revenueImpact: number) {
    try {
      const updated = await prisma.aIDecision.update({
        where: { id: decisionId },
        data: {
          outcome,
          revenueImpact,
          status: "EXECUTED",
        },
      });

      if (updated.agentKey) {
        await prisma.aIAgent.updateMany({
          where: { key: updated.agentKey },
          data: {
            revenueInfluenced: { increment: revenueImpact },
          },
        });
      }

      return updated;
    } catch (error) {
      console.error("[DecisionTracer] Error updating outcome:", error);
      return null;
    }
  }
}
