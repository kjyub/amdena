import CommonUtils from "@/utils/CommonUtils"
import React, { Dispatch, SetStateAction } from "react"
import tw from "tailwind-styled-components"
import Modal from "react-modal"
import Image from "next/image"
import iconClose from "@/static/icons/Close.svg"

const Background = tw.div`
    flex flex-center w-full h-full
`

export interface IModalContainer {
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
    isBlur: boolean
    isCloseByBackground: boolean
    children: React.ReactNode
}
const ModalContainer = ({
    isOpen,
    setIsOpen,
    isBlur = false,
    isCloseByBackground = true,
    isCloseButtonShow = true,
    children,
}: IModalContainer) => {
    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation()
        if (isCloseByBackground) {
            setIsOpen(false)
        }
    }

    const handleStopPropagation = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation()
    }

    return (
        // <></>
        <Modal
            isOpen={isOpen}
            ariaHideApp={false}
            onRequestClose={() => {
                setIsOpen(false)
            }}
            style={{ overlay: { backgroundColor: "transparent", zIndex: 500 } }}
            className={`flex flex-center w-screen h-screen bg-black/20 outline-none ${
                isBlur && "backdrop-blur-sm"
            }`}
        >
            <Background onClick={handleClick}>
                {/* {!CommonUtils.isNullOrUndefined(children) && children} */}
                <div
                    className="relative flex flex-center"
                    onClick={handleStopPropagation}
                >
                    {(!isCloseByBackground || isCloseButtonShow) && (
                        <Image
                            className="absolute top-5 right-5 cursor-pointer"
                            src={iconClose}
                            alt="닫기"
                            onClick={() => setIsOpen(false)}
                        />
                    )}
                    {!CommonUtils.isNullOrUndefined(children) && children}
                </div>
            </Background>
        </Modal>
    )
}

export default ModalContainer
