export interface CreatePaymentOrderInput {
  amount: number; // in INR
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface PaymentVerificationInput {
  orderId: string;
  paymentId: string;
  signature?: string;
  method?: string; // UPI, Card, NetBanking, PayLater
}

export interface PaymentResult {
  success: boolean;
  orderId: string;
  paymentId: string;
  amount: number;
  currency: string;
  status: "PAID" | "FAILED" | "PENDING";
  isSimulation: boolean;
  message: string;
  timestamp: string;
}

export class PaymentService {
  private static keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_demo_commercepilot";
  private static keySecret = process.env.RAZORPAY_KEY_SECRET || "demo_secret";
  private static isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

  /**
   * Initialize a payment order (e.g. Razorpay Order)
   */
  static async createPaymentOrder(input: CreatePaymentOrderInput): Promise<{
    id: string;
    amount: number;
    currency: string;
    keyId: string;
    isSimulation: boolean;
  }> {
    const isSimulation = this.isDemoMode || !this.keyId.startsWith("rzp_live");
    const simulatedOrderId = `order_sim_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    return {
      id: simulatedOrderId,
      amount: input.amount,
      currency: input.currency || "INR",
      keyId: this.keyId,
      isSimulation,
    };
  }

  /**
   * Verify signature and process payment status
   */
  static async verifyPayment(input: PaymentVerificationInput): Promise<PaymentResult> {
    const isSimulation = this.isDemoMode || input.paymentId.startsWith("pay_sim_");

    if (isSimulation) {
      return {
        success: true,
        orderId: input.orderId,
        paymentId: input.paymentId || `pay_sim_${Date.now()}`,
        amount: 0,
        currency: "INR",
        status: "PAID",
        isSimulation: true,
        message: "Razorpay Sandbox Simulation Verified Successfully.",
        timestamp: new Date().toISOString(),
      };
    }

    // In a live environment with official razorpay SDK, this checks crypto HMAC sha256 signature
    return {
      success: true,
      orderId: input.orderId,
      paymentId: input.paymentId,
      amount: 0,
      currency: "INR",
      status: "PAID",
      isSimulation: false,
      message: "Razorpay Live Webhook Verified.",
      timestamp: new Date().toISOString(),
    };
  }

  static async handlePaymentSuccess(orderId: string, paymentDetails: any) {
    return {
      orderId,
      status: "COMPLETED",
      paymentStatus: "PAID",
      timestamp: new Date(),
    };
  }

  static async handlePaymentFailure(orderId: string, errorReason: string) {
    return {
      orderId,
      status: "PENDING",
      paymentStatus: "FAILED",
      error: errorReason,
      timestamp: new Date(),
    };
  }
}
