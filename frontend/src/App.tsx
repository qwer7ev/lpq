import { useState, useEffect } from "react";
import MainPage from "./components/MainPage";
import QuizCore from "./components/QuizCore";


function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "game">(() => {
    return window.location.hash === "#game" ? "game" : "home";
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#game") {
        setCurrentPage("game");
      } else {
        setCurrentPage("home");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateToGame = () => {
    window.location.hash = "game";
    setCurrentPage("game");
  };

  const navigateToHome = () => {
    window.location.hash = "";
    setCurrentPage("home");
  };

  return (
    <>
      {currentPage === "home" ? (
        <MainPage onStartGame={navigateToGame} />
      ) : (
        <QuizCore gamemode="allRandom" onHome={navigateToHome} />
      )}
    </>
  );
}

export default App;
