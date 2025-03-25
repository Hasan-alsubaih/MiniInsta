import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface User {
  id: string;
  username: string;
  email: string;
  profilePic: string;
  followers?: any[];
  following?: any[];
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );

  const navigate = useNavigate();
  const location = useLocation();

  const getLoggedinUer = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
     const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
  method: "GET",
  headers: { Authorization: `Bearer ${token}` },
});

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch user data:", data.message);
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        return;
      }

      setUser({
        id: data._id,
        username: data.username || "Unknown",
        email: data.email,
        profilePic: data.profilePic || "/images/defaultProfile.jpg",
      });

      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching user data:", error);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  };

  useEffect(() => {
    const publicRoutes = ["/register", "/login"];
    if (!token && !publicRoutes.includes(location.pathname)) {
      navigate("/login");
    }
    if (token) {
      getLoggedinUer();
    }
  }, [token, navigate, location.pathname]);

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
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
