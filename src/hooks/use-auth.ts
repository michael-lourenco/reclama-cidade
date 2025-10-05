import { UserData } from "@/components/user/types/user";
import {
  handleAuthResponse,
  signInWithGoogle,
  signOutFromGoogle,
} from "@/services/auth/NextAuthenticationService";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    try {
      const localStorageUser = localStorage.getItem("user");
      if (localStorageUser) {
        const parsedUser = JSON.parse(localStorageUser);
        if (parsedUser && parsedUser.email) {
          setUser(parsedUser);
        }
      }
    } catch (error) {
      console.error("Erro ao ler do localStorage:", error);
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        localStorage.setItem('redirectAfterLogin', currentPath);
      }
      await signInWithGoogle();
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOutFromGoogle();
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("redirectAfterLogin");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (status === "loading") return;
      if (status === "authenticated" && session) {
        try {
          const userData = await handleAuthResponse(session);
          if (userData) {
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
            if (typeof window !== 'undefined') {
              const redirectPath = localStorage.getItem('redirectAfterLogin');
              if (redirectPath && redirectPath !== '/user') {
                localStorage.removeItem('redirectAfterLogin');
                window.location.href = redirectPath;
              }
            }
          }
        } catch (error) {
          console.error("Erro ao processar autenticação:", error);
        }
      } else if (status === "unauthenticated") {
        const localUser = localStorage.getItem("user");
        if (localUser) {
          try {
            const userData = JSON.parse(localUser);
            if (!userData || !userData.email) {
              localStorage.removeItem("user");
              setUser(null);
            }
          } catch (e) {
            localStorage.removeItem("user");
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, [session, status]);

  return { user, loading, status, handleLogin, handleLogout };
}