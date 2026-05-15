import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authAPI } from "../services/api";

interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role?: "patient" | "doctor" | "admin";
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    full_name: string;
    email: string;
    password: string;
    phone?: string;
  }, role?: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const userData = await authAPI.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          localStorage.removeItem("access_token");
          localStorage.removeItem("token_type");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(email, password);
      // Use user data from the login response
      setUser(response.user);
    } catch (error: any) {
      console.error("Login failed:", error);
      const errorMsg = error?.message || error?.detail || "Login failed";
      throw new Error(typeof errorMsg === 'string' ? errorMsg : String(errorMsg));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    full_name: string;
    email: string;
    password: string;
    phone?: string;
  }, role: string = "patient") => {
    setIsLoading(true);
    try {
      await authAPI.register(data, role);
      // Auto-login after registration
      const loginResponse = await authAPI.login(data.email, data.password);
      setUser(loginResponse.user);
    } catch (error: any) {
      console.error("Registration failed:", error);
      const errorMsg = error?.message || error?.detail || "Registration failed";
      throw new Error(typeof errorMsg === 'string' ? errorMsg : String(errorMsg));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
