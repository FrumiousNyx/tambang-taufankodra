/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  redirects: async () => {
    return [
      { source: '/', destination: '/id', permanent: false },
      { source: '/produk', destination: '/id/produk', permanent: false },
      { source: '/produk/:slug*', destination: '/id/produk/:slug*', permanent: false },
      { source: '/proyek', destination: '/id/proyek', permanent: false },
      { source: '/proyek/:slug*', destination: '/id/proyek/:slug*', permanent: false },
      { source: '/download', destination: '/id/download', permanent: false },
      { source: '/tentang', destination: '/id/tentang', permanent: false },
      { source: '/kontak', destination: '/id/kontak', permanent: false },
      { source: '/auth', destination: '/id/auth', permanent: false },
      { source: '/keberlanjutan', destination: '/id/keberlanjutan', permanent: false },
      { source: '/investor', destination: '/id/investor', permanent: false },
      { source: '/csr', destination: '/id/csr', permanent: false },
      { source: '/dashboard', destination: '/id/dashboard', permanent: false },
      { source: '/admin', destination: '/id/admin', permanent: false },
      { source: '/cms', destination: '/id/cms', permanent: false },
      { source: '/p/:slug*', destination: '/id/p/:slug*', permanent: false }
    ];
  }
};

export default nextConfig;
