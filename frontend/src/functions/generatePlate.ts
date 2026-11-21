import { platesTB } from "@/database/db";
import { getRandomNumber } from "./randomNumber";
import { generateIdArray } from "./generateIdArray";

let testNum = 0;

export interface GeneratedPlateData {
  id: number;
  plate: string;
  voigroup: string;
  city: string;
  platesQuantity: number;
  lastid: unknown;
}

export default function generatePlates(gamemode: string, voiStr: string = ""): GeneratedPlateData {
  let rand: number;
  const idArray = generateIdArray(gamemode, voiStr);
  const lastid = idArray.length > 0 ? idArray[idArray.length - 1] : 0;
  let platesQuantity = 0;

  function makePlateR(template: string) {
    let characters = "";
    let result = "";
    const templateArr = template.split("");
    templateArr.forEach((element) => {
      switch (element) {
        case "$": {
          characters = "123456789";
          break;
        }
        case "#": {
          characters = "1234567890";
          break;
        }
        case "?": {
          characters = "ABCDEFGHIJKLMNOPRSTUVWXYZ";
          break;
        }
        case "*": {
          characters = "A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6R7S8T9U1V2W3X4Y5Z67890";
          break;
        }
        default: {
          characters = element;
          break;
        }
      }
      const charactersLength = characters.length;
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    });
    return result;
  }

  switch (gamemode) {
    case "voivodeshipsRandom": {
      rand = Number(idArray[getRandomNumber(0, idArray.length - 1)]);
      break;
    }
    case "voivodeshipsTest": {
      rand = Number(idArray[testNum]);
      testNum++;
      platesQuantity = idArray.length;
      break;
    }
    case "allRandom": {
      rand = getRandomNumber(1, 428);
      break;
    }
    case "allTest": {
      testNum++;
      rand = testNum;
      platesQuantity = 428;
      break;
    }
    default: {
      rand = getRandomNumber(1, 428);
      break;
    }
  }

  const plateObj = platesTB[rand] || platesTB[1];
  const plateL = plateObj.code;
  const plateid = plateObj.id;

  const specialRArr = plateObj.specialR;
  const specialRand = getRandomNumber(0, specialRArr.length - 1);
  const specialRselected = specialRArr[specialRand];
  const plateR = makePlateR(specialRselected);

  return {
    id: plateid,
    plate: plateL + " " + plateR,
    voigroup: plateObj.voigroup,
    city: plateObj.city,
    platesQuantity: platesQuantity,
    lastid: lastid,
  };
}
