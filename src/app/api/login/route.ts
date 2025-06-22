import { serverConfig } from "../../../../config";
import { firebaseConfig } from "@/firebase/config";
import { setAuthCookies } from "next-firebase-auth-edge/lib/next/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  try {
    const response = NextResponse.json({ status: "success" });

    await setAuthCookies(response.headers, {
      apiKey: firebaseConfig.apiKey,
      cookieName: serverConfig.cookieName,
      cookieSignatureKeys: serverConfig.cookieSignatureKeys,
      cookieSerializeOptions: serverConfig.cookieSerializeOptions,
      serviceAccount: serverConfig.serviceAccount,
    });

    return response;
  } catch (error) {
    console.error("Erro ao definir cookies de autenticação:", error);
    return NextResponse.json(
      { error: "Failed to set auth cookie" },
      { status: 500 }
    );
  }
}
