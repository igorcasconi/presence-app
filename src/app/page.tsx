import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { serverConfig } from "../../config";
import { firebaseConfig } from "@/firebase/config";

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
    <div className="w-full h-full">
      <p>
        Only <strong>{tokens?.decodedToken.email}</strong> holds the magic key
        to this kingdom!
      </p>
    </div>
  );
};

export default Home;
