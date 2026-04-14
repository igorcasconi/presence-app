import { cookies } from "next/headers";
import { serverConfig } from "../../../../config";
export async function GET(req: Request) {
  const token = req.headers.get("Authorization");

  if (!!token) {
    const requestCookies = await cookies();
    requestCookies.set(serverConfig.cookieName, token);
    return new Response(
      JSON.stringify({ message: "Authorization header received", token }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
