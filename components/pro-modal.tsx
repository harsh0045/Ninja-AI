"use client";

import { useProModal } from "@/hooks/user-pro-modal";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import toast from "react-hot-toast";
import { Check, Code, ImageIcon, MessageSquare, Music, VideoIcon, Zap } from "lucide-react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSubscription } from "@/hooks/use-subscription";


declare global {
  interface Window {
    Razorpay: any;
  }
}

const tools = [
  { label: "Conversation", icon: MessageSquare, color: "text-violet-500", bgColor: "bg-violet-500/10", href: "/conversation" },
  { label: "Music Generation", icon: Music, color: "text-emerald-500", bgColor: "bg-emerald-500/10", href: "/music" },
  { label: "Image Generation", icon: ImageIcon, color: "text-pink-700", bgColor: "bg-pink-700/10", href: "/image" },
  { label: "Video Generation", icon: VideoIcon, color: "text-orange-700", bgColor: "bg-orange-700/10", href: "/video" },
  { label: "Code Generation", icon: Code, color: "text-green-700", bgColor: "bg-green-700/10", href: "/code" },
];

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const ProModal = () => {
  const proModal = useProModal();
  const [isLoading, setIsLoading] = useState(false);
  const {isPro, expireDate} = useSubscription();
  const day = expireDate ? new Date(expireDate).getDate() : 0;
  const month = expireDate ? new Date(expireDate).getMonth() : 0;

  const onSubscribe = async () => {
    try {
      setIsLoading(true);
      const { data: { order} } = await axios.get(`/api/razorpay`);
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        name: "Ninja-AI Pro",
        description: "Testing-phase",
        amount: order.amount,
        currency: "INR",
        order_id: order.id,
        prefill: { name: "Gaurav Kumar", email: "gaurav.kumar@example.com", contact: "9000090000" },
        handler: async function (response: any) {
          try {
            await axios.post('/api/PaymentVerify', {
              order,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success("Purchase successful");
          } catch (error) {
            console.log(error);
            toast.error("Payment verification failed");
          }
        },
        theme: { color: "3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      {!isPro && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
              <div className="flex items-center gap-x-2 font-bold py-1">
                Upgrade to Ninja-AI
                <Badge className="uppercase text-sm py-1" variant="premium">
                  pro
                </Badge>
              </div>
            </DialogTitle>
            <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
              {tools.map((tool) => (
                <Card key={tool.label} className="p-3 border-black/5 flex items-center justify-between">
                  <div className="flex items-center gap-x-4">
                    <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                      <tool.icon className={cn("w-6 h-6", tool.color)} />
                    </div>
                    <div className="font-semibold text-sm">{tool.label}</div>
                  </div>
                  <Check className="text-primary w-5 h-5" />
                </Card>
              ))}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={onSubscribe} disabled={isLoading} size="lg" variant="premium" className="w-full">
              Upgrade
              <Zap className="h-4 w-4 ml-2 fill-white" />
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
      {isPro && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
              <div className="flex items-center gap-x-2 font-bold py-1">
                Already Upgraded to Ninja-AI
                <Badge className="uppercase text-sm py-1" variant="premium">
                  pro
                </Badge>
              </div>
            </DialogTitle>
            <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
              <Card className="p-3 border-black/5 flex  justify-center items-center">
             
                    <div className="p-2 w-fit rounded-md">
                     Plan will expires on {`${day} `} {months[month]}
                    </div>
         
              </Card>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ProModal;