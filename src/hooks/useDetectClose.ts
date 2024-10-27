import react, { useState, useEffect, useRef } from "react"

export const useDetectClose = (): [
    React.MutableRefObject<HTMLElement | null>,
    boolean,
] => {
    const ref = useRef<HTMLElement | null>(null)

    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const pageClickEvent = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(!isOpen)
            }
        }

        if (isOpen) {
            window.addEventListener("click", pageClickEvent)
        }

        return () => {
            window.removeEventListener("click", pageClickEvent)
        }
    }, [isOpen, ref])

    return [ref, isOpen, setIsOpen]
}
