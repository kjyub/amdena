import { StyleProps } from "@/types/StyleTypes"
import tw from "tailwind-styled-components"

export const Layout = tw.div`
    absolute left-0 top-0 z-0
    w-full h-full
    bg-sky-300
`

export const MapInfoBox = tw.div`
    absolute left-4 top-4 z-10
    flex flex-col items-start max-phablet:w-[calc(100%-2rem)] phablet:w-96 p-3 space-y-2
    rounded-xl bg-sand-100/60 backdrop-blur
    border border-sand-300
`
export const AddressMain = tw.span`
    text-xl text-sand-800 font-semibold
`
