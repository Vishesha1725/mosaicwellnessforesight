export async function GET() {
  return Response.json({
    serpApiLoaded: !!process.env.SERPAPI_API_KEY,
    youtubeLoaded: !!process.env.YOUTUBE_API_KEY,
  });
}
