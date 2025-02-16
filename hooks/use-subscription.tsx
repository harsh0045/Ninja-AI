"use client";
import axios from "axios";
import { useState, useEffect } from "react";

export const useSubscription = () => {
    const [isPro, setIsPro] = useState<boolean | null>(null); // Initial state as `null` for loading state
  const [expireDate,setExpireDate]=useState<Date | null>(null);
  useEffect(() => {
    const fetchSubscription = async () => {
      const {data:{isPro,expireDate}} = await axios.get("/api/subscription");

      setIsPro(isPro);
      setExpireDate(expireDate)
    };

    if (isPro === null)  fetchSubscription();
  }, []);

  return {isPro,expireDate};
};