import * as MS from "@/styles/MapStyles"
import CommonUtils from "@/utils/CommonUtils"
import {Status, Wrapper} from "@googlemaps/react-wrapper"
import { useCallback, useEffect, useRef, useState } from "react"
// import GoogleMap from "./GoogleMap"
import { GoogleMap, useJsApiLoader, Autocomplete, Polygon, Marker } from '@react-google-maps/api'
import { Client } from "@googlemaps/google-maps-services-js";
import axios from "axios"
import { debounce } from "lodash"

import "@/styles/map.css"
import MapPlace from "./MapPlace"
import { Coordinates } from "@/types/game/Coordinates"
import { AreaMethodTypes } from "@/types/ControlTypes"
import MapUtils from "@/utils/MapUtils"

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
}
export default function MapBase({ 
    map, 
    setMap, 
    selectedArea,
    setSelectedArea,
    areaMethodType,
}: IMapBase) {
    const client = new Client({})
    const [center, setCenter] = useState(initialCenter)
    const [address, setAddress] = useState("대한민국 서울특별시")
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult>(null)

    // 직접 선택 다각형 만들기
    const [drawPaths, setDrawPaths] = useState<Coordinates>([])
    const [isPolygonEnd, setPolygonEnd] = useState<boolean>(false)
    const isDrawPath = areaMethodType === AreaMethodTypes.AREA && selectedArea.length === 0 && !isPolygonEnd

    useEffect(() => {
        setDrawPaths([])
        setPolygonEnd(false)
    }, [areaMethodType, selectedArea])

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

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        // 다각형 그리기
        if (isDrawPath) {
            const _drawPaths = [...drawPaths, { lat: e.latLng.lat(), lng: e.latLng.lng() }]
            console.log(_drawPaths)
            setDrawPaths(_drawPaths)

            if (_drawPaths.length > 2) {
                const lastPath = _drawPaths[_drawPaths.length - 1]
                const firstPath = _drawPaths[0]

                console.log(map.getZoom())
                console.log(firstPath, lastPath)
                
                if (MapUtils.isEqualCoordinate(lastPath, firstPath, map.getZoom())) {
                    console.log("END!")
                    setPolygonEnd(true)
                    setSelectedArea(drawPaths)
                }
            }
        }
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
        // const _address = await MapUtils.getMapAddress(lat, lng)
        // setAddress(_address)
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
                            fillColor: "lightblue",
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
                    />
                )}
            </GoogleMap>
        </MS.Layout>
    )
}