import { Suspense } from "react";
import { Map2 } from "./components/map/map2";

export function RenderMap(): JSX.Element {
  return (
    <Suspense fallback="loading">
      <div className="mapPage">
        <div className="mapContainer">
          <Map2 />
        </div>
      </div>
    </Suspense>
  );
}
