import L, { DivIcon, LatLng, LatLngBounds, Point, ResizeEvent } from 'leaflet';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AttributionControl, MapContainer, Marker, Pane, Rectangle, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { NavBar } from '../navbar/nav-bar';
import './spatial-extent.scss';

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
                // console.log(newPoint, x, y);
                newPosition = map.containerPointToLatLng(new Point(x, y));
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
    let orgSwMarkerPt: Point;
    let orgNeMarkerPt: Point;
    let isZooming = false;
    useEffect(() => {
        console.log(map.getSize());
    }, []);
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
            onMapZoomChange(map.getZoom(), newbounds);
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
    zoom: number;
    center: LatLng;
    bbox: LatLngBounds;
    onBBox: (bounds: LatLngBounds) => void;
    onZoom: (zoom: number, bounds: LatLngBounds) => void;
    onCenter: (center: LatLng, bounds: LatLngBounds) => void;
}
export default function SpatialExtent(props: SpecialExtentProps): JSX.Element {
    const { t } = useTranslation();
    const [zoom, setZoom] = useState(props.zoom);
    const [center, setCenter] = useState<LatLng>(props.center);
    const [bounds, setBounds] = useState<LatLngBounds>(props.bbox);
    const handleMarker = (newBounds: LatLngBounds) => {
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

    return (
        <div className="spatial-extent">
            <MapContainer center={center} zoomControl={false} zoom={zoom} attributionControl={false} maxZoom={22}>
                <TileLayer
                    url="https://maps-cartes.services.geo.ca/server2_serveur2/rest/services/BaseMaps/CBMT_CBCT_GEOM_3857/MapServer/WMTS/tile/1.0.0/BaseMaps_CBMT_CBCT_GEOM_3857/default/default028mm/{z}/{y}/{x}.jpg"
                    attribution={t('mapctrl.attribution')}
                />
                <AttributionControl position="bottomleft" prefix={false} />
                <NavBar />

                <Pane name="area-select-rectangle" style={{ zIndex: 499 }}>
                    <Rectangle bounds={bounds} pathOptions={{ color: '#515aa9' }} />
                </Pane>
                <DraggableMarker key="marker-sw" position={ORDINAL_DIRECTION.SW} bounds={bounds} onPositionChange={handleMarker} />
                <DraggableMarker key="marker-ne" position={ORDINAL_DIRECTION.NE} bounds={bounds} onPositionChange={handleMarker} />
                <DraggableMarker key="marker-se" position={ORDINAL_DIRECTION.SE} bounds={bounds} onPositionChange={handleMarker} />
                <DraggableMarker key="marker-nw" position={ORDINAL_DIRECTION.NW} bounds={bounds} onPositionChange={handleMarker} />
                <MapHandler onMapResize={handleMarker} onMapCenterChange={handleMapMove} onMapZoomChange={handleMapZoom} bounds={bounds} />
            </MapContainer>
        </div>
    );
}
