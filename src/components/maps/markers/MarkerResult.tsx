import { Coordinate } from "@/types/game/Coordinates"
import * as CS from "@/styles/ControlStyles"
import { useEffect, useState } from "react"
import MapUtils from "@/utils/MapUtils"
import { CopyToClipboard } from "react-copy-to-clipboard"

interface IMarkerResult {
    position: Coordinate
}
export default function MarkerResult({ position }: IMarkerResult) {
    const [value, setValue] = useState<string>("")

    useEffect(() => {
        getGeocode(position.lat, position.lng)
    }, [position])

    const getGeocode = async (lat, lng) => {
        const geocode = await MapUtils.getGeocode(lat, lng)
        setValue(geocode?.formatted_address)
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(value)
    }

    return (
        <div className="relative w-8 h-8">
            {/* <div className="result-marker">
            </div> */}
            <div className="absolute w-6 h-6 bg-red-500 rounded-full animate-ping">
            </div>
            <CS.ResultBox>
                <span className="value">
                    {value}
                </span>
                <div className="control">
                    <CopyToClipboard
                        text={value}
                    >
                        <button className="more">
                            복사
                        </button>
                    </CopyToClipboard>
                    {/* <button className="more">
                        더 보기
                    </button> */}
                </div>
            </CS.ResultBox>
        </div>
    )
}