// app/sitemap.js
// Next.js App Router sitemap generation.
// Returns XML sitemap at /sitemap.xml automatically.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rentblackbear.com";

export default function sitemap() {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/apply`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
