import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import MainPage, { type GamemodeType } from "./components/MainPage";
import SelectVoivodeships from "./components/SelectVoivodeships";
import QuizCore from "./components/QuizCore";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import { AuthProvider, useAuth } from "./context/AuthContext";
import type { UserScores } from "./functions/scoreLogic";

type AppView =
  | "home"
  | "selectVoivodeships"
  | "game"
  | "profile"
  | "login"
  | "register";

/*
  Glowny kontener aplikacji - zarzadzanie widokami i stanem rozgrywki.
*/
function AppContent() {
  const { updateUserScores } = useAuth();

  const [currentView, setCurrentView] = useState<AppView>(() => {
    const hash = window.location.hash.replace("#", "");
    if (["home", "profile", "login", "register", "game"].includes(hash)) {
      return hash as AppView;
    }
    return "home";
  });

  const [selectedGamemode, setSelectedGamemode] = useState<GamemodeType>("allRandom");
  const [selectedParams, setSelectedParams] = useState<string>("");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (["home", "profile", "login", "register", "game"].includes(hash)) {
        setCurrentView(hash as AppView);
      } else if (!hash) {
        setCurrentView("home");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateTo = (view: AppView) => {
    window.location.hash = view === "home" ? "" : view;
    setCurrentView(view);
  };

  const handleSelectMode = (mode: GamemodeType) => {
    setSelectedGamemode(mode);

    if (mode === "voivodeshipsRandom" || mode === "voivodeshipsTest") {
      setCurrentView("selectVoivodeships");
    } else {
      setSelectedParams("");
      navigateTo("game");
    }
  };

  const handleStartVoivodeshipGame = (voivodeshipString: string) => {
    setSelectedParams(voivodeshipString);
    navigateTo("game");
  };

  const handleFinishGame = (gameScores: UserScores) => {
    updateUserScores(gameScores);
  };

  return (
    <div className="min-h-screen w-screen bg-violet-50 flex flex-col">
      {/* Navbar obecny na widokach glownych zgodnie z layoutem starego projektu */}
      {currentView !== "game" && (
        <Navbar onNavigate={(view) => navigateTo(view)} />
      )}

      <main className="flex-1 w-full">
        {currentView === "home" && (
          <MainPage onSelectMode={handleSelectMode} />
        )}

        {currentView === "selectVoivodeships" && (
          <SelectVoivodeships
            gamemode={
              selectedGamemode === "voivodeshipsTest"
                ? "voivodeshipsTest"
                : "voivodeshipsRandom"
            }
            onStart={handleStartVoivodeshipGame}
            onBack={() => navigateTo("home")}
          />
        )}

        {currentView === "game" && (
          <QuizCore
            gamemode={selectedGamemode}
            params={selectedParams}
            onHome={() => navigateTo("home")}
            onProfile={() => navigateTo("profile")}
            onFinishGame={handleFinishGame}
          />
        )}

        {currentView === "profile" && (
          <Profile onBackToHome={() => navigateTo("home")} />
        )}

        {currentView === "login" && (
          <Login
            onSuccess={() => navigateTo("profile")}
            onNavigateRegister={() => navigateTo("register")}
            onBackToHome={() => navigateTo("home")}
          />
        )}

        {currentView === "register" && (
          <Register
            onSuccess={() => navigateTo("profile")}
            onNavigateLogin={() => navigateTo("login")}
            onBackToHome={() => navigateTo("home")}
          />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
