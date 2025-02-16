import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { Client } from "@gradio/client";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import axios from "axios";

const client = await Client.connect("CereusTech/Sepia_Text_to_Video", { hf_token: `hf_${process.env.HFW_API_TOKEN}`});
const getSubscriptionStatus = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/subscription`);
    return data.isPro;
  };
export async function POST(req:Request) {
    try {
        const { userId } = await auth();
        const body = await req.json();
        const { prompt } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!prompt) {
            return new NextResponse("Prompt is required", { status: 400 });
        }
        
        const freeTrial = await checkApiLimit();
        const {isPro} = await getSubscriptionStatus ();
        if(!freeTrial && !isPro){
            return new NextResponse("Free Trial has expired",{status:403});

        }
     
        const result = await client.predict("/predict", { 		
          prompt: prompt, 		
          max_duration: 10, 		
          aspect_ratio: "landscape", 
      });
        
      if(!isPro) await increaseApiLimit();

      return NextResponse.json(result.data);
    } catch (error) {
        console.error("[VIDEO_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
