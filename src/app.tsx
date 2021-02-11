import React, { Suspense, StrictMode } from 'react';
import ReactDOM from 'react-dom';
import {Route, HashRouter, BrowserRouter as Router, Switch, Redirect} from 'react-router-dom';
//import BeatLoader from "react-spinners/BeatLoader";

import { I18nextProvider } from 'react-i18next';
import './assests/i18n/i18n';
import i18n from 'i18next';

import {StateProvider} from './globalstate/state';
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

// hack for default leaflet icon: https://github.com/Leaflet/Leaflet/issues/4968
// TODO: put somewhere else
const DefaultIcon = new Icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
});
Marker.prototype.options.icon = DefaultIcon;
//const maps: Element[] = [...document.getElementsByClassName('llwb-map')];
const config = JSON.parse(document.getElementById('root').getAttribute('data-leaflet')!.replace(/'/g, '"'));
const i18nInstance = i18n.cloneInstance({
    lng: config.language,
    fallbackLng: config.language,
});
//const center: LatLngTuple = [config.center[0], config.center[1]];

const renderMap:React.FunctionComponent = () => {
    const center: LatLngTuple = [config.center[0], config.center[1]];
    return (
        <Suspense fallback="loading">
            <Map
                id="MainMap"
                center={center}
                zoom={config.zoom}
                projection={config.projection}
                language={config.language}
                layers={config.layers}
                search={config.search}
                auth={config.auth}
            />
        </Suspense>
    );
}

const routing = (
    <I18nextProvider i18n={i18nInstance}>
        <StateProvider>
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
        </StateProvider>
    </I18nextProvider>
);

ReactDOM.render(routing, document.getElementById('root'));

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
