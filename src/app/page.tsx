import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { serverConfig } from "../../config";
import { firebaseConfig } from "@/firebase/config";
import { Attendance } from "@/components";

const Home = async () => {
  const tokens = await getTokens(cookies(), {
    apiKey: firebaseConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });

  if (!tokens) {
    notFound();
  }

  return (
    <div className="w-full h-full p-4">
      <Attendance />
    </div>
  );
};

export default Home;
