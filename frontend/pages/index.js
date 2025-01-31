import { useEffect } from "react";
import { useRouter } from "next/router";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/home");  // Kullanıcıyı "/home" sayfasına yönlendir
  }, []);

  return <div>Redirecting to home...</div>;
}
