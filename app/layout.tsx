import type { Metadata } from "next";
import { StoreProvider } from "@/app/providers";
import "@/shared/styles/globals.css";

export const metadata: Metadata = {
  title: "timeFlies — Календарь жизни",
  description:
    "Увидь свою жизнь в неделях. 75 лет. 3 900 недель. Каждый квадратик — одна неделя.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
