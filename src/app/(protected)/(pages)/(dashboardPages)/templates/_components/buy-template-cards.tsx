"use client";
import {
  containerVariants,
  itemVariants,
} from "@/lib/constants";
import { timeAgo } from "@/lib/utils";
import { motion } from "framer-motion";
import { Project } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { buyTemplate } from "@/actions/lemonSqueezy";
import { getUser } from "@/actions/user";
import ThumbnailPreview from "@/components/global/projects/thumbnail-preview";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
type Props = {
  projects: Project[];
  user: any;
};

export const BuyTemplateCard = ({ projects, user }: Props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBuy = async (
    variantId: string,
    projectId: string,
    sellerId: string
  ) => {
    setLoading(true);

    if (!variantId) {
      setLoading(false);
      toast.error("Variant not found");
      return;
    }

    const seller = await getUser(sellerId);
    if (
      seller.status !== 200 ||
      !seller.user?.lemonSqueezyApiKey ||
      !seller.user?.storeId ||
      !seller.user?.webhookSecret
    ) {
      setLoading(false);
      toast.error("Seller Details not found");
      return;
    }

    try {
      const res = await buyTemplate(
        variantId,
        projectId,
        seller.user.webhookSecret,
        sellerId,
        user.id
      );
      if (res.status !== 200) {
        throw new Error("Unable to buy template");
      }
      toast.success("Redirecting to Lemon Squeezy");
      router.push(res.url);
    } catch (error) {
      console.error("🔴 ERROR", error);
      toast.error("Unable to buy template");
    } finally {
      setLoading(false);
    }
  };
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {projects.map((project, i) => (
        <motion.div
          className={`group w-full flex flex-col gap-y-3 rounded-xl p-3 transition-colors`}
          variants={itemVariants}
          key={i}
        >
          <div
            className="relative aspect-[16/10] overflow-hidden rounded-lg cursor-pointer"
            onClick={() => { }}
          >
            <ThumbnailPreview
              slide={JSON.parse(JSON.stringify(project.slides))?.[0]}
              themeName={project.themeName}
            />
          </div>
          <div className="w-full">
            <div className="space-y-1">
              <h3 className="font-semibold text-base text-primary line-clamp-1">
                {project.title}
              </h3>
              <div className="flex w-full justify-between items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  {timeAgo(project.createdAt.toString())}
                </p>

                <Button
                  size="sm"
                  variant="destructive"
                  disabled={
                    loading ||
                    user.id === project.userId ||
                    user?.PurchasedProjects?.some((p: any) => p.id === project.id)
                  }
                  onClick={() =>
                    handleBuy(
                      project.vriantId || "",
                      project.id,
                      project.userId
                    )
                  }
                >
                  {loading
                    ? "Processing..."
                    : user.PurchasedProjects?.some((p: any) => p.id === project.id)
                      ? "Owned"
                      : "Buy"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
