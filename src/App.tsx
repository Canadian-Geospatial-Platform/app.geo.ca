import React from 'react';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import { combineReducers, createStore, StoreEnhancer } from 'redux';
import { loadState, saveState } from './reducers/localStorage';
import mappingReducer from './reducers/reducer';
import throttle from 'lodash.throttle';
import { I18nextProvider } from 'react-i18next';
import i18n from './assets/i18n/i18n';
import { getQueryParams } from './common/queryparams';

import Header from './components/header/header';
import MetaDataPage from './components/search/metadatapage';
import RampViewer from './components/rampviewer/rampviewer';
import CgpModal from './components/modal/cgpmodal';

// start map imports
import { Map } from './components/map/map';
import '../node_modules/leaflet/dist/leaflet.css';
// import mapConfig from './components/rampviewer/canada-world-config.json';

// end map imports 
import './assets/css/style.scss';

// start store configuration
const persistedState: StoreEnhancer<unknown, unknown> | undefined = loadState();
const reducers = combineReducers({
    mappingReducer,
});
const store = createStore(reducers, persistedState);
store.subscribe(throttle(() => saveState(store.getState()), 1000));
// end store configuration
// start rendermap
const mapConfig = {
    center: [51.505, -0.09],
    zoom: 13
    }
const RenderMap: React.FunctionComponent = () => new Map(mapConfig)


// const RenderMap: React.FunctionComponent = () => {
//     const center: LatLngTuple = [config.center[0], config.center[1]];
//     return (
//         <Suspense fallback="loading">
//             <div className="mapPage">
//                 <CgpModal
//                     className="cgp-modal-dialog"
//                     wrapClassName="cgp-modal-wrap"
//                     modalClassName="cgp-modal"
//                     openOnLoad
//                     center
//                     unmountOnClose
//                 />
//                 <div className="mapContainer">
//                     <Map
//                         id="MainMap"
//                         center={center}
//                         zoom={config.zoom}
//                         projection={config.projection}
//                         language={i18n.language}
//                         layers={config.layers}
//                         search={config.search}
//                         auth={config.auth}
//                     />
//                 </div>
//             </div>
//         </Suspense>
//     );
// };
// end rendermap

// start routing configuration
const Routing = () => {
    const language = getQueryParams.lang!==undefined ? getQueryParams.lang : i18n.language.substring(0, 2);
    if (language !== i18n.language.substring(0, 2)) {
        i18n.changeLanguage(`${language}-CA`);
    }

    return (
        <Router>
            {/* <StrictMode> */}
                <Header />
                <Routes>

                    <Route exact path="/" element={<RenderMap />} />
                    <Route exact path="/result" element={<MetaDataPage />} />
                    <Route exact path="/map" element={<RampViewer />} />
                    <Route path="/404" render={() => <div>404 - Not Found</div>} />
                </Routes>
            {/* </StrictMode> */}
        </Router>
    );
};
                    // <Navigate to="/404" />
// end routing configuration
store.subscribe(throttle(() => saveState(store.getState()), 1000));
function App() {
  return (
    <Provider store={store}>
        <I18nextProvider i18n={i18n}>
            <Routing />
        </I18nextProvider>
    </Provider>
  );
}

export default App;
