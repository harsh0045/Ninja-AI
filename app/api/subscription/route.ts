import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export async function GET() {
  const { userId } = await auth(); // ✅ Server-side authentication
  if (!userId) return NextResponse.json({ isPro: false ,expireDate:new Date() });

  const userSubscription = await prismadb.userSubscription.findUnique({
    where: { userId },
    select: { razorpayCurrentPeriodEnd: true, razorpayPriceId: true,razorpaySubscriptionId:true },
  });

  if (!userSubscription ) return NextResponse.json({ isPro: false ,expireDate:new Date()});

  const futureDate = new Date(userSubscription.razorpayCurrentPeriodEnd!);
  futureDate.setDate(userSubscription.razorpayCurrentPeriodEnd!.getDate() + 30);

  return NextResponse.json({ isPro: userSubscription.razorpayPriceId && futureDate > new Date(),expireDate:futureDate });
}
