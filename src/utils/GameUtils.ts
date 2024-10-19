import { TextFormats } from "@/types/CommonTypes"
import { Coordinate, Coordinates } from "@/types/game/Coordinates"
import axios from "axios"

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
}
