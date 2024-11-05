import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
import { dummySignin } from "./actions";
import { Button } from "@/components/ui/button";
import AuthWithGoogle from "./_components/GoogleAuthButton";
import AuthWithGitHub from "./_components/GithubAuthButton";

const page = async () => {
  return (
    <div className="flex h-screen flex-col items-center justify-start p-10 lg:p-12">
      <div className="flex items-center gap-2 md:duration-300">
        <Image src={"/logo.png"} alt="logo" height={32} width={32} />
        <p className={cn("text-5xl text-foreground md:duration-150")}>
          <span className="text-primary md:duration-150">Fit</span>
          Quest
        </p>
      </div>
      <div className="my-12 flex w-full flex-grow items-center justify-center">
        <div className="w-full max-w-6xl">
          <div className="flex w-full grid-cols-2 flex-col items-center gap-x-20 lg:grid">
            <div className="hidden h-full flex-col items-center justify-center gap-3 lg:flex">
              <Image src={"/logo.png"} alt="" height={536} width={426} />
            </div>
            <div className="relative mx-auto w-full max-w-[30rem] lg:mx-0 lg:max-w-none">
              <div className="relative mt-10 max-w-[480px] rounded-3xl bg-muted px-6 py-8 lg:mt-0 lg:p-16 lg:shadow-2xl">
                <div className="flex flex-col items-center gap-2">
                  <h2 className="text-2xl font-bold">Hi there! 👋</h2>
                  <div className="pb-5 text-sm">
                    Choose provider to sign-in.
                  </div>
                  <div className="flex flex-col items-start justify-center gap-3 self-stretch p-0">
                    <form action={dummySignin} className="w-full">
                      <Button type="submit" className="w-full">
                        Test Sign In
                      </Button>
                    </form>
                    <AuthWithGoogle />
                    <AuthWithGitHub />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
