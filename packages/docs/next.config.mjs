/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for docs site
  output: 'export',
  
  // Configure for monorepo
  transpilePackages: ['@create-markdown/core', '@create-markdown/mdx'],
  
  // Optimize images for static export
  images: {
    unoptimized: true,
  },
  
  // Enable experimental features
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['lucide-react', 'shiki'],
  },
};

export default nextConfig;
