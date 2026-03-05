export async function fetchYoutubeVideos(query: string) {
  const url =
    `https://www.googleapis.com/youtube/v3/search` +
    `?part=snippet&type=video&order=date&maxResults=10&q=${encodeURIComponent(query)}` +
    `&key=${process.env.YOUTUBE_API_KEY || ""}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("YouTube API request failed");
  const data = await res.json();
  return data.items || [];
}
