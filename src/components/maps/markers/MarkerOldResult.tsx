import { Coordinate } from "@/types/game/Coordinates"
import * as CS from "@/styles/ControlStyles"
import { useEffect, useState } from "react"
import MapUtils from "@/utils/MapUtils"
import { CopyToClipboard } from "react-copy-to-clipboard"
import GameResult from "@/types/game/GameResult"

interface IMarkerOldResult {
    result: GameResult
    onClick: () => void
}
export default function MarkerOldResult({ result, onClick }: IMarkerOldResult) {

    const handleCopy = () => {
        navigator.clipboard.writeText(result.address)
    }

    return (
        <div className="relative w-8 h-8">
            {/* <div className="result-marker">
            </div> */}
            <div className="absolute w-6 h-6 bg-purple-500 rounded-full animate-ping"
                onClick={() => {onClick()}}
            >
            </div>
            <CS.OldResultBox className="hidden">
                <span className="value">
                    {result.address}
                </span>
                <div className="control">
                    <CopyToClipboard
                        text={result.address}
                    >
                        <button className="more">
                            복사
                        </button>
                    </CopyToClipboard>
                    {/* <button className="more">
                        더 보기
                    </button> */}
                </div>
            </CS.OldResultBox>
        </div>
    )
}