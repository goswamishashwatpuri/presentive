"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { addLemonSqueezyApiKey } from "@/actions/user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LemonKeyInput from "./lemon-key-input";
import StoreIdInput from "./store-input";
import LemonSqueezyWebhook from "./lemon-squeezey-webhook";

type Props = {
  lemonSqueezyApiKey: string;
  storeId: string;
  webhookSecret: string;
};

const LemonSqueezAddApiKey = ({
  lemonSqueezyApiKey,
  storeId,
  webhookSecret,
}: Props) => {
  console.log("🍋", !storeId);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [newApiKey, setNewApiKey] = useState("");
  const [newStoreId, setNewStoreId] = useState("");
  const [newWebhookSecret, setNewWebhookSecret] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await addLemonSqueezyApiKey(newApiKey, newStoreId, newWebhookSecret);
      if (res.status !== 200) {
        throw new Error("Unable to add API Key");
      }

      toast.success("API Key added successfully");
      setNewApiKey("");
      setNewStoreId("");
      setNewWebhookSecret("");
      router.refresh();
    } catch (error) {
      console.error("🔴 ERROR", error);
      toast.error("Unable to add API Key");
    } finally {
      setOpen(false);
    }

    if(open){
      setOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-background-80 rounded-xl w-full">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">Lemon Squeezy Integration</h3>
        <p className="text-sm text-secondary">
          Manage your Lemon Squeezy API keys and store settings
        </p>
      </div>
      <div className="flex w-full items-center justify-between gap-x-4">
        <p className="text-base">API Key Status: {lemonSqueezyApiKey ? "Configured" : "Not Configured"}</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            {(!lemonSqueezyApiKey || !storeId || !webhookSecret) && (
              <Button variant="default" className="flex items-center gap-2">
                <Plus />
                Configure
              </Button>
            )}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Lemon Squeezy API Key and Store Id</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col space-y-4 py-4">
              <Input
                type="password"
                placeholder="Enter API Key"
                value={newApiKey}
                onChange={(e) => setNewApiKey(e.target.value)}
                className=""
              />

              <Input
                type="password"
                placeholder="Enter StoreId Key"
                value={newStoreId}
                onChange={(e) => setNewStoreId(e.target.value)}
                className=""
              />

              <Input
                type="password"
                placeholder="Enter Webhook Secret"
                value={newWebhookSecret}
                onChange={(e) => setNewWebhookSecret(e.target.value)}
                className=""
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {lemonSqueezyApiKey && (
        <LemonKeyInput lemonSqueezyApiKey={lemonSqueezyApiKey} />
      )}

      {storeId && <StoreIdInput storeId={storeId} />}

      {webhookSecret && <LemonSqueezyWebhook webhookSecret={webhookSecret} />}
    </div>
  );
};

export default LemonSqueezAddApiKey;
