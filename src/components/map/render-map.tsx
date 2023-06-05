import { Map } from "./map";

export function RenderMap(): JSX.Element {
  return (
    <div className="mapPage">
      <div className="mapContainer">
        <Map />
      </div>
    </div>
  );
}
