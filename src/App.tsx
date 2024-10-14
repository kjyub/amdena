import { useState } from 'react'
import './App.css'

function App() {
    // useEffect(() => {
    //     const script = document.createElement('script')
    //     script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap`
    //     script.async = true
    //     document.head.appendChild(script)
    
    //     // 전역 함수로 initMap을 선언해야 합니다.
    //     (window as any).initMap = () => {
    //         const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
    //         center: { lat: 37.5665, lng: 126.9780 }, // 서울 좌표
    //         zoom: 10,
    //         })
    //     }
    
    //     return () => {
    //         // 컴포넌트 언마운트 시 스크립트 및 전역 함수 제거
    //         document.head.removeChild(script)
    //         delete (window as any).initMap
    //     }
    // }, [])

    return (
        <>
            <span>hi</span>
            <div id="map" style={{ width: '100%', height: '500px' }}></div>
        </>
    )
}

export default App
