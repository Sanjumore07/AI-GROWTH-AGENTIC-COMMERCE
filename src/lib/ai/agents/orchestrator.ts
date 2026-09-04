import { ShoppingIntentAgent } from "./intent-agent";
import { ProductDiscoveryAgent } from "./discovery-agent";
import { PersonalizationAgent } from "./personalization-agent";
import { OfferOptimizationAgent } from "./offer-agent";
import { CartRecoveryAgent } from "./recovery-agent";
import { UpsellCrossSellAgent } from "./upsell-agent";
import { CustomerRetentionAgent } from "./retention-agent";
import { CommerceAdvisorAgent } from "./advisor-agent";
import { GrowthInsightsAgent } from "./growth-agent";
import { DecisionTracer } from "../decision-tracer";

export class CommerceOrchestrator {
  static readonly KEY = "ORCHESTRATOR";

  /**
   * Pipeline 1: Natural Language Discovery
   * Intent Agent -> Product Discovery Agent -> Personalization (if customer known)
   */
  static async handleIntentQuery(query: string, customerId?: string) {
    const intent = await ShoppingIntentAgent.process(query, customerId);
    const recommendations = await ProductDiscoveryAgent.discover(intent, customerId);

    let customerProfile = null;
    if (customerId) {
      customerProfile = await PersonalizationAgent.profile(customerId);
    }

    return {
      intent,
      recommendations,
      customerProfile,
    };
  }

  /**
   * Pipeline 2: Cart Progression & Incentivization
   * Cart State -> Upsell/Cross-sell Agent -> Offer Optimization Agent
   */
  static async handleCartReview(cartId: string, cartItems: any[], intent?: any) {
    const upsells = await UpsellCrossSellAgent.findPairings(cartItems);
    const offer = await OfferOptimizationAgent.evaluate(cartId, intent);

    return {
      upsells,
      offer,
    };
  }

  /**
   * Pipeline 3: Abandoned Cart Intervention
   */
  static async handleAbandonment(cartId: string) {
    return CartRecoveryAgent.analyze(cartId);
  }

  /**
   * Pipeline 4: Completed Checkout
   */
  static async handleOrderCompleted(orderId: string) {
    return CustomerRetentionAgent.onPurchaseCompleted(orderId);
  }
}
