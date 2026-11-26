import MainPageBanner from "./MainPageBanner";

export type GamemodeType =
  | "allTest"
  | "allRandom"
  | "voivodeshipsTest"
  | "voivodeshipsRandom";

interface MainPageProps {
  onSelectMode: (mode: GamemodeType) => void;
}

/*
  Strona glowna aplikacji - dokladne UI/UX ze STARY_PROJEKT.
*/
export default function MainPage({ onSelectMode }: MainPageProps) {
  const links = [
    {
      key: 1,
      text: "wszystkie: test",
      mode: "allTest" as const,
    },
    {
      key: 2,
      text: "wszystkie: losowo",
      mode: "allRandom" as const,
    },
    {
      key: 3,
      text: "wybrane województwa: test",
      mode: "voivodeshipsTest" as const,
    },
    {
      key: 4,
      text: "wybrane województwa: losowo",
      mode: "voivodeshipsRandom" as const,
    },
  ];

  return (
    <div className="h-screen w-screen bg-violet-50">
      <section className="flex justify-center pt-2">
        <MainPageBanner />
      </section>
      <section className="flex items-center justify-center">
        <div className="bg-violet-200d rounded-xl p-8">
          <h1 className="text-7xl my-16 text-violet-700 text-center">
            Wybierz tryb gry
          </h1>
          {links.map((btn) => (
            <button
              key={btn.key}
              onClick={() => onSelectMode(btn.mode)}
              className="block text-4xl uppercase px-2 py-1 my-4 w-full bg-violet-400 hover:bg-violet-300 rounded-xl text-center text-violet-50 cursor-pointer"
            >
              {btn.text}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
