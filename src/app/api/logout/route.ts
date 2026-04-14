import { cookies } from "next/headers";
export async function GET() {
  const requestCookies = await cookies();
  requestCookies.delete("AuthToken");
  return new Response(
    JSON.stringify({ message: "Authorization header has been removed" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}
