import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the tracing root to this repo (multiple lockfiles exist on the machine).
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.ctfassets.net' }],
  },
};

export default nextConfig;
