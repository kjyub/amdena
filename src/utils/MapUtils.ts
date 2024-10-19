import { TextFormats } from "@/types/CommonTypes"
import { Coordinate, Coordinates } from "@/types/game/Coordinates"
import axios from "axios"

export default class MapUtils {
    static async getGeocode(lat: number, lng: number): google.maps.GeocoderResult | null {
        let geocode: google.maps.GeocoderResult | null = null

        try {
            const response: google.maps.GeocoderResponse = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`
            )
            
            const results = response.data.results
            let result: google.maps.GeocoderResult = null

            if (results.length > 2) {
                geocode = results[results.length - 2]
            } else if (results.length === 1) {
                geocode = results[0]
            } else {
                return geocode
            }
        } catch (error) {
            console.error('Error during reverse geocoding:', error)
        }

        return geocode
    }
    static async getMapAddress(lat: number, lng: number): string {
        let address = ""

        const geocode = await this.getGeocode(lat, lng)
        address = geocode.formatted_address

        return address
    }
    static getCoordinateMargin(zoom: number): number {
        const a = 0.040275
        const b = -0.801375
        const c = 4.0
        return a * zoom * zoom + b * zoom + c
    }
    static isEqualCoordinate (a: Coordinate, b: Coordinate, zoom: number = -1): boolean {
        // Zoom에 따라 좌표 비교 시 마진을 조절한다
        // -1이면 정확히 일치해야 한다
        if (zoom === -1) {
            return a.lat === b.lat && a.lng === b.lng
        }
        
        const margin = this.getCoordinateMargin(zoom)

        return Math.abs(a.lat - b.lat) < margin && Math.abs(a.lng - b.lng) < margin
    }
    static getPolygonBoundingBox(coordinates: Coordinates): [number, number, number, number] {
        let minX = coordinates[0].lng
        let maxX = coordinates[0].lng
        let minY = coordinates[0].lat
        let maxY = coordinates[0].lat

        coordinates.forEach((coord) => {
            minX = Math.min(minX, coord.lng)
            maxX = Math.max(maxX, coord.lng)
            minY = Math.min(minY, coord.lat)
            maxY = Math.max(maxY, coord.lat)
        })

        return [minX, minY, maxX, maxY]
    }
    static drawPolygonCanvas(coordinates: Coordinates, canvasId: string) {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement
        if (!canvas) {
            return
        }
        const boxWidth = canvas.clientWidth
        const boxHeight = canvas.clientHeight

        const [selectedAreaMinX, selectedAreaMinY, selectedAreaMaxX, selectedAreaMaxY] = this.getPolygonBoundingBox(coordinates)

        const shapeWidth = selectedAreaMaxX - selectedAreaMinX
        const shapeHeight = selectedAreaMaxY - selectedAreaMinY
        const scaleRatio = Math.min(boxWidth / shapeWidth, boxHeight / shapeHeight)
        const scaleX = boxWidth / shapeWidth
        const scaleY = boxHeight / shapeHeight

        const scaledCoord = coordinates.map(coord => {
            return {
                lng: (coord.lng - selectedAreaMinX) * scaleY,
                lat: (coord.lat - selectedAreaMinY) * scaleX,
            }
        })
        const scaledWidth = shapeWidth * scaleY
        const scaledHeight = shapeHeight * scaleX

        const offsetX = (boxWidth - scaledWidth) / 2
        const offsetY = (boxHeight - scaledHeight) / 2

        const finalCoords = scaledCoord.map(coord => {
            return {
                lng: (coord.lng + offsetX) * 1.5 + 48,
                lat: (boxHeight - (coord.lat + offsetY)) * 1.5,
            }
        })

        const ctx = canvas.getContext("2d")
        if (!ctx) {
            return
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.beginPath()
        finalCoords.forEach((coord, idx) => {
            console.log(coord.lng, coord.lat)
            if (idx === 0) {
                ctx.moveTo(coord.lng, coord.lat)
            } else {
                ctx.lineTo(coord.lng, coord.lat)
            }
        })
        ctx.closePath()

        ctx.strokeStyle = "blue"
        ctx.lineWidth = 3
        ctx.stroke()
    }
    static isContainPolygon(area: Coordinates, coord: Coordinate): boolean {
        const N = area.length - 1 // 다각형의 꼭짓점 개수 (마지막 점은 첫 번째 점과 같다고 가정)
        let counter = 0
        let p1: Coordinate = area[0]

        for (let i = 1; i <= N; i++) {
            const p2: Coordinate = area[i % N]

            // 점의 y좌표가 p1과 p2 사이에 있는지 확인
            if (
                coord.lat > Math.min(p1.lat, p2.lat) &&
                coord.lat <= Math.max(p1.lat, p2.lat) &&
                coord.lng <= Math.max(p1.lng, p2.lng) &&
                p1.lat !== p2.lat
            ) {
                // 다각형의 변과 수평선을 그었을 때의 교차점 x좌표 계산
                const xinters = ((coord.lat - p1.lat) * (p2.lng - p1.lng)) / (p2.lat - p1.lat) + p1.lng

                // 교차점이 점의 x좌표보다 오른쪽에 있거나, 변이 수직인 경우 카운터 증가
                if (p1.lng === p2.lng || coord.lng <= xinters) {
                    counter += 1
                }
            }

            p1 = p2
        }

        // 교차 횟수가 홀수이면 내부, 짝수이면 외부
        return counter % 2 !== 0
    }
    static getRandomCoordinate(area: Coordinates): Coordinate {
        const [minX, minY, maxX, maxY] = this.getPolygonBoundingBox(area)
        
        const getRandomCoordByRect = (): Coordinate => {
            return { lat: Math.random() * (maxY - minY) + minY, lng: Math.random() * (maxX - minX) + minX }
        }

        let randomCoord: Coordinate = { lng: 0, lat: 0 }

        while(true) {
            randomCoord = getRandomCoordByRect()
            if (this.isContainPolygon(area, randomCoord)) {
                break
            }
        }

        return randomCoord
    }
}
