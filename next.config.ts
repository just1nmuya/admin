

// export default nextConfig;

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   images: {
//     domains: ["cloudinary.com"],
//   },
// };

// export default nextConfig;

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactStrictMode: true, // Enables React strict mode to highlight potential issues during development
//   images: {
//     domains: ["res.cloudinary.com"], // Allow images from Cloudinary domain
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Enables React strict mode to highlight potential issues during development
  images: {
    remotePatterns: [
      {
        protocol: "https", // Use 'https' for Cloudinary
        hostname: "res.cloudinary.com", // Cloudinary's domain
        port: "", // Leave empty for default ports
        pathname: "/**", // Match all paths
      },
    ],
  },
};

export default nextConfig;
