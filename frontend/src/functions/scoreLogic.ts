/*
  Logika aktualizacji najlepszych wynikow i czasow gracza.
  Dla kazdego wojewodztwa wybiera wyzszy wynik punktowy
  oraz krotszy czas przy zachowaniu lepszego rezultatu.
*/
export interface UserScores {
  [key: string]: number;
}

export function createEmptyScores(): UserScores {
  const vois = [
    "B", "C", "D", "E", "F", "G", "K", "L",
    "N", "O", "P", "R", "S", "T", "W", "Z", "X", "all",
  ];
  const obj: UserScores = {};
  vois.forEach((v) => {
    obj[`score_${v}`] = 0;
    obj[`time_${v}`] = 0;
  });
  return obj;
}

export function scoreLogic(dataFromGame: UserScores, dataFromSession: UserScores): UserScores {
  const dbScoresObj = dataFromSession || createEmptyScores();
  const gameObj = dataFromGame || {};
  const returnObj: UserScores = { ...dbScoresObj };

  const vois = [
    "B", "C", "D", "E", "F", "G", "K", "L",
    "N", "O", "P", "R", "S", "T", "W", "Z", "X", "all",
  ];

  vois.forEach((element) => {
    const scoreIdt = `score_${element}`;
    const timeIdt = `time_${element}`;

    const currentBestScore = Number(dbScoresObj[scoreIdt] || 0);
    const gameScore = Number(gameObj[scoreIdt] || 0);
    const currentBestTime = Number(dbScoresObj[timeIdt] || 0);
    const gameTime = Number(gameObj[timeIdt] || 0);

    // Wybieramy wyzszy wynik
    if (gameScore > currentBestScore) {
      returnObj[scoreIdt] = gameScore;
      returnObj[timeIdt] = gameTime;
    } else if (gameScore === currentBestScore && gameScore > 0) {
      // Przy rownym wyniku wybieramy krotszy czas
      if (currentBestTime === 0 || (gameTime > 0 && gameTime < currentBestTime)) {
        returnObj[timeIdt] = gameTime;
      }
    }
  });

  return returnObj;
}

