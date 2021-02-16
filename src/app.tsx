import React, { Suspense, StrictMode } from 'react';
import ReactDOM from 'react-dom';
import {useLocation} from 'react-router';
import {Route, HashRouter, BrowserRouter as Router, Switch, Redirect} from 'react-router-dom';
import { Provider } from 'react-redux';
//import BeatLoader from "react-spinners/BeatLoader";

import { I18nextProvider } from 'react-i18next';
import i18n from './assests/i18n/i18n';

import { StateProvider } from "./globalstate/state";

// Leaflet icons import to solve issues 4968
import { Icon, Marker, LatLngTuple, CRS } from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import Header from './components/header/header';
import { Map } from './components/map/map';
import KeywordSearch from './components/search/keywordsearch';
import MetaDataPage from './components/search/metadatapage';

import '../node_modules/leaflet/dist/leaflet.css';
import './assests/css/style.scss';

import { setupCognito, cognito } from 'react-cognito';
import { combineReducers, createStore } from 'redux';
import authconfig from './components/account/cognito-auth/config.json';

const reducers = combineReducers({
    cognito,
});

//const store = createStore(reducers);
const store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
//config.group = 'admins'; // Uncomment this to require users to be in a group 'admins'
setupCognito(store, authconfig);

// hack for default leaflet icon: https://github.com/Leaflet/Leaflet/issues/4968
// TODO: put somewhere else
const DefaultIcon = new Icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
});
Marker.prototype.options.icon = DefaultIcon;
//const maps: Element[] = [...document.getElementsByClassName('llwb-map')];
 
const config = JSON.parse(document.getElementById('root').getAttribute('data-leaflet')!.replace(/'/g, '"'));

//const center: LatLngTuple = [config.center[0], config.center[1]];

const renderMap:React.FunctionComponent = () => {
    const center: LatLngTuple = [config.center[0], config.center[1]];
    return (
        <Suspense fallback="loading">
            <div className="mapContainer">
                <Map
                    id="MainMap"
                    center={center}
                    zoom={config.zoom}
                    projection={config.projection}
                    language={config.language+'-CA'}
                    layers={config.layers}
                    search={config.search}
                    auth={config.auth}
                />
            </div>
        </Suspense>
    );
}

const Routing = () => {
    let language = config.language;
    
    if (language !== i18n.language.substring(0,2)) {
        i18n.changeLanguage(language+'-CA');
    }

    return (
        <HashRouter>
            <StrictMode>
                <Header />
                <Switch>
                    <Route exact path="/" component={renderMap} />
                    <Route exact path="/search" component={KeywordSearch} />
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
    <StateProvider>
        <I18nextProvider i18n={i18n}>
            <Routing />
        </I18nextProvider>
    </StateProvider>
    </Provider>, 
    document.getElementById('root'));

// loop trought all the maps and create an app for it.
/*const maps: Element[] = [...document.getElementsByClassName('llwb-map')];
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
});*/
