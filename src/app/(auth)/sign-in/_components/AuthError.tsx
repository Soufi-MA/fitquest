"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function getErrorMessage(errorCode: string) {
  let errorMessage;

  switch (errorCode) {
    case "OAuthSignin":
      errorMessage =
        "There was a problem connecting to your account. Please try signing in again.";
      break;
    case "OAuthCallback":
      errorMessage =
        "We encountered an issue processing the information from your account provider. Please try signing in again.";
      break;
    case "OAuthCreateAccount":
      errorMessage =
        "we couldn't create your account at this time. Please try again.";
      break;
    case "EmailCreateAccount":
      errorMessage =
        "We couldn't create your account at this time. Please try again.";
      break;
    case "Callback":
      errorMessage = "An error occurred during sign-in. Please try again.";
      break;
    case "OAuthAccountNotLinked":
      errorMessage =
        "This email address is already linked to a different account. Please sign in with that account or use a different email address.";
      break;
    default:
      errorMessage = "There was an error signing you in. Please try again.";
      break;
  }

  return errorMessage;
}

export default function AuthError() {
  const [error, setError] = useState<string>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // const errorCode = searchParams.get("error");

  // const createQueryString = useCallback(
  //   (name: string) => {
  //     const params = new URLSearchParams(searchParams.toString());
  //     params.delete(name);

  //     return params.toString();
  //   },
  //   [searchParams],
  // );

  useEffect(() => {
    const errorCode = searchParams.get("error");
    const params = new URLSearchParams(searchParams.toString());
    errorCode && setError(getErrorMessage(errorCode));
    params.delete("error");
    router.push(pathname + "?" + params.toString());
    // if (errorCode) {
    //   setError(getErrorMessage(errorCode));
    //   router.push(pathname + "?" + createQueryString("error"));
    // }
  }, [pathname, router, searchParams]);
  if (!error) return;

  return (
    <>
      <div className="w-full min-w-0 p-2 text-center text-base text-rose-500">
        {error}
      </div>
      <p className="mb-8 mt-2 text-center">
        If you face any issues, please contact us on
        <b> {process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</b>
      </p>
    </>
  );
}
