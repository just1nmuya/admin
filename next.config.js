// next.config.js

// You don't need an import statement here in next.config.js
// Next.js automatically handles the configuration in this file

module.exports = {
  reactStrictMode: true, // Optional: Enable React Strict Mode
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Other configurations can be added here as needed
};
