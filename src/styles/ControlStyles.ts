import { StyleProps } from "@/types/StyleTypes"
import tw from "tailwind-styled-components"

export const Layout = tw.div<StyleProps>`
    absolute z-10
    max-desktop:left-0 
    ${({ $is_show }) => $is_show ? "max-desktop:bottom-0" : "max-desktop:-bottom-48"}
    desktop:right-0 desktop:top-0
    flex flex-col
    max-desktop:w-full max-desktop:h-72
    desktop:w-80 desktop:p-4
    bg-transparent
    duration-300
`

export const Panel = tw.div`
    relative z-0
    flex flex-col p-4 space-y-2
    max-desktop:w-full max-desktop:h-full max-desktop:pb-16
    desktop:w-full
    rounded-xl max-desktop:rounded-b-none
    bg-sand-100/70 backdrop-blur
    border border-sand-300
`

export const ControlExplain = tw.div`
    text-start
    text-sm text-sand-800
    [&>.sub]:text-sand-500
`

export const ControlBox = tw.div`
    flex flex-col w-full space-y-2
`

export const GameControlLayoutDesktop = tw.div`
    flex items-center w-full space-x-2
`
export const GameControlLayoutMobile = tw(GameControlLayoutDesktop)`
    fixed bottom-0 left-0 
    p-4 pt-0
    bg-sand-100/70 backdrop-blur
`
const GameControlButton = tw.button`
    h-10
    rounded-lg
    duration-200
`
export const GameStartButton = tw(GameControlButton)`
    w-full
    bg-amber-200 hover:bg-amber-300 text-amber-700
    disabled:bg-sand-300 disabled:text-sand-700
`
export const GameResetButton = tw(GameControlButton)`
    flex-shrink-0
    w-24
    bg-transparent hover:bg-red-100/50
    border border-red-500/50
    text-red-500
    disabled:bg-sand-300 disabled:text-sand-700
`

export const ToolBox = tw.div`
    flex w-full space-x-2
`
export const ToolBoxButton = tw.button`
    flex flex-center w-full px-2 py-1 space-x-1
    rounded-md
    ${({ $is_active }) => !$is_active ? "bg-transparent desktop:hover:bg-sand-400/30" : "bg-sand-400/20"}
    text-sm text-sand-600
    duration-200
`

export const AreaMethodBox = tw.div`
    grid grid-cols-2 gap-1 w-full max-desktop:h-7 desktop:h-8
`
export const AreaMethodButton = tw.button<StyleProps>`
    flex justify-center items-center w-full space-x-1
    rounded-lg
    ${({ $is_active }) => $is_active ? "bg-red-200" : "hover:bg-red-100"}
    text-red-700 max-desktop:text-sm
    duration-200
    select-none

    [&>i]:text-sm
`

export const GameSelectList = tw.div`
    flex flex-wrap w-full space-x-4
`
export const GameButton = tw.button`
    flex flex-col flex-center w-24 py-4 space-y-2

    [&>.icon]:flex [&>.icon]:justify-center [&>.icon]:items-center
    [&>.icon]:w-12 [&>.icon]:aspect-square
    [&>.icon]:rounded-2xl [&>.icon]:overflow-hidden
    [&>.icon]:duration-500
    
    [&>.title]:text-yellow-600
`

export const AreaMethodDetailContainer = tw.div`
    flex flex-col w-full space-y-2
`

export const PlaceSearchInput = tw.input`
    w-full px-4 py-2
    rounded-full bg-sand-50/50
    text-sm text-snad-800
    outline-none
`
export const PlaceSearchResult = tw.div<StyleProps>`
    absolute top-10 left-0 translate-z-0
    ${({ $is_show }) => $is_show ? "z-20 translate-y-0 opacity-100" : "-z-10 -translate-y-4 opacity-0"}
    flex flex-col w-full max-h-[384px] p-2 space-y-1
    rounded-xl bg-sand-100
    overflow-y-auto scroll-transparent scroll-overlay
    duration-300

    [&>button]:flex [&>button]:items-center [&>button]:w-full [&>button]:px-3 [&>button]:py-2
    [&>button]:rounded-full hover:[&>button]:bg-sand-200
    [&>button]:text-sand-700 [&>button]:text-sm [&>button]:text-left
    [&>button]:duration-200
`

export const ResultBox = tw.div`
    absolute z-50 bottom-12 -left-32
    flex flex-row justify-between items-start w-72 px-2 py-1
    rounded-lg bg-sand-100/70 backdrop-blur

    [&>.value]:text-sm [&>.value]:text-sand-700 [&>.value]:font-medium
    [&>.value]:text-left [&>.value]:p-1
    [&>.control]:flex [&>.control]:flex-shrink-0 [&>.control]:flex-col [&>.control]:justify-end [&>.control]:items-center
    [&>.control>.more]:ml-auto [&>.control>.more]:px-2 [&>.control>.more]:py-1
    [&>.control>.more]:text-sm [&>.control>.more]:text-sand-600
    [&>.control>.more]:rounded-lg hover:[&>.control>.more]:bg-sand-300/50 [&>.control>.more]:duration-200
`
export const OldResultBox = tw(ResultBox)`
    bg-purple-100/70
    hover:[&>.control>.more]:bg-purple-300/50
`

export const ToggleMobileControl = tw.button`
    absolute z-50 right-4 desktop:hidden
    ${({ $is_show }) => $is_show ? "bottom-[18.4rem]" : "bottom-[7em]"}
    flex flex-center px-4 py-2
    rounded-full bg-sand-100/70 backdrop-blur
    text-sand-800 font-medium
    duration-300
`

export const ResultListLayout = tw.div`
    flex flex-col w-72 max-h-[80vh] p-3 space-y-3
    rounded-2xl bg-sand-100/70 backdrop-blur
    border border-sand-300

    [&>.title]:px-2 [&>.title]:text-lg [&>.title]:text-sand-800 [&>.title]:font-semibold
`
export const ResultListBoxList = tw.div`
    flex flex-col w-full space-y-2
    overflow-y-auto scroll-transparent scroll-overlay

    [&>.item]:flex [&>.item]:flex-col [&>.item]:w-full [&>.item]:px-3 [&>.item]:py-2
    [&>.item]:rounded-xl hover:[&>.item]:bg-stone-300/50
    [&>.item]:cursor-pointer

    [&>.item>.address]:text-base [&>.item>.address]:text-sand-800 [&>.item>.address]:font-medium
    [&>.item>.created]:text-sm [&>.item>.created]:text-sand-600
`