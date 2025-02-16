import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prismadb from '@/lib/prismadb';


const generatedSignature = (
 razorpayOrderId: string,
 razorpayPaymentId: string
) => {
 const keySecret = process.env.NEXT_PUBLIC_RAZORPAY_API_SECRET;
 if (!keySecret) {
  throw new Error(
   'Razorpay key secret is not defined in environment variables.'
  );
 }
 const sig = crypto
  .createHmac('sha256', keySecret)
  .update(razorpayOrderId + '|' + razorpayPaymentId)
  .digest('hex');
 return sig;
};


export async function POST(request: NextRequest) {
 const { order,razorpayOrderId, razorpayPaymentId, razorpaySignature } =
  await request.json();

 const signature = generatedSignature(razorpayOrderId, razorpayPaymentId);

 if (signature !== razorpaySignature) {
  return NextResponse.json(
   { message: 'payment verification failed', isOk: false },
   { status: 400 }
  );
 }
 try{
    
   const purchasing= await prismadb.userSubscription.create({
        data:{
            userId:order.notes.userId,
            razorpaySubscriptionId:razorpayOrderId,
            razorpayPriceId:razorpayPaymentId,
            razorpayCurrentPeriodEnd:new Date()
        }
    })
    return NextResponse.json(
        { message: 'Db purchasing', purchasing,isOk:true },
        { status: 200 }
       );
 }catch(error){
    return NextResponse.json(
        { message: 'Db purchasing failed', isOk: false },
        { status: 400 }
       );
 }

}