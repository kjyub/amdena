import { useEffect, useState } from 'react'
import './App.css'
import MapBase from './components/maps/MapBase'
import ControlMain from './components/controls/ControlMain'
import { Coordinates } from './types/game/Coordinates'
import { AreaMethodTypes, GameTypes } from './types/ControlTypes'

function App() {
    const [map, setMap] = useState<google.maps.Map | null>(null)
    const [selectedArea, setSelectedArea] = useState<Coordinates>([])

    const [areaMethodType, setAreaMethodType] = useState<AreaMethodTypes>(AreaMethodTypes.ALL)
    const [randomGameType, setRandomGameType] = useState<GameTypes>(GameTypes.NONE)
    const [isGameStart, setGameStart] = useState<boolean>(false)

    useEffect(() => {
        setSelectedArea([])
        setRandomGameType(GameTypes.NONE)
        setGameStart(false)
    }, [areaMethodType])


    return (
        <>
            <MapBase 
                map={map} 
                setMap={setMap} 
                selectedArea={selectedArea}
                areaMethodType={areaMethodType}
                setSelectedArea={setSelectedArea}
                isGameStart={isGameStart}
                setGameStart={setGameStart}
                randomGameType={randomGameType}
            />
            <ControlMain 
                map={map} 
                selectedArea={selectedArea}
                setSelectedArea={setSelectedArea} 
                areaMethodType={areaMethodType}
                setAreaMethodType={setAreaMethodType}
                randomGameType={randomGameType}
                setRandomGameType={setRandomGameType}
                isGameStart={isGameStart}
                setGameStart={setGameStart}
            />
        </>
    )
}

export default App
