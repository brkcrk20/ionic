import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";

const ionStyle = localFont({
  src: "../public/fonts/IonStyle.woff2",
  variable: "--font-ion",
});

const montserrat = localFont({
  src: "../public/fonts/Montserrat-VariableFont_wght.woff2",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "ion",
  description: "Modern ve Minimalist Bir Deneyim",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 'style' kısmını sildik, böylece font yönetimi tamamen Tailwind'e geçti
    <html lang="tr" className={`${ionStyle.variable} ${montserrat.variable}`}>
      {/* 
          font-sans: Tailwind config'deki 'sans' (Montserrat) değerini kullanır.
          antialiased: Yazıların daha keskin görünmesini sağlar.
      */}
      <body className="bg-foreground text-customText font-sans antialiased">
        {children}
      </body>
    </html>
  );
}