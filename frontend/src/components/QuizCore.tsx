import { useEffect, useState, useRef } from "react";
import generatePlates, { type GeneratedPlateData } from "@/functions/generatePlate";
import LicensePlate from "./LicensePlate";

export default function QuizCore(props: {
  gamemode?: string;
  onHome?: () => void;
}) {
  const gamemode = props.gamemode || "allRandom";

  const [buttonState, setButtonState] = useState(0);
  const [generatedPlates, setGeneratedPlates] = useState<GeneratedPlateData>({
    id: 0,
    plate: "--- ----",
    voigroup: "",
    city: "",
    platesQuantity: 0,
    lastid: 0,
  });
  const [correctAnswerVisibility, setCorrectAnswerVisibility] = useState(false);
  const [numberOfCorrectAnswers, setNumberOfCorrectAnswers] = useState(0);
  const [numberOfIncorrectAnswers, setNumberOfIncorrectAnswers] = useState(0);
  const [numberOfQuestion, setNumberOfQuestion] = useState(0);

  const [timerAllTime, setTimerAllTime] = useState(0);
  const [timerAllIsRunning, setTimerAllIsRunning] = useState(false);

  const answerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!timerAllIsRunning) return;

    const timerAllIntervalId = setInterval(() => {
      setTimerAllTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerAllIntervalId);
  }, [timerAllIsRunning]);

  const timerAllMinutes = Math.floor(timerAllTime / 60);
  const timerAllSeconds = Math.floor(timerAllTime % 60);


  const normalizeCity = (text: string) => {
    return (text || "")
      .replaceAll(/\s/g, "")
      .normalize("NFD")
      .replaceAll(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .replaceAll("ł", "l")
      .replaceAll("—", "")
      .replaceAll("ę", "e")
      .replaceAll("-", "");
  };


  function nextPlate(isAnswerCorrect: boolean) {
    if (buttonState !== 1) setButtonState(1);
    if (correctAnswerVisibility) setCorrectAnswerVisibility(false);

    if (isAnswerCorrect) {
      setNumberOfCorrectAnswers((prev) => prev + 1);
    } else {
      setNumberOfIncorrectAnswers((prev) => prev + 1);
    }

    const nextPlateData = generatePlates(gamemode, "");
    setGeneratedPlates(nextPlateData);
    setNumberOfQuestion((prev) => prev + 1);

    if (answerInputRef.current) {
      answerInputRef.current.value = "";
      answerInputRef.current.focus();
    }
  }

  const handleUserAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userAnswer = e.target.value;
    if (
      normalizeCity(generatedPlates.city) === normalizeCity(userAnswer) &&
      buttonState === 1
    ) {
      nextPlate(true);
    }
  };

  const buttonHandler = () => {
    switch (buttonState) {
      case 0: {
        setTimerAllIsRunning(true);
        setButtonState(1);
        const initialPlate = generatePlates(gamemode, "");
        setGeneratedPlates(initialPlate);
        setNumberOfQuestion(1);
        if (answerInputRef.current) {
          answerInputRef.current.value = "";
          answerInputRef.current.focus();
        }
        break;
      }
      case 1: {
        setButtonState(2);
        setNumberOfIncorrectAnswers((prev) => prev + 1);
        setCorrectAnswerVisibility(true);
        break;
      }
      case 2: {
        nextPlate(false);
        break;
      }
      default:
        break;
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-violet-50 flex flex-col justify-between p-4 md:p-8"
      onKeyDown={(e) => {
        if (e.key === "Enter" && !(e.target as HTMLElement).closest("button")) {
          buttonHandler();
        }
      }}
    >
      <header className="w-full flex justify-between items-center mb-6 max-w-6xl mx-auto">
        <button
          onClick={props.onHome}
          className="text-lg md:text-xl font-bold uppercase bg-violet-300 hover:bg-violet-400 text-white px-5 py-2 rounded-xl transition-colors cursor-pointer"
        >
          wroc na strone główną
        </button>
      </header>

      <main className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 items-center flex-1">
        <section className="lg:col-span-3 flex flex-col items-center justify-center w-full">
          <div className="w-full flex justify-center mb-6">
            <LicensePlate plate={generatedPlates.plate} />
          </div>

          <div className="w-full max-w-2xl flex flex-col items-center">
            <input
              type="text"
              disabled={buttonState === 0}
              placeholder="Wpisz miasto"
              className="w-full border-4 border-black rounded-2xl text-3xl sm:text-4xl md:text-5xl p-4 text-center bg-white shadow-md focus:outline-none focus:ring-4 focus:ring-violet-400 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              onChange={handleUserAnswer}
              ref={answerInputRef}
            />

            <button
              className="w-full text-2xl md:text-3xl rounded-2xl bg-violet-500 hover:bg-violet-600 active:scale-98 py-3 my-4 uppercase font-bold text-white shadow-lg transition-all cursor-pointer"
              onClick={buttonHandler}
            >
              {buttonState === 0 && <span>Start</span>}
              {buttonState === 1 && <span>Nie wiem</span>}
              {buttonState === 2 && <span>Nastepny</span>}
            </button>

            <div className="w-full min-h-[5rem] my-2">
              {correctAnswerVisibility && (
                <div className="rounded-2xl bg-violet-400 p-4 uppercase font-bold text-white text-center shadow-md">
                  <p className="text-sm md:text-base opacity-90">
                    Prawidłowa odpowiedź to:
                  </p>
                  <p className="text-2xl md:text-3xl mt-1">
                    {generatedPlates.city}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="lg:col-span-1 flex flex-col gap-4 w-full max-w-sm mx-auto">
          <div className="w-full bg-blue-600 text-white text-center rounded-2xl p-4 shadow-md">
            <p className="text-4xl md:text-5xl font-bold py-2">
              {numberOfQuestion}
            </p>
            <hr className="opacity-30 my-2" />
            <p className="text-xs uppercase tracking-wider font-semibold">
              Pytanie
            </p>
          </div>

          <div className="w-full bg-violet-600 text-white text-center rounded-2xl p-4 shadow-md">
            <p className="text-4xl md:text-5xl font-bold font-rdmn py-2">
              {timerAllMinutes.toString().padStart(2, "0")}:
              {timerAllSeconds.toString().padStart(2, "0")}
            </p>
            <hr className="opacity-30 my-2" />
            <p className="text-xs uppercase tracking-wider font-semibold">
              Czas
            </p>
          </div>

          <div className="w-full bg-green-600 text-white text-center rounded-2xl p-4 shadow-md">
            <p className="text-5xl md:text-6xl font-bold py-2">
              {numberOfCorrectAnswers}
            </p>
            <hr className="opacity-30 my-2" />
            <p className="text-xs uppercase tracking-wider font-semibold">
              Dobre odpowiedzi
            </p>
          </div>

          <div className="w-full bg-red-600 text-white text-center rounded-2xl p-4 shadow-md">
            <p className="text-5xl md:text-6xl font-bold py-2">
              {numberOfIncorrectAnswers}
            </p>
            <hr className="opacity-30 my-2" />
            <p className="text-xs uppercase tracking-wider font-semibold">
              Złe odpowiedzi
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
