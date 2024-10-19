import * as CS from "@/styles/ControlStyles"
import { AreaMethodTypes } from "@/types/ControlTypes"
import CommonUtils from "@/utils/CommonUtils"
import { useEffect, useState } from "react"
import ControlAreaSearch from "./ControlAreaSearch"
import { Coordinates } from "@/types/game/Coordinates"
import MapUtils from "@/utils/MapUtils"

const boxWidth = 100
const boxHeight = 100

interface IControlArea {
    map: google.maps.Map
    areaMethodType: AreaMethodTypes
    setAreaMethodType: React.Dispatch<React.SetStateAction<AreaMethodTypes>>
    selectedArea: Coordinates
    setSelectedArea: React.Dispatch<React.SetStateAction<Coordinates>>
}
export default function ControlArea({ 
    map, 
    areaMethodType, 
    setAreaMethodType, 
    selectedArea,
    setSelectedArea, 
}: IControlArea) {
    const isDrawPath = areaMethodType === AreaMethodTypes.AREA && selectedArea.length === 0
    const isDrawDone = areaMethodType === AreaMethodTypes.AREA && selectedArea.length > 0
    
    useEffect(() => {
        if (isDrawDone) {
            getScaledArea()
        }
    }, [areaMethodType, selectedArea])

    const handleAreaMethod = (type: AreaMethodTypes) => {
        if (type === areaMethodType) {
            setAreaMethodType(AreaMethodTypes.ALL)
        } else {
            setAreaMethodType(type)
        }
    }

    const getScaledArea = () => {
        MapUtils.drawPolygonCanvas(selectedArea, "area-canvas")
    }

    return (
        <CS.ControlBox>
            <CS.ControlExplain>
                <p>영역을 설정할 방식을 골라주세요</p>
                {/* <p className="sub">고르지 않을 시 전 세계에서 선택합니다</p> */}
            </CS.ControlExplain>

            <CS.AreaMethodBox>
                <CS.AreaMethodButton 
                    $is_active={areaMethodType === AreaMethodTypes.AREA}
                    onClick={() => {handleAreaMethod(AreaMethodTypes.AREA)}}
                >
                    <span>영역 그리기</span>
                </CS.AreaMethodButton>
                <CS.AreaMethodButton 
                    $is_active={areaMethodType === AreaMethodTypes.LOCATION}
                    onClick={() => {handleAreaMethod(AreaMethodTypes.LOCATION)}}
                >
                    <span>영역 검색</span>
                </CS.AreaMethodButton>
            </CS.AreaMethodBox>

            {isDrawPath && (
                <div className="w-full h-24">
                    <div className="area-active flex flex-col flex-center text-sm text-sand-700">
                        <span>지도 위에 직접 영역을 그려주세요</span>
                        <span>시작 지점 부근을 클릭하여 완료</span>
                        <span className="text-xs text-sand-500">다시 그릴려면 영역 그리기를 다시 실행해주세요</span>
                    </div>
                </div>
            )}
            {isDrawDone && (
                <div className="flex flex-center p-2 rounded-xl bg-sand-100/40">
                    <canvas
                        id="area-canvas"
                        className={`w-[${boxWidth}px] h-[${boxHeight}px]`}
                        style={{width: `${boxWidth}px`, height: `${boxHeight}px`}}
                    />
                </div>
            )}

            {areaMethodType === AreaMethodTypes.LOCATION && (
                <ControlAreaSearch map={map} setSelectedArea={setSelectedArea} />
            )}
        </CS.ControlBox>
    )
}