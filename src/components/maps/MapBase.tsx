/* eslint-disable @typescript-eslint/no-unused-vars */

import * as MS from "@/styles/MapStyles";
import * as CS from "@/styles/ControlStyles";
import CommonUtils from "@/utils/CommonUtils";
import { useCallback, useEffect, useRef, useState } from "react";
// import GoogleMap from "./GoogleMap"
import { GoogleMap, useJsApiLoader, Polygon, Marker, OverlayView } from "@react-google-maps/api";

import "@/styles/map.css";
import { Coordinate, Coordinates } from "@/types/game/Coordinates";
import { AreaMethodTypes, GameTypes } from "@/types/ControlTypes";
import MapUtils from "@/utils/MapUtils";
import GameUtils from "@/utils/GameUtils";
import MarkerResult from "./markers/MarkerResult";
import GameResult from "@/types/game/GameResult";
import MarkerOldResult from "./markers/MarkerOldResult";
import ModalContainer from "../ModalContainer";
import dayjs from "dayjs";

const initialZoom = 8;
const boundPadding = 0.1 / 8;

const initialCenter = {
  lat: 37.5665,
  lng: 126.978,
};

interface IMapBase {
  map: google.maps.Map | null;
  setMap: React.Dispatch<React.SetStateAction<google.maps.Map | null>>;
  selectedArea: Coordinates;
  setSelectedArea: React.Dispatch<React.SetStateAction<Coordinates>>;
  areaMethodType: AreaMethodTypes;
  isGameStart: boolean;
  setGameStart: React.Dispatch<React.SetStateAction<boolean>>;
  randomGameType: GameTypes;
  isShowResultMarker: boolean;
  isShowResultList: boolean;
  setShowResultList: React.Dispatch<React.SetStateAction<boolean>>;
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
  isShowResultMarker,
  isShowResultList,
  setShowResultList,
}: IMapBase) {
  const mapRef = useRef<GoogleMap>(null);
  const [center, setCenter] = useState(initialCenter);

  // 직접 선택 다각형 만들기
  const [drawPaths, setDrawPaths] = useState<Coordinates>([]);
  const [isPolygonEnd, setPolygonEnd] = useState<boolean>(false);
  const isDrawPath = areaMethodType === AreaMethodTypes.AREA && selectedArea.length === 0 && !isPolygonEnd;

  // 랜덤픽
  const [isRandomPickStart, setRandomPickStart] = useState<boolean>(false);
  const [randomPickCoords, setRandomPickCoords] = useState<Coordinates>([]);
  const randomPickCoordRef = useRef<Coordinates>([]);

  // 결과픽
  const [resultCoord, setResultCoord] = useState<Coordinate | null>(null);

  // 이전 결과
  const [oldResults, setOldResults] = useState<GameResult[]>([]);

  useEffect(() => {
    if (areaMethodType === AreaMethodTypes.ALL) {
      setDrawPaths([]);
      setPolygonEnd(false);
      setSelectedArea([]);
    }
  }, [areaMethodType]);

  useEffect(() => {
    setDrawPaths([]);
    setPolygonEnd(false);

    // 게임별 설정
    setRandomPickStart(false);

    // 영역 선택 방법이 초기 상태가 된 경우
    if (areaMethodType === AreaMethodTypes.ALL) {
      setResultCoord(null);
    }
  }, [areaMethodType, selectedArea]);

  useEffect(() => {
    if (selectedArea.length === 0 || areaMethodType !== AreaMethodTypes.LOCATION) {
      return;
    }

    moveSelectedArea();
  }, [selectedArea]);

  // 게임 시작 감지
  useEffect(() => {
    if (randomGameType === GameTypes.RANDOM) {
      if (isGameStart && selectedArea.length > 0) {
        void startRandomPick();
      } else {
        setRandomPickStart(false);
        setGameStart(false);
      }
    }
  }, [isGameStart, randomGameType]);

  useEffect(() => {
    if (isShowResultMarker || isShowResultList) {
      const _oldResults = GameUtils.getResults();
      setOldResults(_oldResults);
    }
  }, [isShowResultMarker, isShowResultList]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY as string,
    language: "ko",
    libraries: ["places"],
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // region 지도 관련 함수
  // 다각형 그리기
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (isDrawPath && e.latLng && map) {
      console.log(drawPaths)
      const drawCoord = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      const _drawPaths = [...drawPaths, drawCoord];
      setDrawPaths(_drawPaths);

      if (_drawPaths.length > 2) {
        const lastPath = _drawPaths[_drawPaths.length - 1];
        const firstPath = _drawPaths[0];

        console.log(lastPath, firstPath, map.getZoom(), MapUtils.isEqualCoordinate(lastPath, firstPath, map.getZoom()))
        if (MapUtils.isEqualCoordinate(lastPath, firstPath, map.getZoom())) {
          setPolygonEnd(true);
          setSelectedArea(drawPaths);
        }
      }
    }
  };
  const handleDrawEnd = () => {
    if (drawPaths.length <= 2) {
      return;
    }

    setSelectedArea([...drawPaths, drawPaths[0]]);
    setPolygonEnd(true);
  };

  // 지도 드래그 후 좌표 가져오기
  const handleDragEnd = () => {
    if (!map) return;

    const newCenter = map.getCenter(); // 지도 중심 좌표 가져오기
    if (!newCenter) return;

    const lat = newCenter.lat();
    const lng = newCenter.lng();
    setCenter({ lat, lng });
    void getGeocode(lat, lng); // 위치 정보 가져오기
  };

  // 좌표로부터 위치 정보(주소) 가져오기
  const getGeocode = async (lat: number, lng: number) => {
    // const _address = await MapUtils.getMapAddress(lat, lng)
    // setAddress(_address)
  };

  const moveSelectedArea = () => {
    if (!map) return;

    const bounds = new google.maps.LatLngBounds();
    selectedArea.forEach((coord) => {
      bounds.extend(coord);
    });
    map.fitBounds(bounds, 0.1);

    const boundCenter = bounds.getCenter();
    void getGeocode(boundCenter.lat(), boundCenter.lng());
  };
  // endregion

  // region 게임 관련 함수
  const startRandomPick = async () => {
    setRandomPickStart(true);
    setRandomPickCoords([]);
    randomPickCoordRef.current = [];
    setResultCoord(null);

    const count = 100;
    // const initialDelay = 10;
    // const finalDelay = 2000;

    for (let i = 0; i < count; i++) {
      const randomCoord: Coordinate = MapUtils.getRandomCoordinate(selectedArea);
      const newRandomPickCoords = [...randomPickCoordRef.current, randomCoord];
      randomPickCoordRef.current = newRandomPickCoords;
      setRandomPickCoords(newRandomPickCoords);

      const delay = GameUtils.getRandomPickDelay(i, count);
      await CommonUtils.delay(delay);
    }

    const _resultCoord = MapUtils.getRandomCoordinate(selectedArea);
    const _resultAddress = await MapUtils.getMapAddress(_resultCoord.lat, _resultCoord.lng);
    const _result = new GameResult(_resultCoord, _resultAddress);
    setResultCoord(_resultCoord);
    setGameStart(false);
    GameUtils.saveResult(_result);
  };
  // endregion

  const handleMarkerMove = (coord: Coordinate) => {
    if (!map) return;

    const bounds = new google.maps.LatLngBounds();
    bounds.extend({ lat: coord.lat + boundPadding, lng: coord.lng + boundPadding });
    bounds.extend({ lat: coord.lat + boundPadding, lng: coord.lng - boundPadding });
    bounds.extend({ lat: coord.lat - boundPadding, lng: coord.lng + boundPadding });
    bounds.extend({ lat: coord.lat - boundPadding, lng: coord.lng - boundPadding });
    map.fitBounds(bounds);

    const boundCenter = bounds.getCenter();
    void getGeocode(boundCenter.lat(), boundCenter.lng());
  };

  const handleAreaClick = () => {
    if (!map) return;

    const bounds = new google.maps.LatLngBounds();
    for (const coord of selectedArea) {
      bounds.extend(coord);
    }
    map.fitBounds(bounds);

    const boundCenter = bounds.getCenter();
    void getGeocode(boundCenter.lat(), boundCenter.lng());
  };

  if (!isLoaded) {
    return <MS.Layout></MS.Layout>;
  }

  const initialOptions: google.maps.MapOptions = {
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.LEFT_BOTTOM,
    },
    gestureHandling: "greedy",
  };

  return (
    <MS.Layout>
      {/* <MapPlace
                address={address}
            /> */}
      <GoogleMap
        id="map"
        ref={mapRef}
        mapContainerStyle={{
          width: "100%",
          height: "100%",
          outline: "none",
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
              fillColor: `rgba(0, 0, 255, ${!resultCoord ? 0.25 : 0})`,
              strokeColor: "blue",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillOpacity: 0.35,
            }}
            onRightClick={handleAreaClick}
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
            onClick={handleMapClick}
          />
        )}
        {drawPaths.length >= 1 && <Marker position={drawPaths[0]} title="현재 위치" onClick={handleDrawEnd} />}

        {/* 랜덤픽 게임 실행 중 */}
        {isRandomPickStart && randomPickCoords.length > 0 && (
          <>
            {randomPickCoords.map((coord) => (
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
          >
            <MarkerResult
              position={resultCoord}
              onClick={() => {
                handleMarkerMove(resultCoord);
              }}
            />
          </OverlayView>
        )}

        {isShowResultMarker &&
          oldResults.map((result) => (
            <OverlayView
              position={result.coord}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              getPixelPositionOffset={(width, height) => ({
                x: -(width / 2),
                y: -height,
              })}
            >
              <MarkerOldResult
                result={result}
                onClick={() => {
                  handleMarkerMove(result.coord);
                }}
              />
            </OverlayView>
          ))}
      </GoogleMap>

      <ModalContainer isOpen={isShowResultList} setIsOpen={setShowResultList}>
        <CS.ResultListLayout>
          <span className="title">이전 결과 목록</span>

          <CS.ResultListBoxList>
            {oldResults.map((result) => (
              <div
                key={result.created.toString()}
                className="item"
                onClick={() => {
                  handleMarkerMove(result.coord);
                }}
              >
                <span className="address">
                  {result.address ? result.address : "-"}
                </span>
                <span className="created">
                  <i className="fa-regular fa-clock mr-1 text-xs"></i>
                  {dayjs(result.created).format("YYYY-MM-DD HH:mm:ss")}
                </span>
              </div>
            ))}
          </CS.ResultListBoxList>
        </CS.ResultListLayout>
      </ModalContainer>
    </MS.Layout>
  );
}
