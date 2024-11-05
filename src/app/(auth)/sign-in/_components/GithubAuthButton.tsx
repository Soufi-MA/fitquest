"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export default function AuthWithGitHub() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();

  const handleAuth = () => {
    setLoading(true);
    setError(null);
    const popupWidth = 500;
    const popupHeight = 600;
    const left = window.screen.width / 2 - popupWidth / 2;
    const top = window.screen.height / 2 - popupHeight / 2;

    const newWindow = window.open(
      "/api/github",
      "Github Sign In",
      `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`
    );

    const timer = setInterval(() => {
      if (newWindow?.closed) {
        clearInterval(timer);
        setLoading(false);
      }
    }, 500);
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { status, message } = event.data;

      if (status === 200) {
        setLoading(false);
        window.location.href = "/dashboard";
      } else {
        setError(message);
        setLoading(false);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [setError, origin]);

  return (
    <div className="flex flex-col gap-2 w-full">
      {error && (
        <p className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md space-y-2 text-sm">
          {error}
        </p>
      )}
      <Button className="w-full" onClick={handleAuth} disabled={loading}>
        {loading ? (
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
        ) : (
          <GitHubLogoIcon className="mr-2 h-4 w-4" />
        )}
        Continue with GitHub
      </Button>
    </div>
  );
}
