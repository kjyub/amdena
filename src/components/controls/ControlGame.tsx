import * as CS from "@/styles/ControlStyles"
import { AreaMethodTypes, GameTypes } from "@/types/ControlTypes"
import CommonUtils from "@/utils/CommonUtils"
import React, { useState } from "react"

interface IControlGame {
    randomGameType: GameTypes
    setRandomGameType: React.Dispatch<React.SetStateAction<GameTypes>>
}
export default function ControlGame({randomGameType, setRandomGameType}: IControlGame) {
    const [areaMethodType, setAreaMethodType] = useState<AreaMethsodTypes>(AreaMethodTypes.ALL)
    
    const handleAreaMethod = (type: AreaMethodTypes) => {
        if (type === areaMethodType) {
            setAreaMethodType(AreaMethodTypes.ALL)
        } else {
            setAreaMethodType(type)
        }
    }

    return (
        <CS.ControlBox>
            <CS.ControlExplain>
                <p>랜덤 게임을 선택해주세요</p>
                <p className="sub"></p>
            </CS.ControlExplain>

            <CS.GameSelectList>
                <Game 
                    type={GameTypes.RANDOM}
                    currentType={randomGameType}
                    setRandomType={setRandomGameType}
                    title="랜덤픽"
                    icon={<span>?</span>}
                />
            </CS.GameSelectList>
        </CS.ControlBox>
    )
}

interface IGame {
    type: number
    currentType: GameTypes
    setRandomType: React.Dispatch<React.SetStateAction<GameTypes>>
    title: string
    icon: React.ReactNode
}
const Game = ({ type, currentType, setRandomType, title, icon }: IGame) => {
    const [isFocus, setIsFocus] = useState<boolean>(false)

    const isHighlight = type === currentType || isFocus

    return (
        <CS.GameButton
            onMouseEnter={() => {setIsFocus(true)}}
            onMouseLeave={() => {setIsFocus(false)}}
            onClick={() => {
                setRandomType(type)
            }}
        >
            <div className={`icon bg-blue-400 border-2 border-blue-500 text-2xl text-yellow-400 font-bold shadow-blue-500 ${isHighlight ? "shadow-game_icon" : ""}`}>
                {icon}
            </div>
            <span className="title">
                {title}
            </span>
        </CS.GameButton>
    )
}