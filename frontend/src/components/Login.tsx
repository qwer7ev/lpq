import { useState, type FormEvent } from "react";
import eurobandImg from "@/assets/eurobandpl2.png";
import { useAuth } from "@/context/AuthContext";

interface LoginProps {
  onSuccess: () => void;
  onNavigateRegister: () => void;
  onBackToHome?: () => void;
}

/*
  Podstrona logowania - dokladne UI ze STARY_PROJEKT.
*/
export default function Login({ onSuccess, onNavigateRegister }: LoginProps) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    const ok = login(username, password);
    if (ok) {
      onSuccess();
    }
  };

  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <div className="border-black border-8 rounded-md font-bold aw-7/12 flex text-black">
              <img
                src={eurobandImg}
                className="sbg-blue-900 h-20 sw-16"
                alt="PL"
              />
              <div className="pl-1 text-7xl m-auto">
                <p className="font-rdmnbold tracking-wider">ZALOGUJ</p>
              </div>
            </div>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <p className="block mb-2 text-sm font-medium text-gray-900">
                  Nazwa użytkownika
                </p>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-violet-600 focus:border-violet-600 block w-full p-2.5"
                  placeholder="username"
                  required
                />
              </div>
              <div>
                <p className="block mb-2 text-sm font-medium text-gray-900">
                  Hasło
                </p>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-violet-600 focus:border-violet-600 block w-full p-2.5"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-violet-600 hover:underline cursor-pointer">
                  Zapomniałeś hasła?
                </span>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
              >
                Zaloguj
              </button>
              <p className="text-sm font-light text-gray-500">
                Nie masz jeszcze konta?{" "}
                <button
                  type="button"
                  onClick={onNavigateRegister}
                  className="font-medium text-violet-600 hover:underline cursor-pointer"
                >
                  Zarejestruj się
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
