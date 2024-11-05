"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthWithGoogle() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();

  const handleAuth = () => {
    setLoading(true);
    setError(null);
    const popupWidth = 800;
    const popupHeight = 600;
    const left = window.screen.width / 2 - popupWidth / 2;
    const top = window.screen.height / 2 - popupHeight / 2;

    const newWindow = window.open(
      "/api/google",
      "Google Sign In",
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
          <GoogleIcon className="mr-2 h-4 w-4" />
        )}
        Continue with google
      </Button>
    </div>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      role="img"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
     c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
     c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      ></path>
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
     C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      ></path>
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
     c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      ></path>
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
     c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      ></path>
    </svg>
  );
}
