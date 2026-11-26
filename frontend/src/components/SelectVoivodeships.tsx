import { useState } from "react";

interface SelectVoivodeshipsProps {
  gamemode: "voivodeshipsRandom" | "voivodeshipsTest";
  onStart: (selectedVoivodeships: string) => void;
  onBack?: () => void;
}

/*
  Wybór województw - dokładnie taki sam UI/UX jak w STARY_PROJEKT.
*/
export default function SelectVoivodeships({
  onStart,
}: SelectVoivodeshipsProps) {
  const voiButtons = [
    { key: 1, text: "Dolnośląskie", value: "D" },
    { key: 2, text: "Kujawsko - pomorskie", value: "C" },
    { key: 3, text: "Lubelskie", value: "L" },
    { key: 4, text: "Lubuskie", value: "F" },
    { key: 5, text: "Łódzkie", value: "E" },
    { key: 6, text: "Małopolskie", value: "K" },
    { key: 7, text: "Mazowieckie", value: "W" },
    { key: 8, text: "Opolskie", value: "O" },
    { key: 9, text: "Podkarpackie", value: "R" },
    { key: 10, text: "Podlaskie", value: "B" },
    { key: 11, text: "Pomorskie", value: "G" },
    { key: 12, text: "Śląskie", value: "S" },
    { key: 13, text: "Świętokrzyskie", value: "T" },
    { key: 14, text: "Warmińsko - mazurskie", value: "N" },
    { key: 15, text: "Wielkopolskie", value: "P" },
    { key: 16, text: "Zachodniopomorskie", value: "Z" },
  ];

  const poppedButton = { key: 17, text: "Dzielnice Warszawy", value: "X" };

  const [isChecked, setIsChecked] = useState<Record<string, boolean>>({
    B: false,
    C: false,
    D: false,
    E: false,
    F: false,
    G: false,
    K: false,
    L: false,
    N: false,
    O: false,
    P: false,
    R: false,
    S: false,
    T: false,
    W: false,
    Z: false,
    X: false,
  });

  const handleCheck = (v: string) => {
    setIsChecked((prev) => ({
      ...prev,
      [v]: !prev[v],
    }));
  };

  const handleStart = () => {
    let str = "";
    for (const [key, value] of Object.entries(isChecked)) {
      if (value === true) {
        str += key;
      }
    }

    if (!str) {
      alert("Wybierz przynajmniej jedno województwo!");
      return;
    }

    onStart(str);
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-violet-50">
      <div className="w-5/12 h-4/12">
        <h1 className="text-6xl my-16 text-violet-700 text-center">
          Wybierz województwa
        </h1>
        <div className="grid grid-cols-2 w-full">
          {voiButtons.map((btn) => (
            <div
              key={btn.key}
              className="text-center justify-center h-8 w-64 my-1 mx-auto text-xl tracking-wide"
            >
              <button
                className={`w-full cursor-pointer transition-colors ${
                  isChecked[btn.value] ? "text-green-400 font-bold" : "text-red-400"
                }`}
                onClick={() => handleCheck(btn.value)}
              >
                {btn.text}
              </button>
            </div>
          ))}
        </div>
        <div className="text-center justify-center h-8 w-64 my-1 mx-auto text-xl tracking-wide">
          <button
            className={`w-full cursor-pointer transition-colors ${
              isChecked[poppedButton.value]
                ? "text-green-400 font-bold"
                : "text-red-400"
            }`}
            onClick={() => handleCheck(poppedButton.value)}
          >
            {poppedButton.text}
          </button>
        </div>
        <button
          className="p-2 m-2 block text-4xl uppercase px-2 py-1 my-4 w-full bg-violet-400 hover:bg-violet-300 rounded-xl text-center text-violet-50 cursor-pointer"
          onClick={handleStart}
        >
          Start
        </button>
      </div>
    </div>
  );
}
