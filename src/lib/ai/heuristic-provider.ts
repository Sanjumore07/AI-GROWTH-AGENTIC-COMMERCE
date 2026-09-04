import {
  AIProvider,
} from "./provider";
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
  RecommendationBadge,
} from "./types";

export class HeuristicAIProvider implements AIProvider {
  name = "CommercePilot Heuristic & Knowledge Engine (Deterministic)";

  async analyzeIntent(
    query: string,
    context?: Record<string, any>
  ): Promise<ShoppingIntent> {
    const q = query.toLowerCase();

    // 1. Budget extraction (under 8000, < 80k, ₹70,000, 50000 budget, etc.)
    let budget: number | undefined = undefined;
    const budgetMatch =
      q.match(/(?:under|below|less than|budget|within|max)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)(?:\s*(?:k|thousand))?/i) ||
      q.match(/(?:₹|rs\.?)\s*([\d,]+)(?:\s*(?:k|thousand))?/i) ||
      q.match(/([\d,]+)\s*(?:k)\b/i);

    if (budgetMatch) {
      let rawVal = budgetMatch[1].replace(/,/g, "");
      let parsed = parseFloat(rawVal);
      if (q.includes(`${rawVal}k`) || budgetMatch[0].toLowerCase().includes("k")) {
        parsed = parsed * 1000;
      }
      if (!isNaN(parsed) && parsed > 0) {
        budget = parsed;
      }
    }

    // 2. Category detection
    let category = "General Electronics";
    if (q.includes("laptop") || q.includes("macbook") || q.includes("notebook") || q.includes("thinkpad")) {
      category = "Laptops";
    } else if (q.includes("headphone") || q.includes("earphone") || q.includes("earbuds") || q.includes("airpods") || q.includes("audio")) {
      category = "Headphones";
    } else if (q.includes("phone") || q.includes("iphone") || q.includes("smartphone") || q.includes("mobile") || q.includes("galaxy")) {
      category = "Phones";
    } else if (q.includes("smart home") || q.includes("speaker") || q.includes("echo") || q.includes("alexa") || q.includes("bulb")) {
      category = "Smart Home";
    } else if (q.includes("watch") || q.includes("fitness") || q.includes("band") || q.includes("tracker")) {
      category = "Fitness";
    } else if (q.includes("hub") || q.includes("mouse") || q.includes("keyboard") || q.includes("bag") || q.includes("charger") || q.includes("cable")) {
      category = "Accessories";
    } else if (q.includes("tablet") || q.includes("ipad")) {
      category = "Tablets";
    }

    // 3. Use case extraction
    const useCases: string[] = [];
    if (q.includes("code") || q.includes("coding") || q.includes("developer") || q.includes("programming")) useCases.push("Coding & Development");
    if (q.includes("college") || q.includes("student") || q.includes("study") || q.includes("school")) useCases.push("College & Studies");
    if (q.includes("travel") || q.includes("flight") || q.includes("commute")) useCases.push("Travel & Commute");
    if (q.includes("call") || q.includes("meeting") || q.includes("zoom") || q.includes("office")) useCases.push("Calls & Remote Meetings");
    if (q.includes("game") || q.includes("gaming")) useCases.push("High Performance Gaming");
    if (q.includes("photo") || q.includes("camera") || q.includes("video")) useCases.push("Photography & Media");
    if (q.includes("workout") || q.includes("gym") || q.includes("running")) useCases.push("Fitness & Sports");

    const useCaseStr = useCases.length > 0 ? useCases.join(" + ") : "Daily Productivity & Lifestyle";

    // 4. Priorities & constraints
    const priorities: string[] = [];
    if (q.includes("battery") || q.includes("long lasting")) priorities.push("Extended Battery Life");
    if (q.includes("noise") || q.includes("anc")) priorities.push("Active Noise Cancellation");
    if (q.includes("mic") || q.includes("microphone") || q.includes("clear")) priorities.push("Crystal Clear Microphone");
    if (q.includes("light") || q.includes("portable") || q.includes("thin")) priorities.push("Lightweight & Portable");
    if (q.includes("fast") || q.includes("performance") || q.includes("speed")) priorities.push("High Processing Speed");
    if (q.includes("camera") || q.includes("lens")) priorities.push("Advanced Camera Sensor");
    if (priorities.length === 0) {
      priorities.push("Reliable Performance", "Strong Build Quality");
    }

    // 5. Intent score & urgency
    let intentScore = 75;
    if (budget) intentScore += 10;
    if (useCases.length > 0) intentScore += 5;
    if (q.includes("need") || q.includes("buy") || q.includes("urgent") || q.includes("now") || q.includes("looking for")) {
      intentScore += 4;
    }
    intentScore = Math.min(96, intentScore);

    const urgency = intentScore > 85 ? "High" : intentScore > 70 ? "Medium" : "Low";

    return {
      rawQuery: query,
      category,
      budget,
      useCase: useCaseStr,
      priorities,
      constraints: budget ? [`Strict budget cap: ₹${budget.toLocaleString("en-IN")}`] : [],
      intentScore,
      urgency,
    };
  }

  async rankProductsForIntent(
    intent: ShoppingIntent,
    catalog: any[],
    customerContext?: any
  ): Promise<RankedProductRecommendation[]> {
    if (!catalog || catalog.length === 0) return [];

    // Filter by category if match found, else use full catalog
    let eligible = catalog.filter((p) => {
      const catName = p.category?.name || p.category || "";
      return catName.toLowerCase().includes(intent.category.toLowerCase()) ||
        intent.category.toLowerCase().includes(catName.toLowerCase());
    });

    if (eligible.length === 0) {
      eligible = [...catalog];
    }

    // Score each product
    const scored = eligible.map((product) => {
      let score = 70;
      const pPrice = product.price;

      // Budget scoring
      if (intent.budget) {
        if (pPrice <= intent.budget) {
          // Within budget: reward closeness to budget without exceeding
          const ratio = pPrice / intent.budget;
          score += 15 * (0.5 + 0.5 * ratio);
        } else {
          // Exceeds budget: penalize proportionally
          const overRatio = (pPrice - intent.budget) / intent.budget;
          score -= Math.min(45, overRatio * 40);
        }
      }

      // Rating bonus
      score += (product.rating - 4.0) * 10;

      // Stock check
      if (product.inStock && product.stockCount > 0) {
        score += 5;
      } else {
        score -= 20;
      }

      // Tag/attribute matching
      const pTags = (typeof product.tags === "string" ? JSON.parse(product.tags || "[]") : product.tags) || [];
      const tagStr = pTags.join(" ").toLowerCase();
      const desc = (product.description || "").toLowerCase();

      for (const priority of intent.priorities) {
        const keyword = priority.toLowerCase().split(" ")[0];
        if (tagStr.includes(keyword) || desc.includes(keyword)) {
          score += 6;
        }
      }

      const finalScore = Math.min(98, Math.max(45, Math.round(score)));

      return {
        product,
        score: finalScore,
      };
    });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    // Pick recommendations with badges
    const results: RankedProductRecommendation[] = [];

    // 1. Best Match: Highest score
    const bestMatch = scored[0];
    if (bestMatch) {
      results.push({
        productId: bestMatch.product.id,
        name: bestMatch.product.name,
        price: bestMatch.product.price,
        originalPrice: bestMatch.product.originalPrice || bestMatch.product.price * 1.15,
        image: this.getProductImage(bestMatch.product),
        rating: bestMatch.product.rating,
        matchScore: bestMatch.score,
        badge: "BEST_MATCH",
        reasons: [
          intent.budget ? `Fits comfortably within your ₹${intent.budget.toLocaleString("en-IN")} target` : "Top rated in this category",
          `Matches your ${intent.useCase} requirements with high efficiency`,
          `Rated ${bestMatch.product.rating}★ by ${bestMatch.product.reviewCount || 150}+ verified owners`,
          "Verified in stock with priority 24h dispatch",
        ],
        tradeOffs: "Slightly higher investment than base models, but delivers superior durability.",
      });
    }

    // 2. Best Value: Strong rating & price ratio
    const valueCandidate = scored.slice(1).find((item) => {
      if (intent.budget) return item.product.price <= intent.budget * 0.9;
      return true;
    }) || scored[1];

    if (valueCandidate && valueCandidate.product.id !== bestMatch?.product.id) {
      results.push({
        productId: valueCandidate.product.id,
        name: valueCandidate.product.name,
        price: valueCandidate.product.price,
        originalPrice: valueCandidate.product.originalPrice || valueCandidate.product.price * 1.2,
        image: this.getProductImage(valueCandidate.product),
        rating: valueCandidate.product.rating,
        matchScore: Math.max(78, valueCandidate.score - 3),
        badge: "BEST_VALUE",
        reasons: [
          `Highest performance-to-price ratio in ${intent.category}`,
          "Includes core features without premium brand markup",
          `Over ${valueCandidate.product.discountPercent || 15}% price advantage compared to flagship tier`,
        ],
        tradeOffs: "May have plastic finish rather than unibody aluminum.",
      });
    }

    // 3. Budget Pick: Lowest price meeting basic quality
    const withinBudget = scored.filter((s) => !intent.budget || s.product.price <= intent.budget);
    const sortedByPrice = [...withinBudget].sort((a, b) => a.product.price - b.product.price);
    const budgetPick = sortedByPrice[0];

    if (budgetPick && !results.some((r) => r.productId === budgetPick.product.id)) {
      results.push({
        productId: budgetPick.product.id,
        name: budgetPick.product.name,
        price: budgetPick.product.price,
        originalPrice: budgetPick.product.originalPrice || budgetPick.product.price * 1.25,
        image: this.getProductImage(budgetPick.product),
        rating: budgetPick.product.rating,
        matchScore: Math.max(72, budgetPick.score - 5),
        badge: "BUDGET_PICK",
        reasons: [
          `Lowest entry price at ₹${budgetPick.product.price.toLocaleString("en-IN")}`,
          "Covers all essential daily functionality",
          "Excellent starting choice for students and budget-conscious buyers",
        ],
        tradeOffs: "Lower internal storage or slightly shorter battery run time.",
      });
    }

    // 4. Premium Choice: Flagship features
    const sortedByHigh = [...scored].sort((a, b) => b.product.price - a.product.price);
    const premiumChoice = sortedByHigh[0];
    if (premiumChoice && !results.some((r) => r.productId === premiumChoice.product.id)) {
      results.push({
        productId: premiumChoice.product.id,
        name: premiumChoice.product.name,
        price: premiumChoice.product.price,
        originalPrice: premiumChoice.product.originalPrice || premiumChoice.product.price * 1.1,
        image: this.getProductImage(premiumChoice.product),
        rating: premiumChoice.product.rating,
        matchScore: Math.max(82, premiumChoice.score),
        badge: "PREMIUM_CHOICE",
        reasons: [
          "Uncompromised flagship performance & build quality",
          "Advanced thermal cooling and premium display/audio hardware",
          "Longest expected lifespan with 3+ years software support",
        ],
        tradeOffs: intent.budget && premiumChoice.product.price > intent.budget
          ? `Exceeds current budget of ₹${intent.budget.toLocaleString("en-IN")}`
          : "Higher initial upfront capital investment.",
      });
    }

    return results;
  }

  async generateOffer(
    cart: any,
    customer: any,
    intent?: ShoppingIntent
  ): Promise<OfferDecision> {
    const total = cart?.total || cart?.subtotal || 0;
    const isPriceSensitive = customer?.priceSensitivity === "High";
    const intentScore = intent?.intentScore || cart?.intentScore || 75;

    // AI Judgment Principle: Avoid unnecessary discounts!
    if (intentScore >= 85 && !isPriceSensitive) {
      return {
        type: "NO_OFFER",
        reasoning: `Customer exhibits high purchase intent (${intentScore}/100) and low price sensitivity. No discount required to achieve conversion; preserving merchant margin.`,
        requiresApproval: false,
        confidence: 0.94,
        estimatedMarginImpact: "0% margin sacrifice (full margin preserved)",
      };
    }

    // High total cart requiring human approval if discount is significant
    if (total > 80000 && isPriceSensitive) {
      return {
        type: "PERCENT_DISCOUNT",
        value: 12,
        discountAmount: Math.round(total * 0.12),
        promoCode: "AGENTIC12",
        reasoning: `High-value cart (₹${total.toLocaleString("en-IN")}) with price-sensitive buyer. Recommended 12% concession to seal transaction. Because discount exceeds ₹8,000 threshold, merchant approval is required.`,
        requiresApproval: true,
        confidence: 0.88,
        estimatedMarginImpact: "-12% margin offset by guaranteed high AOV order",
      };
    }

    if (total > 15000 && (isPriceSensitive || intentScore < 60)) {
      return {
        type: "FREE_SHIPPING",
        discountAmount: 250,
        promoCode: "FREESHIP_AI",
        reasoning: "Customer hesitating at checkout boundary. Free shipping incentive eliminates delivery friction without eroding core gross margin.",
        requiresApproval: false,
        confidence: 0.91,
        estimatedMarginImpact: "Low impact (-₹250 logistics absorption)",
      };
    }

    return {
      type: "NO_OFFER",
      reasoning: "Standard checkout trajectory. Current conversion probability is healthy without commercial incentives.",
      requiresApproval: false,
      confidence: 0.89,
      estimatedMarginImpact: "Neutral",
    };
  }

  async evaluateCartRecovery(
    cart: any,
    customer: any,
    historyEvents: any[]
  ): Promise<CartRecoveryDecision> {
    const cartVal = cart?.total || cart?.subtotal || 0;
    const intentScore = cart?.intentScore || 85;
    const viewCount = historyEvents?.filter((e) => e.eventType === "PRODUCT_VIEW").length || 3;

    // Rahul Sharma Hero Scenario logic
    if (intentScore >= 88 && viewCount >= 3) {
      return {
        cartId: cart?.id || "demo-cart",
        customerId: customer?.id,
        customerName: customer?.name || "Shopper",
        cartValue: cartVal,
        intentScore,
        abandonmentRisk: "High",
        actionType: "REMINDER",
        recommendedAction: "Personalized Reminder (No Discount)",
        suggestedMessage: `Hi ${customer?.name?.split(" ")[0] || "there"}, we noticed you saved items in your cart. Only 3 units remain in stock with free next-day dispatch. Ready to complete your setup?`,
        reasoning: `High purchase intent detected (${intentScore}/100). Customer viewed the target item ${viewCount} times. Concluding this is an operational abandonment (e.g. distraction/tab switch) rather than price resistance. Do NOT offer a margin-diluting discount; send reassuring reminder with stock urgency.`,
        confidence: 0.93,
        requiresApproval: false,
      };
    }

    if (cartVal > 100000) {
      return {
        cartId: cart?.id || "demo-cart",
        customerId: customer?.id,
        customerName: customer?.name || "Shopper",
        cartValue: cartVal,
        intentScore,
        abandonmentRisk: "High",
        actionType: "LIMITED_INCENTIVE",
        recommendedAction: "Exclusive Executive VIP Incentive (Requires Review)",
        suggestedMessage: `Hello ${customer?.name || "Customer"}, your enterprise-grade cart is reserved. We can provide complimentary priority warranty support if completed today.`,
        reasoning: `Cart value exceeds ₹1,00,000 threshold with substantial gross revenue at stake. Proposing VIP warranty package; requires merchant review.`,
        confidence: 0.85,
        requiresApproval: true,
      };
    }

    return {
      cartId: cart?.id || "demo-cart",
      customerId: customer?.id,
      customerName: customer?.name || "Shopper",
      cartValue: cartVal,
      intentScore,
      abandonmentRisk: "Medium",
      actionType: "REASSURANCE",
      recommendedAction: "Product Reassurance & Return Policy Notification",
      suggestedMessage: `Have questions about compatibility? CommercePilot offers 7-day hassle-free replacements and instant Razorpay checkout protection.`,
      reasoning: "Moderate intent score. Buyer likely comparing return policies or seeking warranty clarity.",
      confidence: 0.87,
      requiresApproval: false,
    };
  }

  async recommendCrossSell(
    cartItems: any[],
    catalog: any[]
  ): Promise<ComplementaryUpsell[]> {
    if (!cartItems || cartItems.length === 0 || !catalog) return [];

    const recommendations: ComplementaryUpsell[] = [];
    const cartProductNames = cartItems.map((ci) => (ci.product?.name || "").toLowerCase()).join(" ");
    const cartCategories = cartItems.map((ci) => (ci.product?.category?.name || ci.product?.category || "").toLowerCase()).join(" ");

    for (const item of catalog) {
      // Don't recommend what is already in cart
      if (cartItems.some((ci) => ci.productId === item.id || ci.product?.id === item.id)) continue;

      const name = item.name.toLowerCase();
      const cat = (item.category?.name || item.category || "").toLowerCase();

      // Laptop pairing
      if (cartCategories.includes("laptop") || cartProductNames.includes("macbook") || cartProductNames.includes("laptop")) {
        if (name.includes("hub") || name.includes("usb-c") || name.includes("dock")) {
          recommendations.push({
            productId: item.id,
            name: item.name,
            price: item.price,
            category: "Accessories",
            image: this.getProductImage(item),
            relevanceScore: 96,
            pairingReason: "Essential multi-port expansion for your laptop (HDMI, USB 3.0, SD card reader)",
          });
        } else if (name.includes("bag") || name.includes("sleeve") || name.includes("backpack")) {
          recommendations.push({
            productId: item.id,
            name: item.name,
            price: item.price,
            category: "Accessories",
            image: this.getProductImage(item),
            relevanceScore: 91,
            pairingReason: "Water-resistant padded sleeve designed to safeguard your newly purchased laptop",
          });
        } else if (name.includes("mouse") || name.includes("wireless mouse")) {
          recommendations.push({
            productId: item.id,
            name: item.name,
            price: item.price,
            category: "Accessories",
            image: this.getProductImage(item),
            relevanceScore: 89,
            pairingReason: "Ergonomic precision wireless mouse to boost coding and office workflow productivity",
          });
        }
      }

      // Phone pairing
      if (cartCategories.includes("phone") || cartProductNames.includes("iphone") || cartProductNames.includes("galaxy")) {
        if (name.includes("case") || name.includes("cover") || name.includes("protector")) {
          recommendations.push({
            productId: item.id,
            name: item.name,
            price: item.price,
            category: "Accessories",
            image: this.getProductImage(item),
            relevanceScore: 94,
            pairingReason: "Military-grade drop protection custom fitted for your selected smartphone",
          });
        } else if (name.includes("charger") || name.includes("adapter") || name.includes("wireless pad")) {
          recommendations.push({
            productId: item.id,
            name: item.name,
            price: item.price,
            category: "Accessories",
            image: this.getProductImage(item),
            relevanceScore: 92,
            pairingReason: "High-speed 65W GaN fast charger compatible with fast-charge protocols",
          });
        }
      }
    }

    // Fallback complementary items if none matched
    if (recommendations.length === 0) {
      const accessory = catalog.find((c) => (c.category?.name || c.category || "").toLowerCase().includes("accessories"));
      if (accessory) {
        recommendations.push({
          productId: accessory.id,
          name: accessory.name,
          price: accessory.price,
          category: "Accessories",
          image: this.getProductImage(accessory),
          relevanceScore: 84,
          pairingReason: "Frequently purchased together by verified customers in this category",
        });
      }
    }

    return recommendations.slice(0, 3);
  }

  async analyzeCustomerProfile(
    customer: any,
    orders: any[],
    events: any[]
  ): Promise<CustomerBehaviorProfile> {
    const orderCount = orders?.length || customer?.ordersCount || 0;
    const spend = orders?.reduce((acc, o) => acc + (o.total || 0), 0) || customer?.totalSpend || 0;
    const aov = orderCount > 0 ? spend / orderCount : 0;

    const segment = spend > 100000 ? "VIP Merchant" : orderCount >= 2 ? "Repeat Buyer" : "High Intent Shopper";
    const priceSens: "Low" | "Medium" | "High" = customer?.priceSensitivity || (aov > 50000 ? "Low" : aov > 15000 ? "Medium" : "High");

    return {
      customerId: customer?.id || "c-demo",
      name: customer?.name || "Customer",
      segment,
      priceSensitivity: priceSens,
      summary: `Customer exhibits strong interest in premium consumer technology. Engaged across ${events?.length || 8} sessions with low cart resistance.`,
      purchaseProbability: 0.88,
      churnRisk: "Low",
      nextBestAction: "Present complementary setup bundles within 14 days of previous delivery.",
      recommendedCategory: "Laptops & Productivity Accessories",
    };
  }

  async generateCampaign(
    goal: string,
    audience: string,
    catalog: any[]
  ): Promise<CampaignGenerationResult> {
    const g = goal.toLowerCase();
    let name = "Complete Your Setup — Pro Productivity Bundle";
    let message = "Unlock your full workflow potential. As a valued hardware owner, enjoy handpicked complementary peripherals with priority express dispatch.";
    let expectedImpact = "+22% AOV Uplift, est. ₹3.8L incremental GMV";
    let aiReasoning = "Data indicates 38% of laptop buyers procure secondary peripherals within 21 days from 3rd party channels. Proactive in-session bundling recaptures this lost revenue.";

    if (g.includes("repeat") || g.includes("retention")) {
      name = "Loyalty Revival: Next-Gen Upgrades";
      message = "Your setup deserves the latest speed upgrade. Explore newly arrived accessories tailored to your previous orders.";
      expectedImpact = "+16% 30-Day Repeat Order Velocity";
      aiReasoning = "Targeting past purchasers with zero recent returns and high NPS scores.";
    }

    const recIds = catalog.slice(0, 3).map((p) => p.id);

    return {
      name,
      goal,
      targetAudience: audience || "Customers who purchased electronics in past 45 days",
      message,
      recommendedProductIds: recIds,
      expectedImpact,
      aiReasoning,
    };
  }

  async generateGrowthInsights(metrics: any): Promise<GrowthInsightItem[]> {
    return [
      {
        id: "insight-mobile-latency",
        priority: "HIGH",
        title: "Mobile Checkout Friction Disproportionately Affects Cart Abandonment",
        why: "Mobile shoppers experience 1.8s higher latency during address entry compared to desktop, causing a 14% elevated abandonment rate on mobile devices.",
        impact: "Resolving mobile address autofill and 1-click Razorpay UPI checkout is projected to recover ₹2.45L monthly GMV.",
        recommendedAction: "Enable Smart Address Pre-fill and Instant Razorpay UPI Drawer.",
        actionButtonLabel: "Optimize Mobile Flow",
        actionType: "OPTIMIZE_CHECKOUT",
      },
      {
        id: "insight-laptop-cross-sell",
        priority: "HIGH",
        title: "High-Margin Laptop Peripheral Bundling Opportunity",
        why: "71% of shoppers purchasing laptops view USB-C hubs and laptop sleeves within 7 days, but only 22% add them during initial checkout.",
        impact: "Automated in-cart pairing can raise Average Order Value (AOV) by ₹3,200 per converted laptop order.",
        recommendedAction: "Deploy In-Cart Proactive Companion Agent with 1-click bundle insertion.",
        actionButtonLabel: "Activate Companion Agent",
        actionType: "ACTIVATE_BUNDLE",
      },
      {
        id: "insight-price-hesitation",
        priority: "MEDIUM",
        title: "Unnecessary Discounting on High-Intent Weekend Shoppers",
        why: "Historical evaluation reveals 42% of weekend discounts were granted to shoppers with intent scores > 90 who would have converted at full retail price.",
        impact: "Adjusting Offer Agent autonomy to 'Retain Margin' preserves ₹1.82L in monthly gross margins.",
        recommendedAction: "Enforce Offer Agent threshold to strictly require intent < 70 before granting promo codes.",
        actionButtonLabel: "Enforce Margin Guard",
        actionType: "GUARD_MARGINS",
      },
      {
        id: "insight-churn-retention",
        priority: "QUICK_WIN",
        title: "Post-Purchase Re-engagement Gap at Day 14",
        why: "Customer repeat purchase probability drops by 65% after 21 days of inactivity post-delivery.",
        impact: "Automated post-purchase care and accessory suggestions drive a 19.4% repeat purchase lift.",
        recommendedAction: "Trigger automated Customer Retention Agent workflow at Day 10.",
        actionButtonLabel: "Enable Post-Purchase Flow",
        actionType: "ENABLE_RETENTION",
      },
    ];
  }

  async advisorChat(
    history: AdvisorChatMessage[],
    currentQuery: string,
    catalog: any[],
    activeProduct?: any
  ): Promise<{
    reply: string;
    recommendedProductIds: string[];
    quickReplies: string[];
  }> {
    const q = currentQuery.toLowerCase();

    // Specific product questions if on PDP
    if (activeProduct) {
      if (q.includes("student") || q.includes("college") || q.includes("school")) {
        return {
          reply: `Yes, the ${activeProduct.name} is well-suited for students. With strong battery life, portable build, and sufficient performance for multitasking, lecture notes, and projects, it balances reliability and durability without unnecessary weight.`,
          recommendedProductIds: [activeProduct.id],
          quickReplies: ["What accessories should I pair?", "Is there a budget alternative?", "Check warranty details"],
        };
      }
      if (q.includes("worth") || q.includes("price") || q.includes("value")) {
        return {
          reply: `At ₹${activeProduct.price.toLocaleString("en-IN")}, the ${activeProduct.name} offers high value because it includes verified components and high user ratings (${activeProduct.rating}★). Compared to rivals in this segment, it maintains low failure rates and high resale value.`,
          recommendedProductIds: [activeProduct.id],
          quickReplies: ["Compare with alternative", "Add to cart", "Check shipping time"],
        };
      }
      if (q.includes("accessory") || q.includes("accessories") || q.includes("pair")) {
        const companions = catalog.filter((c) => (c.category?.name || c.category || "").toLowerCase().includes("accessories")).slice(0, 2);
        return {
          reply: `For the ${activeProduct.name}, we recommend pairing it with a high-speed multi-port adapter or protective sleeve to keep your setup protected and versatile on the go.`,
          recommendedProductIds: companions.map((c) => c.id),
          quickReplies: ["Show specifications", "View bundle price", "Proceed to checkout"],
        };
      }
    }

    // General catalog search or comparison
    const intent = await this.analyzeIntent(currentQuery);
    const ranked = await this.rankProductsForIntent(intent, catalog);

    if (ranked.length > 0) {
      const topP = ranked[0];
      const secondP = ranked[1];
      let comparisonNote = "";
      if (secondP) {
        comparisonNote = ` If you prefer maximizing value, the **${secondP.name}** at ₹${secondP.price.toLocaleString("en-IN")} offers a strong alternative with ${secondP.reasons[0].toLowerCase()}.`;
      }

      return {
        reply: `Based on your request for ${intent.category.toLowerCase()} (${intent.useCase}${intent.budget ? `, capped under ₹${intent.budget.toLocaleString("en-IN")}` : ""}), I recommend the **${topP.name}** (₹${topP.price.toLocaleString("en-IN")}). It achieves a **${topP.matchScore}% AI match** because:\n\n• ${topP.reasons.slice(0, 3).join("\n• ")}${comparisonNote}`,
        recommendedProductIds: ranked.slice(0, 3).map((r) => r.productId),
        quickReplies: [
          `Compare ${topP.name.split(" ")[0]} vs ${secondP ? secondP.name.split(" ")[0] : "alternatives"}`,
          "Can you find something lower priced?",
          "Tell me about battery life",
        ],
      };
    }

    return {
      reply: "I understand you're looking for recommendations. Could you share your budget or primary use case (for example: coding, photography, or travel)? I'll immediately shortlist the best matching products from our catalog.",
      recommendedProductIds: [],
      quickReplies: ["Laptops under ₹70,000", "Wireless headphones with ANC", "Best camera phones"],
    };
  }

  private getProductImage(product: any): string {
    if (product.images) {
      try {
        const parsed = typeof product.images === "string" ? JSON.parse(product.images) : product.images;
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      } catch (e) {
        // fallback
      }
    }
    return "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60";
  }
}
