// 🧠 FILE PURPOSE
// This file generates a sitemap.xml for search engines to crawl.
// It helps with SEO by listing all important pages in your app.

import { MetadataRoute } from 'next';

// Step 1: Define the sitemap export function
// Next.js automatically converts this to sitemap.xml
export default function sitemap(): MetadataRoute.Sitemap {
  // Step 2: Define base URL (update with your actual domain)
  const baseUrl = 'https://duolearn.com';

  // Step 3: List all static pages
  // These are pages that don't require dynamic parameters
  const staticPages = [
    '',
    '/learn',
    '/shop',
    '/leagues',
    '/profile',
    '/character',
    '/dark-psychology-dashboard',
    '/dark-psychology-section-a',
    '/dark-psychology-section-b',
    '/dark-psychology-section-c',
    '/dark-psychology-section-d',
    '/dark-psychology-notes',
    '/dark-psychology-bookmarks',
    '/dark-psychology-review',
    '/dark-psychology-achievements',
    '/privacy',
    '/terms',
    '/offline',
  ];

  // Step 4: Map static pages to sitemap format
  // Each page needs: url, lastModified, changeFrequency, priority
  const staticRoutes = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Step 5: Add less frequently changing pages
  const legalPages = [
    { url: `${baseUrl}/privacy`, priority: 0.5 },
    { url: `${baseUrl}/terms`, priority: 0.5 },
  ].map((page) => ({
    ...page,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
  }));

  // Step 6: Combine all routes
  return [
    ...staticRoutes,
    // Note: If you have dynamic lesson pages, you would fetch and add them here
    // Example: lessons fetched from database
  ];
}

// ✅ In this file we achieved:
// Automatic sitemap generation for SEO
// All static pages included
// Proper priority and change frequency settings
// Ready for search engine indexing
