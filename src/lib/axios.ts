import axios from "axios";

const lemonSqueezyClient = (lemonSqueezyApiKey?: string) => {
  console.log("lemonSqueezyApiKey", lemonSqueezyApiKey);
  console.log("process.env.NEXT_PUBLIC_LEMON_SQUEEZY_API_URL", process.env.NEXT_PUBLIC_LEMON_SQUEEZY_API_URL);
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_API_URL,
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${
        lemonSqueezyApiKey
          ? lemonSqueezyApiKey
          : process.env.LEMON_SQUEEZY_API_KEY
      }`,
    },
  });
};

export default lemonSqueezyClient;
