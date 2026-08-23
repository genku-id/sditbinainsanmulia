import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Izinkan optimasi gambar dari Cloudinary (tempat upload galeri & foto siswa).
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
    ],
  },
};

export default nextConfig;
