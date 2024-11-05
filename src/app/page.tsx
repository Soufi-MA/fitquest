import { getCurrentUser } from "./actions";
import Link from "next/link";

export default async function Home() {
  const { user } = await getCurrentUser();

  return (
    <div className="flex flex-col items-center justify-center gap-8 min-h-screen mx-auto">
      <div className="text-4xl font-semibold">Hi {user?.name}</div>
      <p>Landing page coming soon...</p>
      <Link
        href={user ? "/dashboard" : "/sign-in"}
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
      >
        {user ? "Dashboard" : "Sign in"}
      </Link>
    </div>
  );
}
