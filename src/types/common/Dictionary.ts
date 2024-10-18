import CommonUtils from "@/utils/CommonUtils"
import React from "react"
import { v4 } from "uuid"

type KeyTypes = number | string

export class Dictionary<T extends KeyTypes, K> {
    // public id: string
    private data: Record<KeyTypes, K> = {}

    constructor(_dic: Dictionary<T, K> = null) {
        // this.id = v4()

        if (!CommonUtils.isNullOrUndefined(_dic)) {
            this.data = _dic.data
        }
    }

    push(key: T, value: K) {
        this.data[key] = value
    }

    getKeys(): Array<T> {
        return Object.keys(this.data) as Array<T>
    }

    getValue(key: T): K {
        return this.data[key]
    }

    getValues(): Array<K> {
        return this.getKeys().map((key) => this.data[key])
    }

    getFirst(): K | undefined {
        const values = this.getKeys().map((key) => this.data[key])

        if (values.length > 0) {
            return values[0]
        }
    }

    contains(key: T): boolean {
        let result = false
        this.getKeys().map((k: T) => {
            if (k === key.toString()) {
                result = true
                return
            }
        })
        return result
    }

    getLast() {
        const values = this.getKeys().map((key) => this.data[key])

        if (values.length > 0) {
            return values[values.length - 1]
        }
    }

    copy(): Dictionary<T, K> {
        let newData = new Dictionary<T, K>()
        this.getKeys().map((key) => {
            newData.push(key, this.data[key])
        })
        return newData
    }

    delete(key: T) {
        delete this.data[key]
    }

    getData(): Record<T, K> {
        return this.data
    }
}
