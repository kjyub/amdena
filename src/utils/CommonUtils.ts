import { TextFormats } from "@/types/CommonTypes"
import dayjs from "dayjs"
import moment, { Moment } from "moment"
import 'moment/locale/ko'
import { FormEventHandler } from "react"
import Inko from 'inko'

export default class CommonUtils {
    static isNullOrUndefined(data: any): boolean {
        return data === null || data === undefined
    }
    static isStringNullOrEmpty(data: any): boolean {
        return data === "" || this.isNullOrUndefined(data)
    }
    static toCamelCase(str: string) {
        return str.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''))
    }
    static round(value: number, round: number = 0): number {
        // return Math.round(value * Math.pow(10, round)) / Math.pow(10, round)
        return Number(value.toPrecision(round))
    }
    static getRandomEnumValue<T>(enumeration: T): T[keyof T] {
        const enumValues = Object.values(enumeration)
        const randomIndex = Math.floor(Math.random() * enumValues.length)
        return enumValues[randomIndex]
    }
    static getRandomChoice<T>(list: Array<T>): T {
        const randomIndex = Math.floor(Math.random() * list.length)

        return list[randomIndex]
    }
    static getCurrentBaseUrl(): string {
        return window.location.href.split("/").slice(0, 3).join("/")
    }
    static async copyClipboard(value: string): boolean {
        try {
            await navigator.clipboard.writeText(value)
        } catch (e) {
            return false
        }
        return true
    }
    static sha256(value: string): string {
        const hash = crypto.createHash("sha256")
        hash.update(value)
        return hash.digest("hex")
    }
    static telFormat(v: string): string {
        let value = v.replace(/[^0-9]/g, "")

        let result = []
        let restNumber = ""

        // 지역번호와 나머지 번호로 나누기
        if (value.startsWith("02")) {
            // 서울 02 지역번호
            result.push(value.substr(0, 2))
            restNumber = value.substring(2)
        } else if (value.startsWith("1")) {
            // 지역 번호가 없는 경우
            // 1xxx-yyyy
            restNumber = value
        } else {
            // 나머지 3자리 지역번호
            // 0xx-yyyy-zzzz
            result.push(value.substr(0, 3))
            restNumber = value.substring(3)
        }

        if (restNumber.length === 7) {
            // 7자리만 남았을 때는 xxx-yyyy
            result.push(restNumber.substring(0, 3))
            result.push(restNumber.substring(3))
        } else {
            result.push(restNumber.substring(0, 4))
            result.push(restNumber.substring(4))
        }

        return result.filter((val) => val).join("-")
    }
    static telFormatter(e): string {
        let value = e.target.value
        if (!value) {
            e.target.value = e.target.value
        }

        e.target.value = CommonUtils.telFormat(value)
    }
    static textFormat(text: string, format: TextFormats): string {
        let result = text

        if (format === TextFormats.NUMBER) {
            const number = Number(text)
            if (!isNaN(number)) {
                result = number.toLocaleString()
            }
            // // 숫자를 문자열로 변환
            // let numStr = text.toString()

            // // 정수 부분과 소수 부분 분리
            // const parts = numStr.split(".")
            // const integerPart = parts[0]
            // const decimalPart = parts[1] || ""

            // // 정수 부분에 콤마 추가
            // const integerWithCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

            // // 소수 부분과 합치기
            // result =
            //     decimalPart || text[text.length - 1] === "." ? `${integerWithCommas}.${decimalPart}` : integerWithCommas
            // console.log(decimalPart)
        } else if (format === TextFormats.PRICE) {
            const number = CommonUtils.textFormat(text, TextFormats.NUMBER)
            result = number + "원"
        }

        if (CommonUtils.isNullOrUndefined(result)) {
            result = ""
        }

        return result
    }
    static textFormatInput(text: string, format: TextFormats): string {
        let result = text

        if (format === TextFormats.NUMBER) {
            result = text.replaceAll(",", "")
        } else if (format === TextFormats.NUMBER_ONLY) {
            result = text.replace(/[^0-9]/g, "")
        } else if (format === TextFormats.PRICE) {
            // 미구현
            const number = CommonUtils.textFormatInput(text, TextFormats.NUMBER)
            result = number.replaceAll("원", "")
        } else if (format === TextFormats.TEL) {
            result = CommonUtils.telFormat(text)
        }

        return result
    }
    static isValidPassword(value: string): boolean {
        // 정규식: 최소 6자리, 영문자와 숫자 포함
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
        return regex.test(value)
    }
    // 현재 사용안함
    static relativeDateTime(dateString: string): string {
        const datetime = dayjs(dateString)
        
        if (!datetime.isValid()) {
            return "-"
        }

        const now = dayjs()
        const oneMonthAgo = now.subtract(30, "day")

        
        if (datetime.isBefore(oneMonthAgo)) {
            // 1달 보다 전이면 날짜로 표기
        } else {
            // 1달 이내면 상대날짜로 표기
        }
    }
    static getMoment(dateString: string | null): Moment {
        const m = new moment(dateString)
        return m
    }
    static setTextareaAutoHeight(e: any) {
        const element = e.target

        if (!element) {
            return
        }

        element.style.height = "auto"
        element.style.height = (Number(element.scrollHeight) + 4) + "px"
    }
}
