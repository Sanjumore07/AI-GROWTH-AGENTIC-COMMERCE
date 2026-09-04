import {
  ShoppingIntent,
  RankedProductRecommendation,
  OfferDecision,
  CartRecoveryDecision,
  ComplementaryUpsell,
  CustomerBehaviorProfile,
  CampaignGenerationResult,
  GrowthInsightItem,
  AdvisorChatMessage,
} from "./types";

export interface AIProvider {
  name: string;

  analyzeIntent(query: string, context?: Record<string, any>): Promise<ShoppingIntent>;

  rankProductsForIntent(
    intent: ShoppingIntent,
    catalog: any[],
    customerContext?: any
  ): Promise<RankedProductRecommendation[]>;

  generateOffer(
    cart: any,
    customer: any,
    intent?: ShoppingIntent
  ): Promise<OfferDecision>;

  evaluateCartRecovery(
    cart: any,
    customer: any,
    historyEvents: any[]
  ): Promise<CartRecoveryDecision>;

  recommendCrossSell(
    cartItems: any[],
    catalog: any[]
  ): Promise<ComplementaryUpsell[]>;

  analyzeCustomerProfile(
    customer: any,
    orders: any[],
    events: any[]
  ): Promise<CustomerBehaviorProfile>;

  generateCampaign(
    goal: string,
    audience: string,
    catalog: any[]
  ): Promise<CampaignGenerationResult>;

  generateGrowthInsights(
    metrics: any
  ): Promise<GrowthInsightItem[]>;

  advisorChat(
    history: AdvisorChatMessage[],
    currentQuery: string,
    catalog: any[],
    activeProduct?: any
  ): Promise<{
    reply: string;
    recommendedProductIds: string[];
    quickReplies: string[];
  }>;
}
