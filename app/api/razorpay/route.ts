import { auth ,currentUser} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { razorpay } from "@/lib/razorpay";


export async function GET(){
    try{
       const {userId}= await auth();
       const user = await currentUser();
       if(!userId || !user)return new NextResponse("Unauthorized ",{status:401});
       const userSubscription = await prismadb.userSubscription.findUnique({
          where:{
            userId:userId
          }
       })
       if(userSubscription && userSubscription.razorpayPriceId){
        return new NextResponse("Already purchased",{status:200});
       }
       

       const options ={
        amount: Number(100!*100),
        currency :"INR",
        notes:{
             userId:userId,
             name:"Ninja-AI Pro",
             description:"Unlimited AI Generations"
          }
       
        }
    
       const order = await razorpay.orders.create(options);
       return NextResponse.json({order});
    }catch(error){
        console.log("[RAZORPAY_ERROR]",error);
        return new NextResponse("Internal Error",{status:500})
    }
}
