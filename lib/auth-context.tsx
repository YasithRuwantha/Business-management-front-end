"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// Language context for global language state
type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<string>(
    typeof window !== "undefined" && localStorage.getItem("language")
      ? localStorage.getItem("language")!
      : "english"
  );

  // Persist language selection
  const setLang = (lang: string) => {
    setLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
import { useRouter } from "next/navigation";

// Define the shape of your auth context
interface User {
  _id: string;
  email: string;
  firstName?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (formData: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

// Create context with proper type (default value can be empty but typed)
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;


export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check for existing token on app load
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${backendUrl}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Auth check failed", err);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${backendUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // if you later switch to cookies
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("token", data.token);
    sessionStorage.setItem("auth", "true")
    sessionStorage.setItem("user", data.user.role)
    setUser(data.user);
    router.push("/dashboard");
  };

  const register = async (formData: any) => {
    const res = await fetch(`${backendUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }

    localStorage.setItem("token", data.token);
    setUser({
      _id: data._id,
      email: data.email,
      firstName: data.name || data.firstName,
    });
    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

