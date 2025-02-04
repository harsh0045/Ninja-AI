import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { Client } from "@gradio/client";

const client = await Client.connect("CereusTech/Sepia_Text_to_Video", { hf_token: `hf_${process.env.HFW_API_TOKEN}`});
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

     
        const result = await client.predict("/predict", { 		
          prompt: prompt, 		
          max_duration: 10, 		
          aspect_ratio: "landscape", 
      });
        console.log(result);
        
        return NextResponse.json(result.data);
    } catch (error) {
        console.error("[VIDEO_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
