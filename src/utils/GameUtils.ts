import { TextFormats } from "@/types/CommonTypes"
import { LocalStorageConsts } from "@/types/Consts"
import { Coordinate, Coordinates } from "@/types/game/Coordinates"
import GameResult from "@/types/game/GameResult"
import axios from "axios"
import CommonUtils from "./CommonUtils"

export default class GameUtils {
    static getRandomPickDelay(i: number, count: number): number {
        if (i < count * 0.5) {
            return 10
        } else if (i < count * 0.7) {
            return 50
        } else if (i < count * 0.9) {
            return 100
        } else if (i < count * 0.97) {
            return 500
        } else if (i < count * 0.99) {
            return 1000
        } else {
            return 1500
        }
    }
    static saveResult(result: GameResult) {
        const resultObject = result.toObjectData()

        const oldResults: string = localStorage.getItem(LocalStorageConsts.GAME_RESULT)

        let newResults: object[] = []

        // 기존에 결과가 있으면 기존 결과에 데이터 추가
        if (!CommonUtils.isNullOrUndefined(oldResults)) {
            const oldResultData: object[] = JSON.parse(oldResults)

            if (Array.isArray(oldResultData)) {
                newResults = oldResultData
            }
        }

        newResults.push(resultObject)
        localStorage.setItem(LocalStorageConsts.GAME_RESULT, JSON.stringify(newResults))
    }
    static getResults(): GameResult[] {
        const results: GameResult[] = []

        const resultsString = localStorage.getItem(LocalStorageConsts.GAME_RESULT)
        if (resultsString) {
            const resultsObject = JSON.parse(resultsString)
            resultsObject.forEach((result: object) => {
                const _result = new GameResult(result.coord, result.address, result.created)
                results.push(_result)
            })
        }

        return results
    }
}
