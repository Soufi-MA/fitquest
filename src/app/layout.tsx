import "./globals.css";
import localFont from "next/font/local";
import { Providers } from "./providers";

const GeistSans = localFont({
  src: "../../public/fonts/Geist/Geist[wght].woff2",
});

export const metadata = {
  title: "FitQuest",
  description: "All in one Health and Fitness",
  icons: [{ rel: "icon", url: "/logo.png" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.className}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
