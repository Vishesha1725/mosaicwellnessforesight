export default async function handler(_req: any, res: any) {
  res.status(200).json({
    serpapi: !!(process.env.SERPAPI_API_KEY || process.env.SERPAPI_KEY || process.env.SERP_API_KEY),
    youtube: !!process.env.YOUTUBE_API_KEY,
  });
}
