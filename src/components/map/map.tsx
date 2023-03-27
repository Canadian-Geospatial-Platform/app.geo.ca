/* eslint-disable prettier/prettier */
import { StrictMode, Suspense, useEffect, useState } from 'react';
import { render } from 'react-dom';

import { CRS, LatLngTuple } from 'leaflet';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { AttributionControl, MapContainer, ScaleControl, TileLayer } from 'react-leaflet';

import { useDispatch, useSelector } from 'react-redux';
import { Basemap, BasemapOptions } from '../../common/basemap';
import { Layer, LayerConfig } from '../../common/layer';
import { getMapOptions, MapOptions } from '../../common/map';
import { Projection } from '../../common/projection';

import { setFreezeMapSearch } from '../../reducers/action';
import { FreezeMapSpatial, INITCONFIGINFO } from '../../reducers/reducer';
import { Appbar } from '../appbar/app-bar';
import { MousePosition } from '../mapctrl/mouse-position';
import { OverviewMap } from '../mapctrl/overview-map';
import { SpatialOpt } from '../mapctrl/spatial-opt';
import { NavBar } from '../navbar/nav-bar';

export function Map(props: MapProps): JSX.Element {
    const { id, language, search, auth, layers } = props;
    const { t } = useTranslation();
    // get the needed projection. Web Mercator is out of the box but we need to create LCC
    // the projection will work with CBMT basemap. If another basemap would be use, update...
    const crs = INITCONFIGINFO.projection === 3857 ? CRS.EPSG3857 : Projection.getProjection(INITCONFIGINFO.projection);
    const zoom = useSelector((state) => state.mappingReducer.zoom);
    const center = useSelector((state) => state.mappingReducer.center);
    const freezeSpatial = useSelector((state) => state.mappingReducer.freezeMapSearch);
    const [freeze, setFreeze] = useState<FreezeMapSpatial>(freezeSpatial);
    // get basemaps with attribution
    const basemap: Basemap = new Basemap(language);
    const basemaps: BasemapOptions[] = INITCONFIGINFO.projection === 3857 ? basemap.wmCBMT : basemap.lccCBMT;
    // const attribution = language === 'en-CA' ? basemap.attribution['en-CA'] : basemap.attribution['fr-CA'];
    const dispatch = useDispatch();
    // get map option from slected basemap projection
    const mapOptions: MapOptions = getMapOptions(INITCONFIGINFO.projection);
    const toggleSpatialFilter = (e) => {
        //e.preventDefault();
        console.log(e.target.checked);
        dispatch(setFreezeMapSearch(e.target.checked));
        setFreeze({ freeze: e.target.checked });
    }
    useEffect(() => {
        console.log('rendered');
    });
    return (
        <MapContainer
            id={id}
            center={center}
            zoom={zoom}
            crs={crs}
            zoomControl={false}
            attributionControl={false}
            minZoom={mapOptions.minZoom}
            maxZoom={mapOptions.maxZooom}
            maxBounds={mapOptions.maxBounds}
            whenCreated={(cgpMap) => {
                // reset the view when created so overviewmap is moved at the right place
                setTimeout(() => {
                    cgpMap.setView(center, zoom);
                }, 0);
                // TODO: put this a t the right place. This is temporary to show we can add different layer type to the map
                const layer = new Layer();
                const createdLayers = [];
                layers?.forEach((item) => {
                    if (item.type === 'ogcWMS') {
                        createdLayers.push(layer.addWMS(cgpMap, item));
                    } else if (item.type === 'esriFeature') {
                        createdLayers.push(layer.addEsriFeature(cgpMap, item));
                    } else if (item.type === 'esriDynamic') {
                        createdLayers.push(layer.addEsriDynamic(cgpMap, item));
                    }
                });
            }}
        >
            <div id="app-left-bar" className="leaflet-control cgp-appbar">
                <Appbar search={search} auth={auth} freeze={freeze} />
            </div>
            {basemaps.map((base) => (
                <TileLayer key={base.id} url={base.url} attribution={t("mapctrl.attribution")} />
            ))}
            <NavBar />
            <SpatialOpt checked={freeze.freeze} onChange={toggleSpatialFilter} />
            <MousePosition />
            <ScaleControl position="bottomright" imperial={false} />
            <AttributionControl position="bottomleft" prefix={false} />
            <OverviewMap crs={crs} basemaps={basemaps} zoomFactor={mapOptions.zoomFactor} />
        </MapContainer>
    );
}

export function createMap(element: Element, config: MapConfig, i18nInstance: any): void {
    const center: LatLngTuple = [config.center[0], config.center[1]];

    // * strict mode rendering twice explanation: https://mariosfakiolas.com/blog/my-react-components-render-twice-and-drive-me-crazy/
    render(
        <StrictMode>
            <Suspense fallback="">
                <I18nextProvider i18n={i18nInstance}>
                    <Map
                        id={element.id}
                        center={center}
                        zoom={config.zoom}
                        projection={config.projection}
                        language={config.language}
                        layers={config.layers}
                        search={config.search}
                        auth={config.auth}
                    />
                </I18nextProvider>
            </Suspense>
        </StrictMode>,
        element
    );
}

// TODO: place configuration interface and manipulation in it's own class
// TODO: map props and config props are similar, combine to have one
interface MapConfig {
    center: number[];
    zoom: number;
    projection: number;
    language: string;
    search: boolean;
    auth: boolean;
    layers?: LayerConfig[];
}

interface MapProps {
    id: string;
    language: string;
    search: boolean;
    auth: boolean;
    layers?: LayerConfig[];
}
