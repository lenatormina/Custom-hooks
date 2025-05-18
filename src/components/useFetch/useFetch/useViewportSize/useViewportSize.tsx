import { useState } from "react"
import { useWindowEvent } from './useWindowEvent'

interface ViewportSize {
    width: number
    height: number
}

export function useViewportSize(): ViewportSize {
    const [size, setSize] = useState<ViewportSize>({
        width: typeof window === "object" ? window.innerWidth : 0,
        height: typeof window === "object" ? window.innerHeight : 0,
    })

    useWindowEvent('resize', () => {
        setSize({
            width: window.innerWidth,
            height: window.innerHeight
        })
    })

    return size
} 