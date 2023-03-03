import L, { DivIcon, LatLng, LatLngBounds, Point } from 'leaflet';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AttributionControl, MapContainer, Marker, Pane, Rectangle, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import './spatial-extent.scss';
import { NavBar } from '../navbar/nav-bar';

export enum ORDINAL_DIRECTION {
    SW,
    SE,
    NW,
    NE
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
                const newPosition = marker.getLatLng();
                let newBounds;
                if (marker != null) {
                    switch (position) {
                        case ORDINAL_DIRECTION.SE:
                            newBounds = new LatLngBounds(
                                new LatLng(newPosition.lat, bounds.getSouthWest().lng),
                                new LatLng(bounds.getNorthEast().lat, newPosition.lng)
                            );
                            break;
                        case ORDINAL_DIRECTION.SW:
                            newBounds = new LatLngBounds(newPosition, bounds.getNorthEast());
                            break;
                        case ORDINAL_DIRECTION.NE:
                            newBounds = new LatLngBounds(bounds.getSouthWest(), newPosition);
                            break;
                        case ORDINAL_DIRECTION.NW:
                            newBounds = new LatLngBounds(
                                new LatLng(bounds.getSouthWest().lat, newPosition.lng),
                                new LatLng(newPosition.lat, bounds.getNorthEast().lng)
                            );
                            break;
                        default:
                    }
                    onPositionChange(newBounds);
                }
            },
        }),
        []
    );
    /*
    useEffect(() => {
        console.log(props.position);
    }); */
    return <Marker icon={icon} draggable={true} eventHandlers={eventHandlers} position={markerPosition} ref={markerRef} />;
}
interface MapHandlerProps {
    bounds: LatLngBounds;
    onMapCenterChange: (center: LatLng, bounds: LatLngBounds) => void;
    onMapZoomChange: (zoom: number, bounds: LatLngBounds) => void;
}

function MapHandler(props: MapHandlerProps) {
    const map = useMap();
    let orgSwMarkerPt: Point;
    let orgNeMarkerPt: Point;
    let isZooming = false;
    useMapEvents({
        zoomstart: () => {
            // console.log('zoom start');
            isZooming = true;
            orgSwMarkerPt = map.latLngToContainerPoint(props.bounds.getSouthWest());
            orgNeMarkerPt = map.latLngToContainerPoint(props.bounds.getNorthEast());
        },
        zoomend: () => {
            // console.log('zoom end');
            const bounds = L.latLngBounds(map.containerPointToLatLng(orgSwMarkerPt), map.containerPointToLatLng(orgNeMarkerPt));
            props.onMapZoomChange(map.getZoom(), bounds);
            isZooming = false;
        },
        movestart: () => {
            if (!isZooming) {
                orgSwMarkerPt = map.latLngToContainerPoint(props.bounds.getSouthWest());
                orgNeMarkerPt = map.latLngToContainerPoint(props.bounds.getNorthEast());
            }
        },
        moveend: () => {
            if (!isZooming) {
                try {
                    const bounds = L.latLngBounds(map.containerPointToLatLng(orgSwMarkerPt), map.containerPointToLatLng(orgNeMarkerPt));
                    props.onMapCenterChange(map.getCenter(), bounds);
                } catch (e) {
                    // ignore when fired by zoom
                }
            }
        },
    });
    /*
    const onMove = useCallback(() => {
        // console.log(map.getCenter());
        props.onMapCenterChange(map.getCenter());
    }, [map]);
    
    useEffect(() => {
        map.on('moveend', onMove);
        return () => {
            map.off('moveend', onMove);
        }
    }, [map, onMove]);
    */
    return null;
}
interface SpecialExtentProps {
    zoom: number;
    center: LatLng;
    bbox: LatLngBounds;
    onBBox: (bounds: LatLngBounds) => void;
    onZoom: (zoom: number, bounds: LatLngBounds) => void;
    onCenter: (center: LatLng, bounds: LatLngBounds) => void;
}
export default function SpatialExtent(props: SpecialExtentProps): JSX.Element {
    const { t } = useTranslation();
    /*
    const initzoom = 1;
    const initcenter: LatLng = new LatLng(68.333, -95.1755);
    const radius = 20;
    // const coordinates = JSON.parse('[[[-179.661, 51.798], [-10.69, 51.798], [-10.69, 84.868], [-179.661, 84.868], [-179.661, 51.798]]]');
    const southwestlat = initcenter.lat - radius;
    const southwestlng = initcenter.lng - radius;
    const southwest: LatLng = new LatLng(southwestlat, southwestlng);
    const northeastlat = initcenter.lat + radius / 2;
    const northeastlng = initcenter.lng + radius * 2;
    const northeast: LatLng = new LatLng(northeastlat, northeastlng);
    const initbounds: LatLngBounds = new LatLngBounds(southwest, northeast);
    const northwest: LatLng = new LatLng(northeastlat, southwestlng);
    const southeast: LatLng = new LatLng(southwestlat, northeastlng);
    */
    const [zoom, setZoom] = useState(props.zoom);
    const [center, setCenter] = useState<LatLng>(props.center);
    const [swMarker, setSwMarker] = useState<LatLng>(props.bbox.getSouthWest());
    const [seMarker, setSeMarker] = useState<LatLng>(props.bbox.getSouthEast());
    const [nwMarker, setNwMarker] = useState<LatLng>(props.bbox.getNorthWest());
    const [neMarker, setNeMarker] = useState<LatLng>(props.bbox.getNorthEast());
    const [bounds, setBounds] = useState<LatLngBounds>(props.bbox);
    const handleMarker = (newBounds: LatLngBounds) => {
        //setSeMarker(newPosition);
        //setSwMarker(new LatLng(newPosition.lat, swMarker.lng));
        //setNeMarker(new LatLng(neMarker.lat, newPosition.lng));
        //setNwMarker(nwMarker);
        //const newBounds = new LatLngBounds(new LatLng(newPosition.lat, swMarker.lng), new LatLng(neMarker.lat, newPosition.lng));
        setBounds(newBounds);
        props.onBBox(newBounds);
        //console.log('se', newPosition, newBounds);
    };
    const handleSouthEastMarker = (newBounds: LatLngBounds) => {
        //setSeMarker(newPosition);
        //setSwMarker(new LatLng(newPosition.lat, swMarker.lng));
        //setNeMarker(new LatLng(neMarker.lat, newPosition.lng));
        //setNwMarker(nwMarker);
        //const newBounds = new LatLngBounds(new LatLng(newPosition.lat, swMarker.lng), new LatLng(neMarker.lat, newPosition.lng));
        setBounds(newBounds);
        props.onBBox(newBounds);
        //console.log('se', newPosition, newBounds);
    };
    const handleSouthWestMarker = (newBounds: LatLngBounds) => {
        //setSwMarker(newPosition);
        //setSeMarker(new LatLng(newPosition.lat, seMarker.lng));
        //setNwMarker(new LatLng(nwMarker.lat, newPosition.lng));
        //setNeMarker(neMarker);
        //const newBounds = new LatLngBounds(newPosition, neMarker);
        setBounds(newBounds);
        props.onBBox(newBounds);
        //console.log('sw', newPosition, newBounds);
    };
    const handleNorthEastMarker = (newPosition: LatLng) => {
        //setNeMarker(newPosition);
        //setSeMarker(new LatLng(seMarker.lat, newPosition.lng));
        //setNwMarker(new LatLng(newPosition.lat, nwMarker.lng));
        //setSwMarker(swMarker);
        //const newBounds = new LatLngBounds(swMarker, newPosition);
        //setBounds(newBounds);
        //props.onBBox(newBounds);
        console.log('ne', newPosition, newBounds);
    };
    const handleNorthWestMarker = (newPosition: LatLng) => {
        //console.log('sw', swMarker);
        //setNwMarker(newPosition);
        //setSwMarker(new LatLng(swMarker.lat, newPosition.lng));
        //setNeMarker(new LatLng(newPosition.lat, neMarker.lng));
        //setSeMarker(seMarker);
        const newBounds = new LatLngBounds(
            new LatLng(bounds.getSouthWest().lat, newPosition.lng),
            new LatLng(newPosition.lat, bounds.getNorthEast().lng)
        );
        setBounds(newBounds);
        props.onBBox(newBounds);
        console.log('nw', newPosition, newBounds);
    };

    const handleMapMove = (newCenter: LatLng, newBounds: LatLngBounds) => {
        console.log('move', newCenter);
        setCenter(newCenter);
        setBounds(newBounds);
        //setSeMarker(newBounds.getSouthEast());
        //setNwMarker(newBounds.getNorthWest());
        //setSwMarker(newBounds.getSouthWest());
        //setNeMarker(newBounds.getNorthEast());
        props.onCenter(newCenter, newBounds);
        /* const latChange = newCenter.lat - center.lat;
        const lngChange = newCenter.lng - center.lng;
        setBounds(
            new LatLngBounds(
                [bounds.getSouthWest().lat + latChange, bounds.getSouthWest().lng + lngChange],
                [bounds.getNorthEast().lat + latChange, bounds.getNorthEast().lng + lngChange]
            )
        );
        setSwMarker(new LatLng(bounds.getSouthWest().lat + latChange, bounds.getSouthWest().lng + lngChange));
        setNeMarker(new LatLng(bounds.getNorthEast().lat + latChange, bounds.getNorthEast().lng + lngChange));
        setSeMarker(new LatLng(seMarker.lat + latChange, seMarker.lng + lngChange));
        setNwMarker(new LatLng(nwMarker.lat + latChange, nwMarker.lng + lngChange));
        */
    };

    const handleMapZoom = (newZoom: number, newBounds: LatLngBounds) => {
        console.log('zoom', newZoom, newBounds);
        setZoom(newZoom);
        setBounds(newBounds);
        //setSeMarker(newBounds.getSouthEast());
        //setNwMarker(newBounds.getNorthWest());
        //setSwMarker(newBounds.getSouthWest());
        //setNeMarker(newBounds.getNorthEast());
        props.onZoom(newZoom, newBounds);
    };
    /*
        useEffect(() => {
            setSeMarker(bounds.getSouthEast());
            setNwMarker(bounds.getNorthWest());
            setSwMarker(bounds.getSouthWest());
            setNeMarker(bounds.getNorthEast());
        }, [bounds]);
      */
    return (
        <div className="spatial-extent">
            <MapContainer center={center} zoomControl={false} zoom={zoom} attributionControl={false} maxZoom={22}>
                <TileLayer
                    url="https://maps-cartes.services.geo.ca/server2_serveur2/rest/services/BaseMaps/CBMT_CBCT_GEOM_3857/MapServer/WMTS/tile/1.0.0/BaseMaps_CBMT_CBCT_GEOM_3857/default/default028mm/{z}/{y}/{x}.jpg"
                    attribution={t('mapctrl.attribution')}
                />
                <AttributionControl position="bottomleft" prefix={false} />
                <NavBar />
                {/*
                <GeoJSON                    
                    data={{
                        type: 'Feature',
                        properties: { id: 1, tag: 'geoViewGeoJSON' },
                        geometry: { type: 'Polygon', coordinates },
                    }}
                /> */}
                <Pane name="area-select-rectangle" style={{ zIndex: 499 }}>
                    <Rectangle bounds={bounds} pathOptions={{ color: '#515aa9' }} />
                </Pane>
                <DraggableMarker key="dm1" position={ORDINAL_DIRECTION.SW} bounds={bounds} onPositionChange={handleMarker} />
                <DraggableMarker key="dm2" position={ORDINAL_DIRECTION.NE} bounds={bounds} onPositionChange={handleMarker} />
                <DraggableMarker key="dm3" position={ORDINAL_DIRECTION.SE} bounds={bounds} onPositionChange={handleMarker} />
                <DraggableMarker key="dm4" position={ORDINAL_DIRECTION.NW} bounds={bounds} onPositionChange={handleMarker} />
                <MapHandler bounds={bounds} onMapCenterChange={handleMapMove} onMapZoomChange={handleMapZoom} />
            </MapContainer>
        </div>
    );
}
