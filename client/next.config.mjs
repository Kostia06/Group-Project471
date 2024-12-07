/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    async rewrites() {
        return [
            {
                source: "/api/:path*", // Route all /api/* requests
                destination: "http://127.0.0.1:5000/:path*", // Redirect to FastAPI server
            },
        ];
    },
};

export default nextConfig;
