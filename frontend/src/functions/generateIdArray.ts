import { rangesTB } from "@/database/db";
import { printRange } from "./printRange";

export function generateIdArray(gamemode: string, voiStr: string) {
  let numsList: string[] = [];
  if (gamemode === "voivodeshipsRandom" || gamemode === "voivodeshipsTest") {
    const letters = voiStr.split("");
    const arrRange: [number, number][] = [];
    for (let i = 0; i < letters.length; i++) {
      const letter = letters[i];
      const range = rangesTB[letter];
      arrRange[i] = range;
    }

    for (let i = 0; i < arrRange.length; i++) {
      const min = arrRange[i][0];
      const max = arrRange[i][1];
      const tx = printRange(min, max);
      const prg = tx.split(",");
      numsList = numsList.concat(prg);
    }
  }
  return numsList;
}
