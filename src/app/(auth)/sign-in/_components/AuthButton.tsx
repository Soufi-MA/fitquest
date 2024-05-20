"use client";
import { Loader2 } from "lucide-react";
import { ClientSafeProvider, signIn } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useSearchParams } from "next/navigation";

const AuthButton = ({ provider }: { provider: ClientSafeProvider }) => {
  const [isLoading, setIsloading] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const callbackUrl = `${searchParams.get("callbackUrl") || `${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard`}`;

  return (
    <div className="flex flex-grow" key={provider.name}>
      <Button
        onClick={async () => {
          setIsloading(true);
          const data = await signIn(provider.id, {
            callbackUrl,
            redirect: false,
          });
        }}
        variant={"outline"}
        className={cn(
          "flex h-12 w-full items-center justify-center gap-3 rounded-lg border px-2 py-6",
          {
            "bg-[#006aff] hover:bg-[rgba(0,106,255,0.8)]":
              provider.name === "Facebook",
            "bg-[#24292f] hover:bg-[rgba(36,41,47,0.8)]":
              provider.name === "Github",
            "bg-[#FFFFFF] hover:bg-[rgba(255,255,255,0.8)]":
              provider.name === "Google",
          },
        )}
      >
        {/* <Facebook /> */}
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <Image
            src={`./icons/${provider.name.toLowerCase()}.svg`}
            alt=""
            height={24}
            width={24}
          />
        )}
      </Button>
    </div>
  );
};

export default AuthButton;
