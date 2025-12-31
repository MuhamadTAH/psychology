import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body?.email as string | undefined)?.trim();
    const couponCode = (body?.couponCode as string | undefined)?.trim();
    const userName = (body?.name as string | undefined)?.trim();

    if (!resendApiKey || !resend) {
      return NextResponse.json(
        { error: "RESEND_API_KEY is not configured on the server" },
        { status: 500 },
      );
    }

    if (!email || !couponCode) {
      return NextResponse.json(
        { error: "email and couponCode are required" },
        { status: 400 },
      );
    }

    const greeting = userName ? `Hi ${userName},` : "Hi there,";
    const result = await resend.emails.send({
      // Use a verified or default sender; replace with your domain once verified in Resend.
      from: "DuoLearn <onboarding@resend.dev>",
      to: email,
      subject: "Your DuoLearn discount code",
      text: [
        greeting,
        "",
        "Here is your discount code for DuoLearn:",
        `Code: ${couponCode}`,
        "",
        "Use this code at checkout on the paywall to apply your discount.",
        "",
        "If you did not request this code, you can ignore this email.",
        "",
        "— DuoLearn Team",
      ].join("\n"),
    });

    return NextResponse.json({
      success: true,
      id: result.data?.id ?? null,
    });
  } catch (error: any) {
    console.error("[SEND-COUPON] Failed to send coupon email:", error);
    return NextResponse.json(
      { error: "Failed to send coupon email" },
      { status: 500 },
    );
  }
}
