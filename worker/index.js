const SAFE_NAME = /^[A-Za-z0-9._-]+$/;

async function keepSupabaseAwake(env) {
  const response = await fetch(`${env.SUPABASE_URL}/rest/v1/products?select=id&limit=1`, {
    headers: {
      apikey: env.SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_PUBLISHABLE_KEY}`,
    },
  });
  console.log(`Supabase keep-alive: ${response.status}`);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/img/")) {
      const name = url.pathname.slice("/img/".length);
      if (!SAFE_NAME.test(name)) {
        return new Response("Not found", { status: 404 });
      }

      const cache = caches.default;
      const cached = await cache.match(request);
      if (cached) return cached;

      const upstream = await fetch(
        `${env.SUPABASE_URL}/storage/v1/object/public/product-images/${name}`,
        { cf: { cacheEverything: true, cacheTtl: 604800 } }
      );
      if (!upstream.ok) {
        return new Response("Not found", { status: upstream.status });
      }

      const response = new Response(upstream.body, upstream);
      response.headers.set("Cache-Control", "public, max-age=604800");
      ctx.waitUntil(cache.put(request, response.clone()));
      return response;
    }

    return env.ASSETS.fetch(request);
  },

  async scheduled(controller, env, ctx) {
    ctx.waitUntil(keepSupabaseAwake(env));
  },
};
