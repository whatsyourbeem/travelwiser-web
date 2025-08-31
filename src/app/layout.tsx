import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "트래블와이저 - 호텔 가격 변동 추적",
  description:
    "지금 이 순간에도 아고다 호텔 가격은 바뀌고 있어요. 실시간 가격 변동을 추적하고 가장 저렴한 시점에 예약하세요! 똑똑한 여행자를 위한 숙소 예약 앱 트래블와이저.",
  openGraph: {
    images: ["/img/og-image.png"],
  },
  icons: {
    icon: "/img/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
