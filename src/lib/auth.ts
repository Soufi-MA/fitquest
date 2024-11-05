import { GitHub, Google } from "arctic";
import { cookies } from "next/headers";
export const github = new GitHub(
  process.env.AUTH_GITHUB_ID!,
  process.env.AUTH_GITHUB_SECRET!,
  null
);

export const google = new Google(
  process.env.AUTH_GOOGLE_ID!,
  process.env.AUTH_GOOGLE_SECRET!,
  `${process.env.NEXT_PUBLIC_SERVER_URL}/api/google/callback`
);

export const googleErrorMessages: Record<
  string,
  { message: string; status: number }
> = {
  invalid_request: {
    message:
      "Oops! Something went wrong with your request. Please check your input and try again.",
    status: 400,
  },
  access_denied: {
    message:
      "You’ve declined access to the application. If this was a mistake, you can try again.",
    status: 403,
  },
  server_error: {
    message: "There was an issue on our end. Please try again later.",
    status: 500,
  },
  temporarily_unavailable: {
    message: "The service is currently unavailable. Please try again shortly.",
    status: 503,
  },
};

export const gitHubErrorMessages: Record<
  string,
  { message: string; status: number }
> = {
  access_denied: {
    message:
      "You’ve declined access to the application. If this was a mistake, you can try again.",
    status: 403,
  },
};

export const postMessageScript = (
  success: boolean,
  status: number,
  message?: string
) => `
  <script>
    const decodedMessage = decodeURIComponent("${encodeURIComponent(
      message ?? ""
    )}");
    window.opener.postMessage(
      { success: ${success}, status: ${status}, message: decodedMessage },
      window.opener.location.origin
    );
    window.close();
  </script>
`;

export async function clearAuthCookies() {
  const nextCookies = await cookies();
  nextCookies.delete("github_oauth_state");
  nextCookies.delete("google_oauth_state");
  nextCookies.delete("google_code_verifier");
}
