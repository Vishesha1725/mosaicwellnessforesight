export const env = {
  serpApiKey: process.env.SERPAPI_API_KEY || process.env.SERPAPI_KEY || process.env.SERP_API_KEY || "",
  youtubeApiKey: process.env.YOUTUBE_API_KEY || "",
};

export function validateKeys() {
  return {
    serpApi: !!env.serpApiKey,
    youtube: !!env.youtubeApiKey,
  };
}
