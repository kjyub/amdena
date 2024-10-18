import { TextFormats } from "@/types/CommonTypes"
import { Coordinate, Coordinates } from "@/types/game/Coordinates"

export default class MapUtils {
    static async getMapAddress(lat: number, lng: number): string {
        let address = ""

        try {
            const response: google.maps.GeocoderResponse = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`
            )
            
            const results = response.data.results
            let result: google.maps.GeocoderResult = null

            if (results.length > 2) {
                result = results[results.length - 2]
            } else if (results.length === 1) {
                result = results[0]
            } else {
                return ""
            }

            address = result.formatted_address
        } catch (error) {
            console.error('Error during reverse geocoding:', error)
        }

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
}
