import { cookies } from "next/headers";
export async function GET() {
  cookies().delete("AuthToken");
  return new Response(
    JSON.stringify({ message: "Authorization header removed" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
