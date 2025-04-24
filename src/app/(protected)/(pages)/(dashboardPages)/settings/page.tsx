import React from "react";
import LemonSqueezAddApiKey from "./_components/lemon-squeezey-add-api-key";
import CancelSubscription from "./_components/cancel-subscription";
import { onAuthenticateUser } from "@/actions/user";

const page = async () => {
  const checkUser = await onAuthenticateUser();
  return (
    <div className="flex flex-col gap-6 p-2 relative mx-auto w-full">
      <div className="flex justify-between items-center">
        <div className="flex flex-col items-start">
          <h1 className="text-2xl font-semibold dark:text-primary backdrop-blur-lg">
            Settings
          </h1>
          <p className="text-base font-normal dark:text-secondary">
            All your settings
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <LemonSqueezAddApiKey
          lemonSqueezyApiKey={checkUser?.user?.lemonSqueezyApiKey || ""}
          storeId={checkUser?.user?.storeId || ""}
          webhookSecret={checkUser?.user?.webhookSecret || ""}
        />
        {checkUser?.user?.subscription && (
          <CancelSubscription userId={checkUser.user.id} />
        )}
      </div>
    </div>
  );
};

export default page;
