"use server"
import { client } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export const onAuthenticateUser = async () => {
  try {
    const user = await currentUser()
    if (!user) {
      return { status: 403 }
    }
    const userExists = await client.user.findUnique({
      where: {
        clerkId: user.id
      },
      include: {
        purchasedProjects: {
          select: {
            id: true
          }
        }
      }
    })

    if (userExists) {
      return { status: 200, user: userExists }
    }

    const newUser = await client.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: user.firstName + " " + user.lastName,
        profileImage: user.imageUrl,
      }
    })
    if (newUser) {
      return { status: 201, user: newUser }
    }
    return { status: 400 }
  } catch (error) {
    console.log("🔴 ERROR: ", error)
    return { status: 500 }
  }
}
export const updateLemonSqueezyApiKey = async (apiKey: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 403 };
    }

    const updateUser = await client.user.update({
      where: {
        clerkId: user.id,
      },

      data: {
        lemonSqueezyApiKey: apiKey,
      },
    });
    if (!updateUser) {
      return { status: 400, error: "Unable to update user" };
    }

    return { status: 200 , user: updateUser};
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500 };
  }
}

export const addLemonSqueezyApiKey = async (apiKey: string, storeId:string, webhookSecret:string) => {

  try {
    const user = await currentUser();
    if (!user) {
      return { status: 403 };
    }

    const updateUser = await client.user.update({
      where: {
        clerkId: user.id,
      },

      data: {
        lemonSqueezyApiKey: apiKey,
        storeId: storeId,
        webhookSecret: webhookSecret
      },
    });
    if (!updateUser) {
      return { status: 400, error: "Unable to update user" };
    }

    return { status: 200 , user: updateUser};
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500 };
  }
};

export const updateWebhookSecret = async (webhookSecret: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 403 };
    }



    const updateUser = await client.user.update({
      where: {
        clerkId: user.id,
      },

      data: {
        webhookSecret: webhookSecret,
      },
    });
    if (!updateUser) {
      return { status: 400, error: "Unable to update user" };
    }

    return { status: 200 , user: updateUser};
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500 };
  }
}

export const updateStoreId = async (storeId: string) => {

  try {
    const user = await currentUser();
    if (!user) {
      return { status: 403 };
    }

    const updateUser = await client.user.update({
      where: {
        clerkId: user.id,
      },

      data: {
        storeId: storeId
      },
    });
    if (!updateUser) {
      return { status: 400, error: "Unable to update user" };
    }

    return { status: 200 , user: updateUser};
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500 };
  }
}