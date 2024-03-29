/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Suspense, StrictMode, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';
import { Provider, useDispatch } from 'react-redux';
import { combineReducers, createStore, StoreEnhancer } from 'redux';
import throttle from 'lodash.throttle';
import { I18nextProvider } from 'react-i18next';
// import { setupCognito, cognito } from 'react-cognito';
import { Icon, Marker, LatLngTuple } from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import mappingReducer from './reducers/reducer';
import { loadState, saveState } from './reducers/localStorage';
import i18n from './assets/i18n/i18n';

import { getQueryParams } from './common/queryparams';
import Header from './components/header/header';
import { Map } from './components/map/map';
// import KeywordSearch from './components/search/keywordsearch';
import MetaDataPage from './components/search/metadatapage';
import RampViewer from './components/rampviewer/rampviewer';
import CgpModal from './components/modal/cgpmodal';
import SamplePageRequiringSignIn from './components/signin/sample-page-requiring-sign-in';

import '../node_modules/leaflet/dist/leaflet.css';
import './assets/css/style.scss';
import { setSpatialData, setStacData } from './reducers/action';

// import authconfig from './components/account/cognito-auth/config.json';

const persistedState: StoreEnhancer<unknown, unknown> | undefined = loadState();
const reducers = combineReducers({
    // cognito,
    mappingReducer,
});
// const store = createStore(reducers);
const store = createStore(reducers, persistedState);
// config.group = 'admins'; // Uncomment this to require users to be in a group 'admins'
// setupCognito(store, authconfig);

store.subscribe(throttle(() => saveState(store.getState()), 1000));

// hack for default leaflet icon: https://github.com/Leaflet/Leaflet/issues/4968
// TODO: put somewhere else
const DefaultIcon = new Icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
});
Marker.prototype.options.icon = DefaultIcon;
// const maps: Element[] = [...document.getElementsByClassName('llwb-map')];
const mainMap: Element | null = document.getElementById('root');
const jsonConfig = mainMap && mainMap.getAttribute('data-leaflet');
const config = jsonConfig
    ? JSON.parse(jsonConfig.replace(/'/g, '"'))
    : { name: 'Web Mercator', projection: 3857, zoom: 4, center: [60, -100], language: 'en', search: true, auth: true };
// const center: LatLngTuple = [config.center[0], config.center[1]];
const queryParams: { [key: string]: string } = getQueryParams(window.location.href.substr(window.location.href.indexOf('?')));

// console.log(process.env.NODE_ENV);

const RenderMap: React.FunctionComponent = () => {
    const center: LatLngTuple = [config.center[0], config.center[1]];
    const dispatch = useDispatch();
    /*
    useEffect(() => {        
        axios
            .get('http://localhost:3000/spatial-view')
            .then((result) => {
                //console.log(result);
                const spatialData: SpatialData = {
                    viewableOnTheMap: result.data.viewableOnTheMap,
                    notViewableOnTheMap: result.data.notViewableOnTheMap,
                };
                dispatch(setSpatialData(spatialData));
            })
            .catch((e) => {
                console.log(e);
                dispatch(setSpatialData({ viewableOnTheMap: 0, notViewableOnTheMap: 0 }));
            });
    }, []);
    axios
        .get('http://localhost:3000/metadata-standard')
        .then((result) => {
            //console.log(result);
            const stacData: StacData = {
                hnap: result.data.hnap,
                stac: result.data.stac,
            };
            dispatch(setStacData(stacData));
        })
        .catch((e) => {
            console.log(e);
            dispatch(setStacData({ hnap: 0, stac: 0 }));
        });
        */
    return (
        <Suspense fallback="loading">
            <div className="mapPage">
                <CgpModal
                    className="cgp-modal-dialog"
                    wrapClassName="cgp-modal-wrap"
                    modalClassName="cgp-modal"
                    openOnLoad
                    center
                    unmountOnClose
                />
                <div className="mapContainer">
                    <Map id="MainMap" language={i18n.language} layers={config.layers} search={config.search} auth={config.auth} />
                </div>
            </div>
        </Suspense>
    );
};

const Routing = () => {
    const language = queryParams.lang !== undefined ? queryParams.lang : i18n.language.substring(0, 2);
    if (language !== i18n.language.substring(0, 2)) {
        i18n.changeLanguage(`${language}-CA`);
    }

    return (
        <Router>
            {/* <StrictMode> */}
            <Header />
            <Switch>
                <Route exact path="/" component={RenderMap} />
                {/* <Route exact path="/search" component={KeywordSearch} /> */}
                <Route exact path="/result/:pathlang/:title" component={MetaDataPage} />
                <Route exact path="/map" component={RampViewer} />
                <Route exact path="/result" component={MetaDataPage} />
                <Route path='/404' component={() => {
                    window.location.href = 'https://geo.ca/404.html';
                    return null;
                }} />
                <Redirect to="/404" />
            </Switch>
            {/* </StrictMode> */}
        </Router>
    );
};

ReactDOM.render(
    <Provider store={store}>
        <I18nextProvider i18n={i18n}>
            <Routing />
        </I18nextProvider>
    </Provider>,
    document.getElementById('root')
);

// loop trought all the maps and create an app for it.
/* const maps: Element[] = [...document.getElementsByClassName('llwb-map')];
[...maps].forEach((map: Element) => {
    // get the inline configuration
    // TODO: get config from CGP API, script mapping API and inline HTML
    // expression is not null or undefined, use the non-null assertion operator ! to coerce away those types
    const config = JSON.parse(map.getAttribute('data-leaflet')!.replace(/'/g, '"'));

    const i18nInstance = i18n.cloneInstance({
        lng: config.language,
        fallbackLng: config.language,
    });
    createMap(map, config, i18nInstance);
}); */
export interface SpatialData {
    viewableOnTheMap: number;
    notViewableOnTheMap: number;
}
export interface StacData {
    hnap: number;
    stac: number;
}
