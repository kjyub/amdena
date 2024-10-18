import { useEffect, useState } from 'react'
import './App.css'
import MapBase from './components/maps/MapBase'
import ControlMain from './components/controls/ControlMain'
import { Coordinates } from './types/game/Coordinates'
import { AreaMethodTypes, GameTypes } from './types/ControlTypes'

function App() {
    const [map, setMap] = useState<google.maps.Map>(null)
    const [selectedArea, setSelectedArea] = useState<Coordinates>([])

    const [areaMethodType, setAreaMethodType] = useState<AreaMethsodTypes>(AreaMethodTypes.ALL)
    const [randomGameType, setRandomGameType] = useState<GameTypes>(GameTypes.NONE)

    useEffect(() => {
        setSelectedArea([])
    }, [areaMethodType])


    return (
        <>
            <MapBase 
                map={map} 
                setMap={setMap} 
                selectedArea={selectedArea}
                areaMethodType={areaMethodType}
                setSelectedArea={setSelectedArea}
            />
            <ControlMain 
                map={map} 
                selectedArea={selectedArea}
                setSelectedArea={setSelectedArea} 
                areaMethodType={areaMethodType}
                setAreaMethodType={setAreaMethodType}
                randomGameType={randomGameType}
                setRandomGameType={setRandomGameType}
            />
        </>
    )
}

export default App
