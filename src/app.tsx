import { Routes, Route, BrowserRouter } from "react-router-dom";
import { RenderMap } from "./components/map/render-map";

export const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RenderMap />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};
