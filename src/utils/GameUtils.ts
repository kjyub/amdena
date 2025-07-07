import { LocalStorageConsts } from "@/types/Consts";
import GameResult from "@/types/game/GameResult";
import { Coordinate } from "@/types/game/Coordinates";

interface IGameResultData {
  coord: Coordinate;
  address: string;
  created: string;
}

export default class GameUtils {
  static getRandomPickDelay(i: number, count: number): number {
    if (i < count * 0.5) {
      return 10;
    } else if (i < count * 0.7) {
      return 50;
    } else if (i < count * 0.9) {
      return 100;
    } else if (i < count * 0.97) {
      return 500;
    } else if (i < count * 0.99) {
      return 1000;
    } else {
      return 1500;
    }
  }
  static saveResult(result: GameResult) {
    const resultObject = result.toObjectData();

    const oldResults= localStorage.getItem(
      LocalStorageConsts.GAME_RESULT,
    );

    let newResults = [];

    // 기존에 결과가 있으면 기존 결과에 데이터 추가
    if (oldResults) {
      const oldResultData: unknown = JSON.parse(oldResults);

      if (Array.isArray(oldResultData)) {
        newResults = oldResultData;
      }
    }

    newResults.push(resultObject);
    localStorage.setItem(
      LocalStorageConsts.GAME_RESULT,
      JSON.stringify(newResults),
    );
  }
  static getResults(): GameResult[] {
    const results: GameResult[] = [];

    const resultsString = localStorage.getItem(LocalStorageConsts.GAME_RESULT);
    if (resultsString) {
      const resultsObject = JSON.parse(resultsString) as IGameResultData[];

      for (const result of resultsObject) {
        const _result = new GameResult(
          result.coord,
          result.address,
          new Date(result.created),
        );
        results.push(_result);
      }
    }

    return results.sort((a, b) => b.created.getTime() - a.created.getTime());
  }
}
