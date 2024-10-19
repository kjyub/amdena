import * as MS from "@/styles/MapStyles"
import CommonUtils from "@/utils/CommonUtils"
import {Status, Wrapper} from "@googlemaps/react-wrapper"
import { useCallback, useEffect, useRef, useState } from "react"
// import GoogleMap from "./GoogleMap"
import { GoogleMap, useJsApiLoader, Autocomplete, Polygon, Marker, OverlayView } from '@react-google-maps/api'
import { Client } from "@googlemaps/google-maps-services-js";
import axios from "axios"
import { debounce } from "lodash"

import "@/styles/map.css"
import MapPlace from "./MapPlace"
import { Coordinate, Coordinates } from "@/types/game/Coordinates"
import { AreaMethodTypes, GameTypes } from "@/types/ControlTypes"
import MapUtils from "@/utils/MapUtils"
import { get } from "node_modules/axios/index.cjs"
import { l } from "node_modules/vite/dist/node/types.d-aGj9QkWt"
import GameUtils from "@/utils/GameUtils"
import MarkerResult from "./markers/MarkerResult"

const initialZoom = 8

const initialCenter = {
    lat: 37.5665,
    lng: 126.9780,
}

interface IMapBase {
    map: google.maps.Map
    setMap: React.Dispatch<React.SetStateAction<google.maps.Map>>
    selectedArea: Coordinates    
    setSelectedArea: React.Dispatch<React.SetStateAction<Coordinates>>
    areaMethodType: AreaMethodTypes
    isGameStart: boolean
    setGameStart: React.Dispatch<React.SetStateAction<boolean>>
    randomGameType: GameTypes
}
export default function MapBase({ 
    map, 
    setMap, 
    selectedArea,
    setSelectedArea,
    areaMethodType,
    isGameStart,
    setGameStart,
    randomGameType,
}: IMapBase) {
    const mapRef = useRef<HTMLElement>(null)
    const [center, setCenter] = useState(initialCenter)
    const [address, setAddress] = useState("대한민국 서울특별시")
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult>(null)

    // 직접 선택 다각형 만들기
    const [drawPaths, setDrawPaths] = useState<Coordinates>([])
    const [isPolygonEnd, setPolygonEnd] = useState<boolean>(false)
    const isDrawPath = areaMethodType === AreaMethodTypes.AREA && selectedArea.length === 0 && !isPolygonEnd

    // 랜덤픽
    const [isRandomPickStart, setRandomPickStart] = useState<boolean>(false)
    const [randomPickCoords, setRandomPickCoords] = useState<Coordinates>([])
    const randomPickCoordRef = useRef<Coordinates>([])

    // 결과픽
    const [resultCoord, setResultCoord] = useState<Coordinate | null>(null)


    useEffect(() => {
        setDrawPaths([])
        setPolygonEnd(false)

        // 게임별 설정
        setRandomPickStart(false)
    }, [areaMethodType, selectedArea])

    useEffect(() => {
        if (selectedArea.length === 0 || areaMethodType !== AreaMethodTypes.LOCATION) {
            return
        }

        moveSelectedArea()
    }, [selectedArea])

    // 게임 시작 감지
    useEffect(() => {
        setResultCoord(null)
        if (randomGameType === GameTypes.RANDOM) {
            if (isGameStart && selectedArea.length > 0) {
                startRandomPick()
            } else {
                setRandomPickStart(false)
                setGameStart(false)
            }
        }
    }, [isGameStart, randomGameType])

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY as string,
        language: 'ko',
        libraries: ['places',],
    })
  
    const onLoad = useCallback(function callback(map: google.maps.Map) {
        setMap(map)
    }, [])
  
    const onUnmount = useCallback(function callback(map) {
        setMap(null)
    }, [])
 
    // region 지도 관련 함수
    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        // 다각형 그리기
        if (isDrawPath) {
            const _drawPaths = [...drawPaths, { lat: e.latLng.lat(), lng: e.latLng.lng() }]
            setDrawPaths(_drawPaths)

            if (_drawPaths.length > 2) {
                const lastPath = _drawPaths[_drawPaths.length - 1]
                const firstPath = _drawPaths[0]

                if (MapUtils.isEqualCoordinate(lastPath, firstPath, map.getZoom())) {
                    setPolygonEnd(true)
                    setSelectedArea(drawPaths)
                }
            }
        }
    }
    const handleDrawEnd = () => {
        if (drawPaths.length <= 2) {
            return
        }

        setSelectedArea([...drawPaths, drawPaths[0]])
        setPolygonEnd(true)
    }

    // 지도 드래그 후 좌표 가져오기
    const handleDragEnd = () => {
        const newCenter = map.center // 지도 중심 좌표 가져오기
        const lat = newCenter.lat()
        const lng = newCenter.lng()
        setCenter({ lat, lng })
        getGeocode(lat, lng) // 위치 정보 가져오기
    }

    // 좌표로부터 위치 정보(주소) 가져오기
    const getGeocode = async (lat, lng) => {
        const _address = await MapUtils.getMapAddress(lat, lng)
        setAddress(_address)
    }

    const moveSelectedArea = () => {
        const bounds = new google.maps.LatLngBounds()
        selectedArea.forEach((coord) => {
            bounds.extend(coord)
        })
        map.fitBounds(bounds, 300)

        const boundCenter = bounds.getCenter()
        getGeocode(boundCenter.lat(), boundCenter.lng())
    }
    // endregion

    // region 게임 관련 함수
    const startRandomPick = async () => {
        setRandomPickStart(true)
        setRandomPickCoords([])
        randomPickCoordRef.current = []
        setResultCoord(null)
        
        const count = 100
        const initialDelay = 10
        const finalDelay = 2000

        for (let i=0; i<count; i++) {
            const randomCoord: Coordinate = MapUtils.getRandomCoordinate(selectedArea)
            // console.log(randomPickCoordRef.current)
            const newRandomPickCoords = [...randomPickCoordRef.current, randomCoord]
            randomPickCoordRef.current = newRandomPickCoords
            setRandomPickCoords(newRandomPickCoords)
            
            const delay = GameUtils.getRandomPickDelay(i, count)
            await CommonUtils.delay(delay)
        }

        setResultCoord(MapUtils.getRandomCoordinate(selectedArea))
        setGameStart(false)
    }
    // endregion

    const handleResultClick = () => {
        const bounds = new google.maps.LatLngBounds()
        bounds.extend(resultCoord)
        map.fitBounds(bounds, 30000)

        const boundCenter = bounds.getCenter()
        getGeocode(boundCenter.lat(), boundCenter.lng())
    }

    if (!isLoaded) {
        return (
            <MS.Layout>
            </MS.Layout>
        )
    }

    const initialOptions: google.maps.MapOptions = {
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.LEFT_BOTTOM,
        },
    }

    return (
        <MS.Layout>
            <MapPlace
                address={address}
            />
            <GoogleMap
                id="map"
                ref={mapRef}
                mapContainerStyle={{
                    width: "100%",
                    height: "100%",
                    outline: "none"
                }}
                options={initialOptions}
                center={center}
                zoom={initialZoom}
                onClick={handleMapClick}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onDragEnd={handleDragEnd}
            >
                {/* Child components, such as markers, info windows, etc. */}
                {selectedArea.length > 0 && (
                    <Polygon 
                        paths={selectedArea}
                        options={{
                            fillColor: "transparent",
                            strokeColor: "blue",
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillOpacity: 0.35,
                        }}
                    />
                )}

                {isDrawPath && (
                    <Polygon 
                        paths={drawPaths}
                        options={{
                            fillColor: "transparent",
                            strokeColor: "#b91c1c",
                            strokeOpacity: 0.8,
                            strokeWeight: 4,
                            fillOpacity: 0.35,
                        }}
                    />
                )}
                {drawPaths.length >= 1 && (
                    <Marker
                        position={drawPaths[0]}
                        title="현재 위치"
                        onClick={() => {handleDrawEnd()}}
                    />
                )}

                {/* 랜덤픽 게임 실행 중 */}
                {isRandomPickStart && randomPickCoords.length > 0 && (
                    <>
                        {randomPickCoords.map((coord, idx) => (
                            <OverlayView
                                position={coord}
                                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                getPixelPositionOffset={(width, height) => ({
                                    x: -(width / 2),
                                    y: -height,
                                })}
                            >
                                <div className="random-pick-marker">
                                    <div className="rain"></div>
                                    <div className="drop"></div>
                                </div>
                            </OverlayView>
                        ))}
                    </>
                )}
                {resultCoord && (
                    <OverlayView
                        position={resultCoord}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        getPixelPositionOffset={(width, height) => ({
                            x: -(width / 2),
                            y: -height,
                        })}
                        onClick={() => {handleResultClick()}}
                    >
                        <MarkerResult 
                            position={resultCoord}
                        />
                    </OverlayView>
                )}
            </GoogleMap>
        </MS.Layout>
    )
}