"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AlertDialogBox from "@/components/global/alert-dialog";
import { toast } from "sonner";
import { client } from "@/lib/prisma";

interface CancelSubscriptionProps {
  userId: string;
}

export default function CancelSubscription({ userId }: CancelSubscriptionProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCancelSubscription = async () => {
    setLoading(true);
    try {
      // Update user's subscription status in the database
      const updatedUser = await client.user.update({
        where: { id: userId },
        data: { subscription: false },
      });

      if (!updatedUser) {
        throw new Error("Failed to cancel subscription");
      }

      toast.success("Subscription cancelled successfully");
      setOpen(false);
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast.error("Failed to cancel subscription. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-background-80 rounded-xl w-full">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">Subscription Management</h3>
        <p className="text-sm text-secondary">
          Cancel your subscription at any time. Your access will continue until the end of your current billing period.
        </p>
      </div>
      <AlertDialogBox
        open={open}
        handleOpen={(value: boolean) => setOpen(value)}
        description="Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your current billing period."
        loading={loading}
        onClick={handleCancelSubscription}
      >
        <Button variant="destructive" className="w-full">
          Cancel Subscription
        </Button>
      </AlertDialogBox>
    </div>
  );
} 