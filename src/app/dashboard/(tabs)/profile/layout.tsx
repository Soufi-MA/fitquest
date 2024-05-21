import { CalendarCheck2, MapPin } from "lucide-react";
import Image from "next/image";
import React, { type ReactNode } from "react";
import { getServerAuthSession } from "~/server/auth";
import ProfileNav from "./_components/ProfileNav";

const ProfileLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerAuthSession();
  return (
    <div className="flex flex-col gap-4 px-8 py-4">
      <div className="flex w-full flex-col justify-center">
        <div className="flex w-full flex-col items-center gap-4 rounded-md bg-muted px-8 py-4 shadow-md md:flex-row">
          {session?.user && (
            <>
              {session?.user && session.user.image && (
                <Image
                  className="rounded-md border-4 object-cover"
                  src={session.user.image}
                  alt=""
                  height={90}
                  width={90}
                />
              )}
              <div className="flex flex-col items-center justify-evenly gap-2 md:items-start">
                <p className="text-2xl font-semibold">{session.user.name}</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin size={16} />
                    Addis Ababa, Ethiopia
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <CalendarCheck2 size={16} />
                    Joined May 20 2024
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <ProfileNav />
      {children}
    </div>
  );
};

export default ProfileLayout;
