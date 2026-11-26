import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { createEmptyScores, scoreLogic, type UserScores } from "@/functions/scoreLogic";

export interface UserProfile {
  id: number;
  username: string;
  name: string;
  email: string;
  scores: UserScores;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (username: string, password?: string) => boolean;
  register: (username: string, name: string, email: string, password?: string) => boolean;
  logout: () => void;
  updateUserScores: (gameScores: UserScores) => void;
}

const STORAGE_KEY = "lpq_auth_user";
const USERS_DB_KEY = "lpq_registered_users";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/*
  Kontekst autoryzacji lokalnej (frontend):
  Zarzadza sesja uzytkownika i stanem wynikow bez koniecznosci uzywania backendu.
  Dane przechowywane sa w pamieci przegladarki (localStorage).
*/
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = (username: string): boolean => {
    const trimmed = username.trim();
    if (!trimmed) return false;

    // Pobranie istniejacych uzytkownikow lub utworzenie profilu
    let allUsers: Record<string, UserProfile> = {};
    try {
      const stored = localStorage.getItem(USERS_DB_KEY);
      if (stored) allUsers = JSON.parse(stored);
    } catch {
      allUsers = {};
    }

    const existingUser = allUsers[trimmed.toLowerCase()];
    if (existingUser) {
      setUser(existingUser);
      return true;
    }

    // Jesli uzytkownik nie istnieje, logujemy tworzac profil
    const newUser: UserProfile = {
      id: Date.now(),
      username: trimmed,
      name: trimmed,
      email: `${trimmed.toLowerCase()}@lpq.pl`,
      scores: createEmptyScores(),
    };
    allUsers[trimmed.toLowerCase()] = newUser;
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(allUsers));
    setUser(newUser);
    return true;
  };

  const register = (
    username: string,
    name: string,
    email: string
  ): boolean => {
    const trimmed = username.trim();
    if (!trimmed) return false;

    let allUsers: Record<string, UserProfile> = {};
    try {
      const stored = localStorage.getItem(USERS_DB_KEY);
      if (stored) allUsers = JSON.parse(stored);
    } catch {
      allUsers = {};
    }

    const newUser: UserProfile = {
      id: Date.now(),
      username: trimmed,
      name: name.trim() || trimmed,
      email: email.trim() || `${trimmed.toLowerCase()}@lpq.pl`,
      scores: createEmptyScores(),
    };

    allUsers[trimmed.toLowerCase()] = newUser;
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(allUsers));
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateUserScores = (gameScores: UserScores) => {
    if (!user) return;

    const mergedScores = scoreLogic(gameScores, user.scores);
    const updatedUser = {
      ...user,
      scores: mergedScores,
    };

    setUser(updatedUser);

    // Zapisujemy do listy uzytkownikow
    try {
      const stored = localStorage.getItem(USERS_DB_KEY);
      const allUsers = stored ? JSON.parse(stored) : {};
      allUsers[user.username.toLowerCase()] = updatedUser;
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(allUsers));
    } catch {
      // Ignorujemy bledy zapisu
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUserScores,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
