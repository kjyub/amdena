import * as CS from "@/styles/ControlStyles"
import CommonUtils from "@/utils/CommonUtils"
import ControlArea from "./ControlArea"
import ControlGame from "./ControlGame"
import { AreaMethodTypes, GameTypes } from "@/types/ControlTypes"
import React, { useEffect, useState } from "react"
import ControlAreaSearch from "./ControlAreaSearch"
import { Coordinates } from "@/types/game/Coordinates"

interface IControlMain {
    map: google.maps.Map
    selectedArea: Coordinates
    setSelectedArea: React.Dispatch<React.SetStateAction<Coordinates>>
    areaMethodType: AreaMethodTypes
    setAreaMethodType: React.Dispatch<React.SetStateAction<AreaMethodTypes>>
    randomGameType: GameTypes
    setRandomGameType: React.Dispatch<React.SetStateAction<GameTypes>>
}
export default function ControlMain({ 
    map, 
    selectedArea,
    setSelectedArea,
    areaMethodType,
    setAreaMethodType,
    randomGameType,
    setRandomGameType,
}: IControlMain) {

    return (
        <CS.Layout>
            <CS.Panel>
                <ControlArea 
                    map={map} 
                    areaMethodType={areaMethodType} 
                    setAreaMethodType={setAreaMethodType}  
                    selectedArea={selectedArea}
                    setSelectedArea={setSelectedArea} 
                />

                <ControlGame randomGameType={randomGameType} setRandomGameType={setRandomGameType} />

                <CS.GameStartButton>
                    <span>게임 시작</span>
                </CS.GameStartButton>
            </CS.Panel>
        </CS.Layout>
    )
}