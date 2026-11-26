import eurobandImg from "@/assets/eurobandpl2.png";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  onNavigate: (view: "home" | "profile" | "login" | "register") => void;
}

/*
  Navbar - dokladny uklad i klasy ze STARY_PROJEKT.
*/
export default function Navbar({ onNavigate }: NavbarProps) {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full bg-violet-400 flex justify-between">
      <div className="my-auto ml-1 cursor-pointer" onClick={() => onNavigate("home")}>
        <div className="border-black border-4 rounded-md font-bold aw-7/12 flex bg-white">
          <img src={eurobandImg} className="h-12 wd-16" alt="PL" />
          <div className="pl-1 m-auto flex">
            <p className="font-rdmnbold tracking-wider text-5xl text-black">LPA QUIZ</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onNavigate("home")}
          className="block text-md uppercase px-4 py-1 my-4 w-full bg-violet-500 hover:bg-violet-300 rounded-lg text-center text-violet-50 cursor-pointer"
        >
          home
        </button>
        <button
          onClick={() => onNavigate("profile")}
          className="block text-md uppercase px-4 py-1 my-4 w-full bg-violet-500 hover:bg-violet-300 rounded-lg text-center text-violet-50 cursor-pointer"
        >
          profile
        </button>
      </div>

      <div className="flex items-center gap-2 pr-2">
        {user ? (
          <>
            <p className="mx-2 text-2xl my-auto text-black">{user.username}</p>
            <button
              onClick={() => {
                logout();
                onNavigate("home");
              }}
              className="block text-md uppercase px-4 py-1 my-4 w-full bg-violet-500 hover:bg-violet-300 rounded-lg text-center text-violet-50 cursor-pointer"
            >
              wyloguj
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onNavigate("login")}
              className="mx-2 text-md uppercase px-4 py-1 my-4 w-full bg-violet-500 hover:bg-violet-300 rounded-lg text-center text-violet-50 cursor-pointer"
            >
              Zaloguj
            </button>
            <button
              onClick={() => onNavigate("register")}
              className="text-md uppercase px-4 py-1 my-4 w-full bg-violet-500 hover:bg-violet-300 rounded-lg text-center text-violet-50 cursor-pointer"
            >
              Zarejestruj
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
