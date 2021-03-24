/* eslint-disable prettier/prettier */
import React, { Suspense, StrictMode } from 'react';
import ReactDOM from 'react-dom';
import {Route, HashRouter, BrowserRouter as Router, Switch, Redirect} from 'react-router-dom';
import { Provider } from 'react-redux';
import { combineReducers, createStore, StoreEnhancer } from 'redux';
import throttle from 'lodash.throttle';
import { I18nextProvider } from 'react-i18next';
import { setupCognito, cognito } from 'react-cognito';
import { Icon, Marker, LatLngTuple } from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import mappingReducer from './reducers/reducer';
import { loadState, saveState } from './reducers/localStorage';
import i18n from './assests/i18n/i18n';

import Header from './components/header/header';
import { Map } from './components/map/map';
import KeywordSearch from './components/search/keywordsearch';
import RampViewer from './components/rampviewer/rampviewer';
import MetaDataPage from './components/search/metadatapage';

import '../node_modules/leaflet/dist/leaflet.css';
import './assests/css/style.scss';

import authconfig from './components/account/cognito-auth/config.json';

const persistedState:StoreEnhancer<unknown,unknown>|undefined = loadState();
const reducers = combineReducers({
    cognito,
    mappingReducer,
});
// const store = createStore(reducers);
const store = createStore(reducers, persistedState);
// config.group = 'admins'; // Uncomment this to require users to be in a group 'admins'
setupCognito(store, authconfig);

store.subscribe(
    throttle(() => saveState(store.getState()), 1000)
);

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
const config = jsonConfig? JSON.parse(jsonConfig.replace(/'/g, '"')) : { 'name': 'Web Mercator', 'projection': 3857, 'zoom': 4, 'center': [60,-100], 'language': 'en', 'search': true, 'auth': false};

// const center: LatLngTuple = [config.center[0], config.center[1]];

const renderMap: React.FunctionComponent = () => {
    const center: LatLngTuple = [config.center[0], config.center[1]];
    return (
        <Suspense fallback="loading">
            <div className="mapContainer">
                <Map
                    id="MainMap"
                    center={center}
                    zoom={config.zoom}
                    projection={config.projection}
                    language={`${config.language}-CA`}
                    layers={config.layers}
                    search={config.search}
                    auth={config.auth}
                />
            </div>
        </Suspense>
    );
};

const Routing = () => {
    const { language } = config;

    if (language !== i18n.language.substring(0, 2)) {
        i18n.changeLanguage(`${language}-CA`);
    }

    return (
        <HashRouter>
            <StrictMode>
                <Header />
                <Switch>
                    <Route exact path="/" component={renderMap} />
                    <Route exact path="/search" component={KeywordSearch} />
                    <Route exact path="/map" component={RampViewer} />
                    <Route exact path="/result" component={MetaDataPage} />
                    <Route path="/404" render={() => <div>404 - Not Found</div>} />
                    <Redirect to="/404" />
                </Switch>
            </StrictMode>
        </HashRouter>
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
