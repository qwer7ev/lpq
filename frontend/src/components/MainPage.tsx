import MainPageBanner from "./MainPageBanner";

export default function MainPage(props: { onStartGame: () => void }) {
  return (
    <div className="min-h-screen w-full bg-violet-50 flex flex-col justify-center items-center px-4 py-8">
      <section className="w-full flex justify-center mb-12">
        <MainPageBanner />
      </section>

      <section className="w-full max-w-md flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-violet-700 text-center">
          Wybierz tryb gry
        </h1>
        <button
          onClick={props.onStartGame}
          className="w-full text-2xl mt-4 md:text-3xl uppercase font-bold px-6 py-4 bg-violet-400 hover:bg-violet-500 active:scale-95 transition-all rounded-2xl text-white shadow-lg cursor-pointer"
        >
          wszystkie losowo
        </button>
        <button
          onClick={props.onStartGame}
          className="w-full text-2xl mt-4 md:text-3xl uppercase font-bold px-6 py-4 bg-violet-400 hover:bg-violet-500 active:scale-95 transition-all rounded-2xl text-white shadow-lg cursor-pointer"
        >
          wszystkie po kolei
        </button>
        <button
          onClick={props.onStartGame}
          className="w-full text-2xl mt-4 md:text-3xl uppercase font-bold px-6 py-4 bg-violet-400 hover:bg-violet-500 active:scale-95 transition-all rounded-2xl text-white shadow-lg cursor-pointer"
        >
          wYbrane wojewodztwa losowo
        </button>
        <button
          onClick={props.onStartGame}
          className="w-full text-2xl mt-4 md:text-3xl uppercase font-bold px-6 py-4 bg-violet-400 hover:bg-violet-500 active:scale-95 transition-all rounded-2xl text-white shadow-lg cursor-pointer"
        >
          wybrane wojewodztwa po kolei
        </button>
      </section>
    </div>
  );
}

