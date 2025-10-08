import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
  const BASE_URL = site || 'https://lemonpunch.fr';
  const WORDPRESS_URL = import.meta.env.BASE_URL_WORDPRESS;
  const WOO_URL = 'https://shop.lemonpunch.fr/wp-json/wc/v3/products';
  const WOO_KEY = import.meta.env.WOOCOMMERCE_KEY;
  const WOO_SECRET = import.meta.env.WOOCOMMERCE_SECRET;

  // URLs statiques
  const staticPages = [
    { url: '', changefreq: 'daily', priority: 1.0 },
    { url: 'albums', changefreq: 'weekly', priority: 0.9 },
    { url: 'produits', changefreq: 'weekly', priority: 0.9 },
    { url: 'concerts', changefreq: 'weekly', priority: 0.9 },
    { url: 'actus', changefreq: 'weekly', priority: 0.8 },
  ];

  // Récupérer les albums depuis WordPress
  let albums: Array<{ slug: string; modified: string }> = [];
  try {
    const albumsResponse = await fetch(`${WORDPRESS_URL}albums?per_page=100`);
    if (albumsResponse.ok) {
      const albumsData = await albumsResponse.json();
      albums = albumsData.map((album: any) => ({
        slug: album.slug,
        modified: album.modified || album.date
      }));
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des albums:', error);
  }

  // Récupérer les produits depuis WooCommerce
  let products: Array<{ slug: string; modified: string }> = [];
  try {
    const productsResponse = await fetch(
      `${WOO_URL}?consumer_key=${WOO_KEY}&consumer_secret=${WOO_SECRET}&per_page=100`
    );
    if (productsResponse.ok) {
      const productsData = await productsResponse.json();
      products = productsData.map((product: any) => ({
        slug: product.slug,
        modified: product.date_modified || product.date_created
      }));
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
  }

  // Récupérer les événements depuis WordPress
  let events: Array<{ slug: string; modified: string }> = [];
  try {
    const eventsResponse = await fetch(`${WORDPRESS_URL}evenements?per_page=100`);
    if (eventsResponse.ok) {
      const eventsData = await eventsResponse.json();
      events = eventsData.map((event: any) => ({
        slug: event.slug,
        modified: event.modified || event.date
      }));
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
  }

  // Récupérer les actus depuis WordPress
  let posts: Array<{ slug: string; modified: string }> = [];
  try {
    const postsResponse = await fetch(`${WORDPRESS_URL}posts?per_page=100`);
    if (postsResponse.ok) {
      const postsData = await postsResponse.json();
      posts = postsData.map((post: any) => ({
        slug: post.slug,
        modified: post.modified || post.date
      }));
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des actus:', error);
  }

  // Générer le XML du sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('')}
  ${albums
    .map(
      (album) => `
  <url>
    <loc>${BASE_URL}albums/${album.slug}</loc>
    <lastmod>${new Date(album.modified).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('')}
  ${products
    .map(
      (product) => `
  <url>
    <loc>${BASE_URL}produits/${product.slug}</loc>
    <lastmod>${new Date(product.modified).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('')}
  ${events
    .map(
      (event) => `
  <url>
    <loc>${BASE_URL}concerts/${event.slug}</loc>
    <lastmod>${new Date(event.modified).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join('')}
  ${posts
    .map(
      (post) => `
  <url>
    <loc>${BASE_URL}actus/${post.slug}</loc>
    <lastmod>${new Date(post.modified).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600', // Cache pendant 1 heure
    },
  });
};
