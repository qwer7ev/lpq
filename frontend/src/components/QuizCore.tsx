import { useEffect, useState, useRef } from "react";
import generatePlates, {
  type GeneratedPlateData,
  resetTestNum,
} from "@/functions/generatePlate";
import { timeAndScoreTB } from "@/database/db";
import { createEmptyScores, type UserScores } from "@/functions/scoreLogic";
import LicensePlate from "./LicensePlate";

interface QuizCoreProps {
  gamemode?: string;
  params?: string;
  onHome?: () => void;
  onProfile?: () => void;
  onFinishGame?: (gameScores: UserScores) => void;
}

/*
  Komponent QuizCore - dokladna struktura i klasy ze STARY_PROJEKT,
  z poprawionymi wyciekami pamieci w timerze.
*/
export default function QuizCore({
  gamemode = "allRandom",
  params = "",
  onHome,
  onProfile,
  onFinishGame,
}: QuizCoreProps) {
  const [buttonState, setButtonState] = useState(0);
  const [gameEndPopupVisibility, setGameEndPopupVisibility] = useState(false);
  const [generatedPlates, setGeneratedPlates] = useState<GeneratedPlateData>({
    id: 0,
    plate: "*** ****",
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

  const [gameUserData, setGameUserData] = useState<UserScores>(createEmptyScores());
  const answerInputRef = useRef<HTMLInputElement>(null);

  const voisArr = params ? params.split("") : [];
  const isTestMode = gamemode === "voivodeshipsTest" || gamemode === "allTest";

  useEffect(() => {
    resetTestNum();
  }, [gamemode, params]);

  // Timer bez wyciekow pamieci
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

  const finishGame = (finalUserData: UserScores) => {
    setTimerAllIsRunning(false);
    setGameEndPopupVisibility(true);
    if (onFinishGame) {
      onFinishGame(finalUserData);
    }
  };

  function nextPlate(isAnswerCorrect: boolean) {
    if (buttonState !== 1) setButtonState(1);
    if (correctAnswerVisibility) setCorrectAnswerVisibility(false);

    if (isAnswerCorrect) {
      setNumberOfCorrectAnswers((prev) => prev + 1);
    } else {
      setNumberOfIncorrectAnswers((prev) => prev + 1);
    }

    const currentVoi = generatedPlates.voigroup;
    const timePropName = "time_" + currentVoi;
    const scorePropName = "score_" + currentVoi;
    const updatedUserData: UserScores = {
      ...gameUserData,
      [scorePropName]: isAnswerCorrect
        ? (gameUserData[scorePropName] || 0) + 1
        : gameUserData[scorePropName] || 0,
      [timePropName]: timerAllTime,
      score_all: isAnswerCorrect
        ? (gameUserData.score_all || 0) + 1
        : gameUserData.score_all || 0,
      time_all: timerAllTime,
    };
    setGameUserData(updatedUserData);

    const totalCount = generatedPlates.platesQuantity || 0;
    if (isTestMode && totalCount > 0 && numberOfQuestion >= totalCount) {
      finishGame(updatedUserData);
      return;
    }

    const nextPlateData = generatePlates(gamemode, params);
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
        resetTestNum();
        setTimerAllIsRunning(true);
        setButtonState(1);
        const initialPlate = generatePlates(gamemode, params);
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

  const EGplayAgain = () => {
    resetTestNum();
    setGameEndPopupVisibility(false);
    setButtonState(0);
    setNumberOfCorrectAnswers(0);
    setNumberOfIncorrectAnswers(0);
    setNumberOfQuestion(0);
    setTimerAllTime(0);
    setTimerAllIsRunning(false);
    setGameUserData(createEmptyScores());
    setGeneratedPlates({
      id: 0,
      plate: "*** ****",
      voigroup: "",
      city: "",
      platesQuantity: 0,
      lastid: 0,
    });
  };

  const EGhome = () => {
    if (onHome) onHome();
  };

  const EGprofile = () => {
    if (onProfile) onProfile();
  };

  return (
    <>
      {gameEndPopupVisibility && (
        <div className="rounded-xl bg-violet-400 uppercase font-bold text-white text-center fixed inset-0 z-50">
          <div className="w-screen h-screen absolute bg-black/50 top-0 left-0"></div>
          <section className="w-10/12 h-4/6 absolute bg-white rounded-3xl left-[8.33%] top-[16.66%]">
            <p className="text-7xl text-violet-500 mt-4 mb-8">🎉 KONIEC 🎉</p>
            <p className="text-6xl text-violet-400 my-4">
              Wynik:{" "}
              <span
                className={
                  numberOfCorrectAnswers === generatedPlates.platesQuantity
                    ? "text-[#c0ae47]"
                    : "text-violet-400"
                }
              >
                {numberOfCorrectAnswers}/{generatedPlates.platesQuantity || numberOfQuestion}
              </span>
            </p>
            <div>
              <p className="text-6xl text-violet-400 my-4">
                CZAS: {timerAllMinutes.toString().padStart(2, "0")}:
                {timerAllSeconds.toString().padStart(2, "0")}
              </p>
            </div>
            <div className="text-black flex mx-auto">
              <div className="mx-auto flex flex-wrap justify-center">
                {voisArr.map((voi: string, index: number) => (
                  <p className="mx-2" key={index}>
                    {timeAndScoreTB[voi]?.name}: {gameUserData["score_" + voi] || 0}
                    /{timeAndScoreTB[voi]?.score}
                  </p>
                ))}
              </div>
            </div>
            <div className="w-full">
              <progress value={0.5} className="my-4 w-[90%] h-8 mx-[5%]" />
            </div>

            <div className="bottom-0 absolute w-full">
              <button
                className="w-[90%] text-white bg-violet-400 hover:bg-violet-300 mx-4 text-4xl rounded-2xl py-2 cursor-pointer"
                onClick={EGplayAgain}
              >
                ZAGRAJ PONOWNIE
              </button>
              <div className="flex">
                <button
                  className="w-[50%] text-white bg-violet-400 hover:bg-violet-300 ml-[5%] mr-1 text-3xl my-4 rounded-2xl py-2 cursor-pointer"
                  onClick={EGhome}
                >
                  WRÓĆ NA STRONĘ GŁÓWNĄ
                </button>
                <button
                  className="w-[50%] text-white bg-violet-400 hover:bg-violet-300 mr-[5%] text-3xl my-4 rounded-2xl py-2 cursor-pointer"
                  onClick={EGprofile}
                >
                  PRZEJDŹ DO PROFILU
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      <div
        className="grid grid-cols-6 w-screen h-screen content-center justify-items-center bg-violet-50"
        onKeyDown={(e) =>
          timerAllIsRunning ? (e.key === "Enter" ? buttonHandler() : null) : null
        }
      >
        <section className="col-span-1 w-full">
          <button
            onClick={EGhome}
            className="m-4 text-xl font-bold uppercase bg-violet-400 hover:bg-violet-300 text-white px-4 py-2 rounded-xl cursor-pointer"
          >
            ← Menu
          </button>
        </section>

        <section className="col-span-4 w-9/12">
          <LicensePlate plate={generatedPlates.plate} />
          <div className="my-4 w-4/12a flexa ml-4/12a">
            <input
              type="text"
              className="w-full border-2 border-black rounded-xl text-6xl p-2 bg-white"
              onChange={handleUserAnswer}
              ref={answerInputRef}
            />
            <button
              className="w-full text-2xl rounded-xl bg-violet-400 hover:bg-violet-500 py-1 my-2 uppercase font-bold text-white cursor-pointer"
              onClick={buttonHandler}
            >
              {buttonState === 0 && <span>Start</span>}
              {buttonState === 1 && <span>nie wiem</span>}
              {buttonState === 2 && <span>Nastepny</span>}
            </button>
            <div className="w-full text-2xl h-14 my-2">
              {correctAnswerVisibility && (
                <div className="rounded-xl bg-violet-400 uppercase font-bold text-white text-center py-2">
                  <p>
                    Prawidłowa odpowiedź to:
                    <br />
                    {generatedPlates.city}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="col-span-1 w-full">
          <div>
            {(gamemode === "voivodeshipsTest" || gamemode === "allTest") && (
              <>
                <div className="w-8/12 bg-violet-600 text-white text-center rounded-xl mx-auto my-2">
                  <p className="text-4xl py-12">
                    {numberOfCorrectAnswers}/{generatedPlates.platesQuantity}
                  </p>
                  <hr className="mx-1" />
                  <p className="text-sm uppercase">wynik</p>
                </div>
                <div className="w-8/12 bg-blue-600 text-white text-center rounded-xl mx-auto my-2">
                  <p className="text-4xl py-12">
                    {numberOfQuestion}/{generatedPlates.platesQuantity}
                  </p>
                  <hr className="mx-1" />
                  <p className="text-sm uppercase">id pytania</p>
                </div>
              </>
            )}
            <div className="w-full bg-violet-600 text-white text-center rounded-xl mx-auto my-2">
              <p className="text-6xl py-8">
                {timerAllMinutes.toString().padStart(2, "0")}:
                {timerAllSeconds.toString().padStart(2, "0")}
              </p>
              <hr className="mx-1" />
              <p className="text-sm uppercase">czas</p>
            </div>
            <div className="w-8/12 bg-green-600 text-white text-center rounded-xl mx-auto my-2">
              <p
                className={
                  numberOfCorrectAnswers > 99
                    ? "text-7xl py-8"
                    : "text-8xl py-4"
                }
              >
                {numberOfCorrectAnswers}
              </p>
              <hr className="mx-1" />
              <p className="text-sm uppercase">dobre odpowiedzi</p>
            </div>
            <div className="w-8/12 bg-red-600 text-white text-center rounded-xl mx-auto my-2">
              <p
                className={
                  numberOfIncorrectAnswers > 99
                    ? "text-7xl py-8"
                    : "text-8xl py-4"
                }
              >
                {numberOfIncorrectAnswers}
              </p>
              <hr className="mx-1" />
              <p className="text-sm uppercase">złe odpowiedzi</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
