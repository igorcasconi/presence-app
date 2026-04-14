import { getTokensFromObject } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { serverConfig } from "../../config";
import { firebaseConfig } from "@/firebase/config";
import { Attendance } from "@/components";

const Home = async () => {
  const requestCookies = await cookies();
  const cookiesObject = Object.fromEntries(
    requestCookies.getAll().map((cookie) => [cookie.name, cookie.value]),
  );

  const tokens = await getTokensFromObject(cookiesObject, {
    apiKey: firebaseConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });

  if (!tokens) {
    notFound();
  }

  return (
    <div className="w-full h-full px-4 pt-4">
      <Attendance />
    </div>
  );
};

export default Home;
