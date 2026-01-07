import { useState, createContext, useContext, ReactNode, useEffect } from "react";

interface AuthContextType {
  user: any | null;
  session: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  refresh: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refresh = async () => {
    setLoading(true);
    const token = localStorage.getItem("authToken");
    if (!token) {
      setUser(null);
      setSession(null);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed to fetch profile (${res.status})`);
      const body = await res.json();
      setUser(body.user || body.data || body);
      setSession({ token });
    } catch (err) {
      console.error("Auth refresh error", err);
      localStorage.removeItem("authToken");
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setSession(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};