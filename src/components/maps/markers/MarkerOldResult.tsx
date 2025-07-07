import * as CS from "@/styles/ControlStyles";
import { CopyToClipboard } from "react-copy-to-clipboard";
import type GameResult from "@/types/game/GameResult";

interface IMarkerOldResult {
  result: GameResult;
  onClick: () => void;
}
export default function MarkerOldResult({ result, onClick }: IMarkerOldResult) {
  return (
    <div className="relative w-8 h-8">
      <div
        className="absolute w-6 h-6 bg-purple-500 rounded-full animate-ping"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      ></div>
      <CS.OldResultBox className="hidden">
        <span className="value">{result.address}</span>
        <div className="control">
          <CopyToClipboard text={result.address}>
            <button className="more">복사</button>
          </CopyToClipboard>
        </div>
      </CS.OldResultBox>
    </div>
  );
}
