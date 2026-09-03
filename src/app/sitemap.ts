import { MetadataRoute } from "next";

export const runtime = 'edge';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://ceylontrails.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
