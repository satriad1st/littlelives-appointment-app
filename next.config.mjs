import withPWA from "next-pwa";

const isDev = process.env.NODE_ENV === "development";

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "dist/frontend",
  images: {
    minimumCacheTTL: 60 * 60 * 24, // 24 hours for images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
      },
    ],
  },
  env: {
    APP_ENV: process.env.APP_ENV,
  },

  experimental: {
    optimizeCss: process.env.NODE_ENV === "production",
    optimizePackageImports: [
      "@radix-ui/react-dialog",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-visually-hidden",
      "lucide-react",
    ],
    serverComponentsExternalPackages: [],
  },
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{member}}",
      preventFullImport: true,
    },
  },
  headers: async () => [
    // Static assets (images, fonts, etc)
    {
      source: "/:all*\\.(svg|jpg|jpeg|png|webp|avif)$",
      locale: false,
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable", // 1 year for static images
        },
      ],
    },
    // Fonts
    {
      source: "/:all*\\.(woff|woff2|otf|ttf)$",
      locale: false,
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable", // 1 year for fonts
        },
      ],
    },
    // API responses
    {
      source: "/api/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=300, stale-while-revalidate=300", // 5 minutes with SWR
        },
      ],
    },
    // Service Worker - no caching
    {
      source: "/sw.js",
      headers: [
        {
          key: "Content-Type",
          value: "application/javascript; charset=utf-8",
        },
        {
          key: "Cache-Control",
          value: "no-cache, no-store, must-revalidate",
        },
      ],
    },
  ],
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: isDev,
  fallbacks: {
    document: "/~offline",
    image: "/icon0.svg",
  },

  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
  sw: "/sw.js",
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /\/_next\/image\?url=.+$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "next-image",
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60,
        },
      },
    },
    {
      urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "static-image-assets",
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60,
        },
      },
    },
  ],

  exclude: [
    ({ asset, compilation }) => {
      if (
        asset.name.startsWith("server/") ||
        asset.name.match(/^((app-|^)build-manifest\.json|react-loadable-manifest\.json)$/)
      ) {
        return true;
      }
      if (isDev && !asset.name.startsWith("static/runtime/")) {
        return true;
      }
      return false;
    },
  ],
})(nextConfig);
