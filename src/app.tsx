import { Routes, Route, BrowserRouter } from "react-router-dom";
import { RenderMap } from "./components/map/render-map";
import { TypeWindow } from "geoview-core-types";
import Header from "./components/header/header";
const w = window as TypeWindow;

export const cgpv = w["cgpv"];
export const App = () => {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<RenderMap />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};
