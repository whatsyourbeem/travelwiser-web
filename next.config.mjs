
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                // Agoda API가 https와 http 이미지 주소를 모두 반환할 수 있으므로, 두 프로토콜을 모두 허용합니다.
                protocol: 'https',
                hostname: 'pix8.agoda.net',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'pix8.agoda.net',
                port: '',
                pathname: '/**',
            },
            {
                // Booking.com (bstatic.com) 이미지 CDN을 허용합니다. (http)
                protocol: 'http',
                hostname: '**.bstatic.com',
                port: '',
                pathname: '/**',
            },
            {
                // Booking.com (bstatic.com) 이미지 CDN을 허용합니다. (https)
                protocol: 'https',
                hostname: '**.bstatic.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    async headers() {
        return [
            {
                source: '/.well-known/apple-app-site-association',
                headers: [
                    { key: 'Content-Type', value: 'application/json' },
                ],
            },
        ];
    },
};

export default nextConfig;
