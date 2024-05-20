import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "../providers/theme-provider";
import AuthSessionProvider from "~/providers/AuthSessionProvider";
import { Toaster } from "sonner";

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
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <AuthSessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TRPCReactProvider>{children}</TRPCReactProvider>
            <Toaster position="top-center" richColors />
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
