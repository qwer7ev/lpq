import { useState, type FormEvent } from "react";
import eurobandImg from "@/assets/eurobandpl2.png";
import { useAuth } from "@/context/AuthContext";

interface RegisterProps {
  onSuccess: () => void;
  onNavigateLogin: () => void;
  onBackToHome?: () => void;
}

/*
  Podstrona rejestracji - dokladne UI ze STARY_PROJEKT.
*/
export default function Register({
  onSuccess,
  onNavigateLogin,
}: RegisterProps) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    const ok = register(username, name, email, password);
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
                className="sbg-blue-900 h-16 sw-16"
                alt="PL"
              />
              <div className="pl-1 text-5xl m-auto">
                <p className="font-rdmnbold tracking-wider">ZAREJESTRUJ</p>
              </div>
            </div>

            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <p className="block mb-2 text-sm font-medium text-gray-900">
                  Imię i nazwisko
                </p>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-violet-600 focus:border-violet-600 block w-full p-2.5"
                  placeholder="Imię i nazwisko"
                />
              </div>
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
                  Email
                </p>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-violet-600 focus:border-violet-600 block w-full p-2.5"
                  placeholder="email@email.com"
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
              <button
                type="submit"
                className="w-full text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
              >
                Zarejestruj
              </button>
              <p className="text-sm font-light text-gray-500">
                Masz już konto?{" "}
                <button
                  type="button"
                  onClick={onNavigateLogin}
                  className="font-medium text-violet-600 hover:underline cursor-pointer"
                >
                  Zaloguj się
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
