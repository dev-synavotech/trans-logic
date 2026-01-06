import { useState, createContext, useContext, ReactNode } from "react";

interface AuthContextType {
  user: any | null;
  session: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Temporary stubbed auth provider. Replace with backend auth when ready.
  const [user] = useState<any | null>(null);
  const [session] = useState<any | null>(null);
  const [loading] = useState(false);

  const signOut = async () => {
    // no-op for now
    return;
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};