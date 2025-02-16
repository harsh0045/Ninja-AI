
"use client";

import { Zap } from "lucide-react";
import { Button } from "./ui/button";


import { useProModal } from "@/hooks/user-pro-modal";


interface SubscriptionButton {
    isPro:boolean;
}
const SubscriptionButton = ({isPro}:SubscriptionButton) => {
    
    const promodal =useProModal();
   
  return (
    <Button className="px-10 py-5" onClick={promodal.onOpen} variant={isPro ? "default" :"premium"}>
        {isPro ? "Manage Subscription":"Upgrade"}
        {!isPro && <Zap className=" fill-white"/>}
    </Button>
  )
}

export default SubscriptionButton