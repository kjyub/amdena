import * as MS from "@/styles/MapStyles"
import CommonUtils from "@/utils/CommonUtils"
import { useCallback, useEffect, useRef, useState } from "react"
import { Autocomplete, useLoadScript } from '@react-google-maps/api'
import axios from "axios"

interface IMapPlace {
    map: google.maps.Map
}
export default function MapPlace({ map, address, setSelectedPlace }: IMapPlace) {

    return (
        <MS.MapInfoBox>
            <MS.AddressMain>
                {address}
            </MS.AddressMain>
        </MS.MapInfoBox>
    )
}