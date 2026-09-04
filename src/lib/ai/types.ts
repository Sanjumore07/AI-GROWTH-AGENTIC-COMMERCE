export type AgentKey =
  | "INTENT"
  | "DISCOVERY"
  | "ADVISOR"
  | "PERSONALIZATION"
  | "OFFER"
  | "RECOVERY"
  | "UPSELL"
  | "RETENTION"
  | "GROWTH"
  | "ORCHESTRATOR";

export interface ShoppingIntent {
  rawQuery: string;
  category: string;
  budget?: number;
  useCase: string;
  priorities: string[];
  constraints: string[];
  intentScore: number; // 0 - 100
  urgency: "Low" | "Medium" | "High";
  detectedEntity?: string;
}

export type RecommendationBadge =
  | "BEST_MATCH"
  | "BEST_VALUE"
  | "BUDGET_PICK"
  | "PREMIUM_CHOICE";

export interface RankedProductRecommendation {
  productId: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  matchScore: number; // 0 - 100
  badge: RecommendationBadge;
  reasons: string[];
  tradeOffs?: string;
}

export interface OfferDecision {
  type:
    | "NO_OFFER"
    | "FREE_SHIPPING"
    | "PERCENT_DISCOUNT"
    | "FIXED_DISCOUNT"
    | "BUNDLE_UPSELL";
  value?: number; // e.g. 10 for 10%
  discountAmount?: number;
  promoCode?: string;
  reasoning: string;
  requiresApproval: boolean;
  confidence: number;
  estimatedMarginImpact: string;
}

export interface CartRecoveryDecision {
  cartId: string;
  customerId?: string;
  customerName?: string;
  cartValue: number;
  intentScore: number;
  abandonmentRisk: "Low" | "Medium" | "High";
  actionType:
    | "REMINDER"
    | "REASSURANCE"
    | "LIMITED_INCENTIVE"
    | "ALTERNATIVE_PRODUCT"
    | "NO_ACTION";
  recommendedAction: string;
  suggestedMessage: string;
  reasoning: string;
  confidence: number;
  requiresApproval: boolean;
}

export interface ComplementaryUpsell {
  productId: string;
  name: string;
  price: number;
  category: string;
  image: string;
  relevanceScore: number;
  pairingReason: string;
}

export interface CustomerBehaviorProfile {
  customerId: string;
  name: string;
  segment: string;
  priceSensitivity: "Low" | "Medium" | "High";
  summary: string;
  purchaseProbability: number;
  churnRisk: "Low" | "Medium" | "High";
  nextBestAction: string;
  recommendedCategory: string;
}

export interface CampaignGenerationResult {
  name: string;
  goal: string;
  targetAudience: string;
  message: string;
  recommendedProductIds: string[];
  expectedImpact: string;
  aiReasoning: string;
}

export interface GrowthInsightItem {
  id: string;
  priority: "HIGH" | "MEDIUM" | "QUICK_WIN";
  title: string;
  why: string;
  impact: string;
  recommendedAction: string;
  actionButtonLabel: string;
  actionType: string;
}

export interface DecisionTrace {
  id: string;
  agentKey: AgentKey;
  eventType: string;
  customerName?: string;
  event: string;
  context: string;
  intent: string;
  risk: string;
  options: string[];
  decision: string;
  confidence: number;
  status: "EXECUTED" | "PENDING_APPROVAL" | "REJECTED" | "FALLBACK";
  reasoning: string;
  outcome?: string;
  revenueImpact?: number;
  timestamp: string;
}

export interface AdvisorChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  recommendedProductIds?: string[];
  quickActions?: string[];
}
