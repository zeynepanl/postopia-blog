import { Alegreya } from "next/font/google"; // Alegreya fontunu ekle
import "./globals.css";

// Alegreya fontunu tanımla
const alegreya = Alegreya({
  subsets: ["latin"],
  weight: ["400", "700"], // Normal ve Bold versiyonlarını ekle
  variable: "--font-alegreya", // Tailwind için değişken tanımla
});

export const metadata = {
  title: "Postopia",
  description: "A modern blog platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${alegreya.variable} font-alegreya bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}
