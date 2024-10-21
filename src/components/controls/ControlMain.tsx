import * as CS from "@/styles/ControlStyles"
import CommonUtils from "@/utils/CommonUtils"
import ControlArea from "./ControlArea"
import ControlGame from "./ControlGame"
import { AreaMethodTypes, GameTypes } from "@/types/ControlTypes"
import React, { useEffect, useState } from "react"
import ControlAreaSearch from "./ControlAreaSearch"
import { Coordinates } from "@/types/game/Coordinates"
import ModalContainer from "../ModalContainer"

interface IControlMain {
    map: google.maps.Map | null
    selectedArea: Coordinates
    setSelectedArea: React.Dispatch<React.SetStateAction<Coordinates>>
    areaMethodType: AreaMethodTypes
    setAreaMethodType: React.Dispatch<React.SetStateAction<AreaMethodTypes>>
    randomGameType: GameTypes
    setRandomGameType: React.Dispatch<React.SetStateAction<GameTypes>>
    isGameStart: boolean
    setGameStart: React.Dispatch<React.SetStateAction<boolean>>
    isShowResultMarker: boolean
    setShowResultMarker: React.Dispatch<React.SetStateAction<boolean>>
    isShowResultList: boolean
    setShowResultList: React.Dispatch<React.SetStateAction<boolean>>
}
export default function ControlMain({ 
    map, 
    selectedArea,
    setSelectedArea,
    areaMethodType,
    setAreaMethodType,
    randomGameType,
    setRandomGameType,
    isGameStart,
    setGameStart,
    isShowResultMarker,
    setShowResultMarker,
    isShowResultList,
    setShowResultList,
}: IControlMain) {
    const [isMobileControlShow, setMobileControlShow] = useState<boolean>(false)

    const [isShowResultListModal, setShowResultListModal] = useState<boolean>(false)

    const isAvailGameStart = selectedArea.length > 0 && randomGameType !== GameTypes.NONE

    const handleGameStart = () => {
        if (selectedArea.length === 0) {
            alert("영역을 설정해주세요")
            return
        }

        if (randomGameType === GameTypes.NONE) {
            alert("게임 종류를 선택해주세요")
            return
        }

        setGameStart(true)
    }

    const GameControl = (
        <div className="flex items-center w-full space-x-2">
            <CS.GameStartButton
                onClick={() => {handleGameStart()}}
                disabled={!isAvailGameStart}
            >
                <span>게임 시작</span>
            </CS.GameStartButton>
            <CS.GameResetButton
                onClick={() => {setAreaMethodType(AreaMethodTypes.ALL)}}
            >
                <span>초기화</span>
            </CS.GameResetButton>
        </div>
    )

    return (
        <>
            <CS.Layout
                $is_show={isMobileControlShow}
            >
                <CS.Panel>
                    <ControlArea 
                        map={map} 
                        areaMethodType={areaMethodType} 
                        setAreaMethodType={setAreaMethodType}  
                        selectedArea={selectedArea}
                        setSelectedArea={setSelectedArea} 
                    />

                    <ControlGame randomGameType={randomGameType} setRandomGameType={setRandomGameType} />

                    <CS.ToolBox>
                        <CS.ToolBoxButton
                            $is_active={isShowResultMarker}
                            onClick={() => {setShowResultMarker(!isShowResultMarker)}}
                        >
                            <i className="fa-solid fa-location-dot"></i>
                            <span>
                                이전 결과 마커
                            </span>
                        </CS.ToolBoxButton>
                        <CS.ToolBoxButton
                            $is_active={isShowResultList}
                            onClick={() => {setShowResultList(!isShowResultList)}}
                        >
                            <i className="fa-solid fa-list-ul"></i>
                            <span>
                                이전 결과 목록
                            </span>
                        </CS.ToolBoxButton>
                    </CS.ToolBox>

                    <CS.GameControlLayoutDesktop className="max-desktop:hidden">
                        {GameControl}
                    </CS.GameControlLayoutDesktop>
                </CS.Panel>

                <CS.GameControlLayoutMobile className="desktop:hidden">
                    {GameControl}
                </CS.GameControlLayoutMobile>
            </CS.Layout>

            <CS.ToggleMobileControl 
                $is_show={isMobileControlShow}
                onClick={() => {setMobileControlShow(!isMobileControlShow)}}
            >
                {isMobileControlShow ? "접기" : "펼치기"}
            </CS.ToggleMobileControl>
        </>
    )
}