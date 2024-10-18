import * as MS from "@/styles/MapStyles"
import * as CS from "@/styles/ControlStyles"
import CommonUtils from "@/utils/CommonUtils"
import { useCallback, useEffect, useRef, useState } from "react"
import { Autocomplete, useLoadScript } from '@react-google-maps/api'
import axios from "axios"
import { Coordinates } from "@/types/game/Coordinates"

interface IControlAreaSearch {
    map: google.maps.Map
    setSelectedArea: React.Dispatch<React.SetStateAction<Coordinates>>
}
export default function ControlAreaSearch({ map, address, setSelectedArea }: IControlAreaSearch) {
    const [isPlaceResultShow, setPlaceResultShow] = useState<boolean>(false)
    const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([])
    const [searchValue, setSearchValue] = useState<string>("")

    const autocompleteRef = useRef<Autocomplete>(null)
    const autocompleteService = useRef<google.maps.places.AutocompleteService>(null)

    const placesService = useRef(null)

    useEffect(() => {
        autocompleteService.current = google.maps.places.AutocompleteService()
    }, [])

    useEffect(() => {
        if (searchValue === "") {
            setPredictions([])
        }
    }, [searchValue])

    const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchValue(value)

        if (!autocompleteService.current && window.google) {
            autocompleteService.current = new window.google.maps.places.AutocompleteService()
        }

        if (CommonUtils.isStringNullOrEmpty(value)) {
            return
        }

        autocompleteService.current.getPlacePredictions({ input: value }, (predictions, status) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
                return
            }  

            setPredictions(predictions)
        })
    }

    const handlePlaceSelect = (placeId) => {
        if (!placesService.current && window.google) {
            placesService.current = new window.google.maps.places.PlacesService(map)
        }

        // `placeId`를 사용해 장소의 상세 정보 요청
        placesService.current.getDetails({ placeId }, (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                const area: Coordinates = [
                    { lat: place.geometry.viewport.getNorthEast().lat(), lng: place.geometry.viewport.getNorthEast().lng() },
                    { lat: place.geometry.viewport.getNorthEast().lat(), lng: place.geometry.viewport.getSouthWest().lng() },
                    { lat: place.geometry.viewport.getSouthWest().lat(), lng: place.geometry.viewport.getSouthWest().lng() },
                    { lat: place.geometry.viewport.getSouthWest().lat(), lng: place.geometry.viewport.getNorthEast().lng() },
                ]
                setSelectedArea(area)

                // // 원하는 정보: geometry, location, viewport 등
                // const location = place.geometry.location
                // const viewport = place.geometry.viewport

                // console.log("Selected place location:", location.lat(), location.lng())
                // if (viewport) {
                //     console.log("Viewport bounds:", {
                //         northeast: viewport.getNorthEast().toJSON(),
                //         southwest: viewport.getSouthWest().toJSON(),
                //     })
                // }
            }
        })
    }

    return (
        <CS.AreaMethodDetailContainer>
            <div className="relative w-full">
                <CS.PlaceSearchInput 
                    type="text" 
                    value={searchValue}
                    placeholder="장소를 검색해주세요"
                    onChange={onChangeSearch} 
                    onFocus={() => {setPlaceResultShow(true)}}
                    onBlur={() => {setPlaceResultShow(false)}}
                />

                <CS.PlaceSearchResult $is_show={isPlaceResultShow && predictions.length > 0}>
                    {predictions.map((prediction, index) => (
                        <button key={index} onClick={() => {handlePlaceSelect(prediction.place_id)}}>
                            {prediction.description}
                        </button>
                    ))}
                </CS.PlaceSearchResult>
            </div>
        </CS.AreaMethodDetailContainer>
    )
}