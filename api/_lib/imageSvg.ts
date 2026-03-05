function hashText(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h >>> 0);
}

function esc(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function svgDataUriForProduct(name: string, category: string): string {
  const seed = hashText(`${category}::${name}`);
  const hueA = seed % 360;
  const hueB = (seed * 7) % 360;
  const hueC = (seed * 13) % 360;

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='900' viewBox='0 0 1600 900'>
  <defs>
    <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='hsl(${hueA} 60% 28%)'/>
      <stop offset='55%' stop-color='hsl(${hueB} 55% 20%)'/>
      <stop offset='100%' stop-color='hsl(${hueC} 45% 14%)'/>
    </linearGradient>
    <filter id='n'>
      <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>
      <feColorMatrix type='saturate' values='0'/>
      <feComponentTransfer>
        <feFuncA type='table' tableValues='0 0.08'/>
      </feComponentTransfer>
    </filter>
  </defs>
  <rect width='1600' height='900' fill='url(#g)'/>
  <circle cx='1240' cy='170' r='320' fill='hsl(${hueB} 75% 70% / 0.10)'/>
  <circle cx='250' cy='760' r='360' fill='hsl(${hueA} 85% 68% / 0.12)'/>
  <rect width='1600' height='900' filter='url(#n)'/>
  <rect x='70' y='70' rx='28' ry='28' width='420' height='64' fill='hsl(0 0% 100% / 0.12)'/>
  <text x='95' y='112' fill='white' font-size='34' font-family='Inter, Arial, sans-serif' opacity='0.95'>${esc(category)}</text>
  <text x='90' y='360' fill='white' font-size='72' font-weight='700' font-family='Inter, Arial, sans-serif'>${esc(name)}</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
