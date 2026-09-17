import type { Metadata } from "next";
import type { ReactNode } from "react";
import SiteLayout from "@/common/layout/SiteLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "안중겸 · Devyne An | 웹 개발자",
  description: "업무 흐름을 이해하고 화면부터 API와 데이터 처리까지 연결하는 웹 개발자 안중겸의 포트폴리오입니다.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
