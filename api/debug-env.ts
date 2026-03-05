export default async function handler(_req: any, res: any) {
  res.status(200).json({
    serpApiLoaded: !!process.env.SERPAPI_API_KEY,
    youtubeLoaded: !!process.env.YOUTUBE_API_KEY,
  });
}
