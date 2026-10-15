import fs from 'node:fs';
for (const [name, url] of [
  ['calendar', 'https://luma.com/krowdkraft_community'],
  ['arbitrum', 'https://luma.com/9usbg8kx'],
]) {
  const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
  const html = await response.text();
  fs.mkdirSync('.local-data/luma', { recursive: true });
  fs.writeFileSync(`.local-data/luma/${name}.html`, html);
  const raw = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)?.[1];
  if (raw) {
    const data = JSON.parse(raw);
    fs.writeFileSync(`.local-data/luma/${name}.json`, JSON.stringify(data, null, 2));
    const events = [];
    const visit = (item) => {
      if (!item || typeof item !== 'object') return;
      if (item.name && (item.cover_url || item.start_at)) events.push(item);
      for (const v of Object.values(item)) visit(v);
    };
    visit(data);
    console.log(JSON.stringify({ name, status: response.status, events }));
  } else
    console.log(
      JSON.stringify({
        name,
        status: response.status,
        og: html.match(/<meta[^>]*property="og:image"[^>]*>/)?.[0],
      }),
    );
}
