/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image-us.samsung.com" },
      { protocol: "https", hostname: "store.storeimages.cdn-apple.com" },
      { protocol: "https", hostname: "i02.appmifile.com" },
      { protocol: "https", hostname: "dlcdnwebimgs.asus.com" },
      { protocol: "https", hostname: "media.kingston.com" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
