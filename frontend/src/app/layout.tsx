import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
 

export const metadata = {
  title: "Medgency",
  description: "Healthcare, Without The Guesswork",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
