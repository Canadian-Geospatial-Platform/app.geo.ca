import L, { CRS, DivIcon, LatLng, LatLngBounds, Map, Point, ResizeEvent } from 'leaflet';
import { createRef, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@material-ui/icons/Search';
import { MapContainer, Marker, Pane, Rectangle, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { Basemap, BasemapOptions } from '../../common/basemap';
import { Projection } from '../../common/projection';
import { getMainZoom, getMiniZoom, INITCONFIGINFO } from '../../reducers/reducer';
import { NavBar } from '../navbar/nav-bar';
import DropdownSelection from './dropdown-selection';
import provincebboxes from '../search/province-bbox.json';
import provinceoptions from '../search/province-option.json';
import './spatial-extent.scss';
import { envglobals } from '../../common/envglobals';
import axios from 'axios';
import BeatLoader from 'react-spinners/BeatLoader';
import ms from 'date-fns/esm/locale/ms/index.js';

export enum ORDINAL_DIRECTION {
    SW,
    SE,
    NW,
    NE,
}
const icon = new DivIcon({
    className: 'leaflet-div-icon',
    iconSize: [16, 16],
});

interface MarkerProps {
    position: number;
    bounds: LatLngBounds;
    onPositionChange: (newBounds: LatLngBounds) => void;
}

function DraggableMarker(props: MarkerProps) {
    const { position, bounds, onPositionChange } = props;
    const map = useMap();
    let markerPosition;
    switch (position) {
        case ORDINAL_DIRECTION.SE:
            markerPosition = bounds.getSouthEast();
            break;
        case ORDINAL_DIRECTION.SW:
            markerPosition = bounds.getSouthWest();
            break;
        case ORDINAL_DIRECTION.NE:
            markerPosition = bounds.getNorthEast();
            break;
        case ORDINAL_DIRECTION.NW:
            markerPosition = bounds.getNorthWest();
            break;
        default:
    }
    const markerRef = useRef(null);
    const eventHandlers = useMemo(
        () => ({
            drag() {
                const marker = markerRef.current;
                const sePoint = map.latLngToContainerPoint(bounds.getSouthEast());
                const swPoint = map.latLngToContainerPoint(bounds.getSouthWest());
                const nePoint = map.latLngToContainerPoint(bounds.getNorthEast());
                const nwPoint = map.latLngToContainerPoint(bounds.getNorthWest());
                const halfx = nePoint.x - swPoint.x - 5;
                const halfy = swPoint.y - nePoint.y - 5;
                let newPosition = marker.getLatLng();
                let newBounds;
                const newPoint = map.latLngToContainerPoint(newPosition);
                let x = newPoint.x;
                let y = newPoint.y;
                if (x < 0) {
                    x = 0;
                } else if (x > map.getSize().x) {
                    x = map.getSize().x;
                }
                if (y < 0) {
                    y = 0;
                } else if (y > map.getSize().y - 30) {
                    y = map.getSize().y - 30;
                }
                let deltax;
                let deltay;
                switch (position) {
                    case ORDINAL_DIRECTION.SE:
                        deltax = x - sePoint.x;
                        deltay = y - sePoint.y;
                        if (deltax < 0 && 0 - deltax > halfx) {
                            x = sePoint.x - halfx;
                        }
                        if (deltay < 0 && 0 - deltay > halfy) {
                            y = sePoint.y - halfy;
                        }
                        break;
                    case ORDINAL_DIRECTION.SW:
                        deltax = x - swPoint.x;
                        deltay = y - swPoint.y;
                        if (deltax > 0 && deltax > halfx) {
                            x = swPoint.x + halfx;
                        }
                        if (deltay < 0 && 0 - deltay > halfy) {
                            y = swPoint.y - halfy;
                        }
                        break;
                    case ORDINAL_DIRECTION.NE:
                        deltax = x - nePoint.x;
                        deltay = y - nePoint.y;
                        if (deltax < 0 && 0 - deltax > halfx) {
                            x = nePoint.x - halfx;
                        }
                        if (deltay > 0 && deltay > halfy) {
                            y = nePoint.y + halfy;
                        }
                        break;
                    case ORDINAL_DIRECTION.NW:
                        deltax = x - nwPoint.x;
                        deltay = y - nwPoint.y;
                        if (deltax > 0 && deltax > halfx) {
                            x = nwPoint.x + halfx;
                        }
                        if (deltay > 0 && deltay > halfy) {
                            y = nwPoint.y + halfy;
                        }
                        break;
                    default:
                }
                // console.log(newPoint, x, y);
                newPosition = map.containerPointToLatLng(new Point(x, y));
                if (marker != null) {
                    switch (position) {
                        case ORDINAL_DIRECTION.SE:
                            deltax = x - sePoint.x;
                            deltay = y - sePoint.y;
                            newBounds = new LatLngBounds(
                                new LatLng(
                                    newPosition.lat,
                                    map.containerPointToLatLng(new Point(swPoint.x - deltax, swPoint.y + deltay)).lng
                                ),
                                new LatLng(
                                    map.containerPointToLatLng(new Point(nePoint.x + deltax, nePoint.y - deltay)).lat,
                                    newPosition.lng
                                )
                            );
                            break;
                        case ORDINAL_DIRECTION.SW:
                            deltax = x - swPoint.x;
                            deltay = y - swPoint.y;
                            newBounds = new LatLngBounds(
                                newPosition,
                                map.containerPointToLatLng(new Point(nePoint.x - deltax, nePoint.y - deltay))
                            );
                            break;
                        case ORDINAL_DIRECTION.NE:
                            deltax = x - nePoint.x;
                            deltay = y - nePoint.y;
                            newBounds = new LatLngBounds(
                                map.containerPointToLatLng(new Point(swPoint.x - deltax, swPoint.y - deltay)),
                                newPosition
                            );
                            break;
                        case ORDINAL_DIRECTION.NW:
                            deltax = x - nwPoint.x;
                            deltay = y - nwPoint.y;
                            newBounds = new LatLngBounds(
                                new LatLng(
                                    map.containerPointToLatLng(new Point(swPoint.x + deltax, swPoint.y - deltay)).lat,
                                    newPosition.lng
                                ),
                                new LatLng(
                                    newPosition.lat,
                                    map.containerPointToLatLng(new Point(nePoint.x - deltax, nePoint.y + deltay)).lng
                                )
                            );
                            break;
                        default:
                    }
                    onPositionChange(newBounds);
                }
            },
        }),
        [bounds, onPositionChange, position]
    );

    return <Marker icon={icon} draggable={true} eventHandlers={eventHandlers} position={markerPosition} ref={markerRef} />;
}

interface MapHandlerProps {
    bounds: LatLngBounds;
    onMapCenterChange: (center: LatLng, bounds: LatLngBounds) => void;
    onMapZoomChange: (zoom: number, bounds: LatLngBounds) => void;
    onMapResize: (bounds: LatLngBounds) => void;
}

function MapHandler(props: MapHandlerProps) {
    const { bounds, onMapCenterChange, onMapZoomChange, onMapResize } = props;
    const map = useMap();
    const { t } = useTranslation();
    const language = t('app.language');
    let orgSwMarkerPt: Point;
    let orgNeMarkerPt: Point;
    let isZooming = false;
    useEffect(() => {
        console.log(map.getSize());
    }, []);

    useEffect(() => {
        const basemap: Basemap = new Basemap(`${language}-CA`);
        const basemaps: BasemapOptions[] = basemap.wmCBMT;
        map.eachLayer((layer: unknown) => {
            // console.log(layer);
            if (layer instanceof L.TileLayer) {
                map.removeLayer(layer);
            }
        });
        basemaps.forEach((base) => {
            L.tileLayer(base.url).addTo(map);
        });
    }, [language]);

    useMapEvents({
        resize: (event: ResizeEvent) => {
            console.log(event, map.getCenter(), bounds, document.fullscreenElement);
            const swMarkerPt = map.latLngToContainerPoint(bounds.getSouthWest());
            const neMarkerPt = map.latLngToContainerPoint(bounds.getNorthEast());
            const newSwMarkerPt = new Point(
                (swMarkerPt.x * event.newSize.x) / event.oldSize.x,
                (swMarkerPt.y * event.newSize.y) / event.oldSize.y,
                true
            );
            const newNeMarkerPt = new Point(
                (neMarkerPt.x * event.newSize.x) / event.oldSize.x,
                (neMarkerPt.y * event.newSize.y) / event.oldSize.y,
                true
            );
            console.log(swMarkerPt, newSwMarkerPt, neMarkerPt, newNeMarkerPt);
            const newbounds = L.latLngBounds(map.containerPointToLatLng(newSwMarkerPt), map.containerPointToLatLng(newNeMarkerPt));
        },
        zoomstart: () => {
            console.log('zoom start');
            isZooming = true;
            orgSwMarkerPt = map.latLngToContainerPoint(bounds.getSouthWest());
            orgNeMarkerPt = map.latLngToContainerPoint(bounds.getNorthEast());
        },
        zoomend: () => {
            // console.log('zoom end');
            const newbounds = L.latLngBounds(map.containerPointToLatLng(orgSwMarkerPt), map.containerPointToLatLng(orgNeMarkerPt));
            onMapZoomChange(getMainZoom(map.getZoom(), INITCONFIGINFO.zoomFactor), newbounds);
            isZooming = false;
        },
        movestart: () => {
            console.log('move start');
            if (!isZooming) {
                orgSwMarkerPt = map.latLngToContainerPoint(bounds.getSouthWest());
                orgNeMarkerPt = map.latLngToContainerPoint(bounds.getNorthEast());
            }
        },
        moveend: () => {
            if (!isZooming) {
                try {
                    const newbounds = L.latLngBounds(map.containerPointToLatLng(orgSwMarkerPt), map.containerPointToLatLng(orgNeMarkerPt));
                    onMapCenterChange(map.getCenter(), newbounds);
                } catch (e) {
                    // ignore when fired by zoom
                }
            }
        },
    });
    return null;
}

interface SpecialExtentProps {
    //zoom: number;
    //center: LatLng;
    //bbox: LatLngBounds;
    language: string;
    onBBox: (bounds: LatLngBounds) => void;
    onZoom: (zoom: number, bounds: LatLngBounds) => void;
    onCenter: (center: LatLng, bounds: LatLngBounds) => void;
}
export default function SpatialExtent(props: SpecialExtentProps): JSX.Element {
    /*
    const [zoom, setZoom] = useState(props.zoom);
    const [center, setCenter] = useState<LatLng>(
        useSelector((state: mappingState) => (state.spatempfilter ? state.spatempfilter.center : INITSPATIALTEMPORALFILTER.center))
    );
    const [bounds, setBounds] = useState<LatLngBounds>(props.bbox);
    */
    const { t } = useTranslation();
    const [map, setMap] = useState<Map>(null);
    const [loading, setLoading] = useState(false);
    const [errorResult, setErrorResult] = useState(false);
    const [province, setProvince] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [extent, setExtent] = useState('');
    const [zoom, setZoom] = useState(useSelector((state) => state.mappingReducer.zoom));
    //const [zoom, setZoom] = useState(getMainZoom(provincebboxes[province].zoom, INITCONFIGINFO.zoomFactor));
    const [center, setCenter] = useState<LatLng>(useSelector((state) => state.mappingReducer.center));
    //const [center, setCenter] = useState(new LatLng(provincebboxes[province].center[0], provincebboxes[province].center[1]));
    const boundbox = useSelector((state) => state.mappingReducer.boundbox);

    const [bounds, setBounds] = useState(() =>
        boundbox
            ? new LatLngBounds(
                new LatLng(boundbox._southWest.lat, boundbox._southWest.lng),
                new LatLng(boundbox._northEast.lat, boundbox._northEast.lng)
            )
            : null
    );
    /*
    const [bounds, setBounds] = useState(
        new LatLngBounds(
            new LatLng(provincebboxes[province].bound.south_lat, provincebboxes[province].bound.west_lng),
            new LatLng(provincebboxes[province].bound.north_lat, provincebboxes[province].bound.east_lng)
        )
    );
    */
    //const inputRef: React.RefObject<HTMLInputElement> = createRef();
    const inputRef = useRef(null);
    const basemap: Basemap = new Basemap(props.language);
    const basemaps: BasemapOptions[] = INITCONFIGINFO.projection === 3857 ? basemap.wmCBMT : basemap.lccCBMT;
    const crs = INITCONFIGINFO.projection === 3857 ? CRS.EPSG3857 : Projection.getProjection(INITCONFIGINFO.projection);
    const handleMarker = (newBounds: LatLngBounds) => {
        console.log('marker moved');
        setBounds(newBounds);
        props.onBBox(newBounds);
    };

    const handleMapMove = (newCenter: LatLng, newBounds: LatLngBounds) => {
        console.log('move', newCenter);
        setCenter(newCenter);
        setBounds(newBounds);
        props.onCenter(newCenter, newBounds);
    };

    const handleMapZoom = (newZoom: number, newBounds: LatLngBounds) => {
        console.log('zoom', newZoom, newBounds);
        setZoom(newZoom);
        setBounds(newBounds);
        props.onZoom(newZoom, newBounds);
    };

    const handleProvinceChange = (value: string) => {
        inputRef.current.value = '';
        setSearchResult([]);
        setProvince(value);
        if (value !== '') {
            console.log(provincebboxes[value]);
            const bound = new LatLngBounds(
                new LatLng(provincebboxes[value].bound.south_lat, provincebboxes[value].bound.west_lng),
                new LatLng(provincebboxes[value].bound.north_lat, provincebboxes[value].bound.east_lng)
            );
            const newCenter = new LatLng(provincebboxes[value].center[0], provincebboxes[value].center[1]);

            map.setView(newCenter, provincebboxes[value].zoom);
            setTimeout(() => {
                setBounds(bound);
                setCenter(newCenter);
                setZoom(getMainZoom(provincebboxes[value].zoom, INITCONFIGINFO.zoomFactor));
                props.onCenter(newCenter, bound);
            }, 300);
        }
    };
    const handleSelectExtentChange = (value: string) => {
        setExtent(value);
        const bboxStr = value.substring(value.indexOf('#') + 1).split(',');
        const bbox = bboxStr.map((b) => Number(b));
        console.log(value, bbox);
        const bound = new LatLngBounds(new LatLng(bbox[1], bbox[0]), new LatLng(bbox[3], bbox[2]));
        const newCenter = new LatLng(bbox[1] + (bbox[3] - bbox[1]) / 2, bbox[0] + (bbox[2] - bbox[0]) / 2);
        const newZoom = 10;
        map.setView(newCenter, newZoom);
        setTimeout(() => {
            setBounds(bound);
            setCenter(newCenter);
            setZoom(getMainZoom(newZoom, INITCONFIGINFO.zoomFactor));
            props.onCenter(newCenter, bound);
        }, 300);
    };
    const EnvGlobals = envglobals();
    const handleSpatialSearch = (event?: React.MouseEvent | undefined) => {
        if (event) {
            event.preventDefault();
        }
        setProvince('');
        setLoading(true);
        const keyword = (inputRef.current as HTMLInputElement).value;

        axios
            .get(`${EnvGlobals.APP_GEOLOCATOR_URL}`, {
                //headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                params: { lang: t('app.language'), q: keyword, key: 'geonames' },
            })
            .then((response) => {
                setLoading(false);
                console.log('search', response);
                if (response && response.status === 200 && response.data && response.data.length > 0) {
                    const items = response.data.filter((d) => d.key === 'geonames');
                    if (items && items.length > 0) {
                        setErrorResult(false);

                        if (items.length > 1) {
                            const list = items.map((d, idx) => {
                                let label;
                                if (d.tag && d.tag[0]) {
                                    label = `${d.name},${d.tag[0]},${d.province}`;
                                } else {
                                    label = `${d.name},${d.province}`;
                                }
                                const value = `${idx}#${d.bbox.join(',')}`;
                                return { label, value };
                            });
                            setExtent(list[0].value);
                            setSearchResult(list);
                            console.log(list);
                        }

                        const box = items[0].bbox;
                        console.log(box);
                        // w.lng, s.lat, e.lng, n.lat
                        const bound = new LatLngBounds(new LatLng(box[1], box[0]), new LatLng(box[3], box[2]));
                        const newCenter = new LatLng(box[1] + (box[3] - box[1]) / 2, box[0] + (box[2] - box[0]) / 2);
                        const newZoom = 10;
                        map.setView(newCenter, newZoom);
                        setTimeout(() => {
                            setBounds(bound);
                            setCenter(newCenter);
                            setZoom(getMainZoom(newZoom, INITCONFIGINFO.zoomFactor));
                            props.onCenter(newCenter, bound);
                        }, 300);

                    } else {
                        setErrorResult(true);
                    }
                } else {
                    setErrorResult(true);
                }

            })
            .catch((e) => {
                console.log(e);
                setErrorResult(true);
                setLoading(false);
            });
    };

    useEffect(() => {
        console.log('rendered');
    });

    return (
        <div className="spatial-extent">
            <DropdownSelection
                label="filter.label.spatemp.selectprovince"
                options={provinceoptions}
                labelClassName="dropdown-select-label"
                selectClassName="dropdown-select"
                optionClassName="dropdown-select-option"
                iconClassName="dropdown-select-icon"
                defaultValue={province}
                onSelect={handleProvinceChange}
            />
            <div>{t('filter.label.spatemp.or')}</div>
            <div className="searchInput" style={{ paddingTop: 5, paddingBottom: 5 }}>
                <input
                    placeholder={t('filter.label.spatemp.search-extent')}
                    id="search-spatial"
                    type="search"
                    defaultValue={''}
                    ref={inputRef}
                    aria-label={t('appbar.search')}
                />
                <button type="button" className="icon-button" aria-label={t('appbar.search')} onClick={handleSpatialSearch}>
                    <SearchIcon />
                </button>
            </div>
            {loading ? (
                <div className="col-12 col-beat-loader">
                    <BeatLoader color="#515aa9" />
                </div>
            ) : errorResult ? (
                <span>{t('page.noresult')}</span>
            ) : (
                <>
                    {searchResult.length > 1 && (
                        <DropdownSelection
                            label="filter.label.spatemp.select-extent"
                            options={searchResult}
                            labelClassName="dropdown-select-label"
                            selectClassName="dropdown-select"
                            optionClassName="dropdown-select-option"
                            iconClassName="dropdown-select-icon"
                            defaultValue={extent}
                            onSelect={handleSelectExtentChange}
                        />
                    )}
                </>
            )}
            <MapContainer
                crs={crs}
                center={center}
                zoomControl={false}
                zoom={getMiniZoom(zoom, INITCONFIGINFO.zoomFactor)}
                attributionControl={false}
                maxZoom={22}
                whenCreated={(m: Map) => setMap(m)}
            >
                {basemaps.map((base: { id: string | number | null | undefined; url: string }) => (
                    <TileLayer key={base.id} url={base.url} />
                ))}
                <NavBar />

                <Rectangle bounds={bounds} pathOptions={{ color: '#515aa9', weight: 1, opacity: 0.5 }} />

                <DraggableMarker key="marker-sw" position={ORDINAL_DIRECTION.SW} bounds={bounds} onPositionChange={handleMarker} />
                <DraggableMarker key="marker-ne" position={ORDINAL_DIRECTION.NE} bounds={bounds} onPositionChange={handleMarker} />
                <DraggableMarker key="marker-se" position={ORDINAL_DIRECTION.SE} bounds={bounds} onPositionChange={handleMarker} />
                <DraggableMarker key="marker-nw" position={ORDINAL_DIRECTION.NW} bounds={bounds} onPositionChange={handleMarker} />
                <MapHandler
                    onMapResize={handleMarker}
                    onMapCenterChange={handleMapMove}
                    onMapZoomChange={handleMapZoom}
                    bounds={bounds}
                />
            </MapContainer>

        </div>
    );
}
