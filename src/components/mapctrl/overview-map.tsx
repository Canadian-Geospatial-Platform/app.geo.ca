import { useCallback, useEffect, useMemo, useState } from 'react';

import { useEventHandlers } from '@react-leaflet/core';
import { CRS, DomEvent, LatLng, LatLngBounds, Map } from 'leaflet';
import { MapContainer, Pane, Rectangle, TileLayer, useMap, useMapEvent } from 'react-leaflet';

import { useDispatch, useSelector } from 'react-redux';
import { BasemapOptions } from '../../common/basemap';

import { LEAFLET_POSITION_CLASSES } from '../../common/constant';
import { setSpatempFilter, setStoreBoundbox, setStoreCenter, setStoreZoom } from '../../reducers/action';
import { getMiniZoom, INITCONFIGINFO, INITMAINMAPINFO, INITSPATIALTEMPORALFILTER } from '../../reducers/reducer';

function MinimapBounds(props: MiniboundProps) {
    const { parentMap, zoomFactor, boundbox } = props;
    const minimap = useMap();
    const dispatch = useDispatch();
    useEffect(() => {
        // console.log('fit', boundbox, parentMap.getBounds());
        if (boundbox
            // && (parentMap.getBounds().getSouthWest().lat.toFixed(4) !== boundbox._southWest.lat.toFixed(4)
            //  || parentMap.getBounds().getSouthWest().lng.toFixed(4) !== boundbox._southWest.lng.toFixed(4)
            //  || parentMap.getBounds().getNorthEast().lat.toFixed(4) !== boundbox._northEast.lat.toFixed(4)
            //  || parentMap.getBounds().getNorthEast().lng.toFixed(4) !== boundbox._northEast.lng.toFixed(4))
        ) {
            parentMap.fitBounds(
                new LatLngBounds(
                    new LatLng(boundbox._southWest.lat, boundbox._southWest.lng),
                    new LatLng(boundbox._northEast.lat, boundbox._northEast.lng)
                )
            );
            setBounds(new LatLngBounds(
                new LatLng(boundbox._southWest.lat, boundbox._southWest.lng),
                new LatLng(boundbox._northEast.lat, boundbox._northEast.lng)
            ));
            setTimeout(() => {
                minimap.flyTo(parentMap.getCenter(), getMiniZoom(parentMap.getZoom(), INITCONFIGINFO.zoomFactor));
            }, 300);
        } else {
            parentMap.setView(INITMAINMAPINFO.center, INITMAINMAPINFO.zoom);
            setTimeout(() => {
                dispatch(setStoreBoundbox(parentMap.getBounds()));
                console.log('init bounds again');
                setBounds(parentMap.getBounds());
                minimap.flyTo(parentMap.getCenter(), getMiniZoom(parentMap.getZoom(), INITCONFIGINFO.zoomFactor));
            }, 300);
        }
    }, [boundbox]);

    // const storespatempfilters = useSelector((state) => state.mappingReducer.spatempfilter);
    // Clicking a point on the minimap sets the parent's map center
    const onClick = useCallback(
        (e) => {
            parentMap.setView(e.latlng, parentMap.getZoom());
            setTimeout(() => {
                setBounds(parentMap.getBounds());
            }, 300);
        },
        [parentMap]
    );
    useMapEvent('click', onClick);

    // Keep track of bounds in state to trigger renders
    //const [bounds, setBounds] = useState({ height: 0, width: 0, top: 0, left: 0 });

    const [bounds, setBounds] = useState(
        boundbox
            ? new LatLngBounds(
                new LatLng(boundbox._southWest.lat, boundbox._southWest.lng),
                new LatLng(boundbox._northEast.lat, boundbox._northEast.lng)
            )
            : parentMap.getBounds());
    const onChange = useCallback(() => {
        // Update the minimap's view to match the parent map's center and zoom
        // const newZoom = parentMap.getZoom() - zoomFactor > 0 ? parentMap.getZoom() - zoomFactor : 0;
        minimap.flyTo(parentMap.getCenter(), getMiniZoom(parentMap.getZoom(), INITCONFIGINFO.zoomFactor));
        setBounds(parentMap.getBounds());
        // dispatch(setSpatempFilter(INITSPATIALTEMPORALFILTER));
        /*
                dispatch(setStoreCenter(parentMap.getCenter()));
                dispatch(setStoreZoom(parentMap.getZoom()));
                dispatch(setStoreBoundbox(parentMap.getBounds()));
        */

        // Set in timeout the calculation to create the bound so parentMap getBounds has the updated bounds
        /*
                setTimeout(() => {
                    minimap.invalidateSize();
                    setBounds(parentMap.getBounds());
                    const pMin = minimap.latLngToContainerPoint(parentMap.getBounds().getSouthWest());
                    const pMax = minimap.latLngToContainerPoint(parentMap.getBounds().getNorthEast());
                    setBounds({ height: pMin.y - pMax.y, width: pMax.x - pMin.x, top: pMax.y, left: pMin.x });
                }, 500);
                */
    }, [parentMap, minimap]);

    // Listen to events on the parent map
    const handlers = useMemo(() => ({ moveend: onChange, zoomend: onChange }), [onChange]);
    useEventHandlers({ instance: parentMap }, handlers);

    return (

        <Pane name="area-select-rectangle" style={{ zIndex: 10000 }}>
            <Rectangle bounds={bounds} pathOptions={{ weight: 1, opacity: 0.5, color: 'rgb(0, 0, 0)', fillColor: 'rgba(0, 0, 0, 0.5)' }} />
        </Pane>

        /*
                <div
                    style={{
                        left: `${bounds.left}px`,
                        top: `${bounds.top}px`,
                        width: `${bounds.width}px`,
                        height: `${bounds.height}px`,
                        display: 'block',
                        opacity: 0.5,
                        position: 'absolute',
                        border: '1px solid rgb(0, 0, 0)',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1000,
                    }}
                />
        */
    );
}

export function OverviewMap(props: OverviewProps): JSX.Element {
    const { crs, basemaps, zoomFactor } = props;
    const dispatch = useDispatch();
    const parentMap = useMap();
    const mapZoom = parentMap.getZoom() - zoomFactor > 0 ? parentMap.getZoom() - zoomFactor : 0;
    const boundbox = useSelector((state) => state.mappingReducer.boundbox);
    useEffect(() => {
        if (!boundbox || boundbox === null) {
            dispatch(setStoreBoundbox(parentMap.getBounds()));
            console.log('init boundbox', parentMap.getBounds());
        }
    }, []);

    // Memorize the minimap so it's not affected by position changes
    const minimap = useMemo(
        () => (
            <MapContainer
                style={{ height: 150, width: 150 }}
                center={parentMap.getCenter()}
                zoom={mapZoom}
                crs={crs}
                dragging={false}
                doubleClickZoom={false}
                scrollWheelZoom={false}
                attributionControl={false}
                zoomControl={false}
                whenCreated={(cgpMap) => {
                    DomEvent.disableClickPropagation(cgpMap.getContainer());
                    DomEvent.disableScrollPropagation(cgpMap.getContainer());
                }}
            >
                {basemaps.map((base: { id: string | number | null | undefined; url: string }) => (
                    <TileLayer key={base.id} url={base.url} />
                ))}
                <MinimapBounds parentMap={parentMap} zoomFactor={zoomFactor} boundbox={boundbox} />
            </MapContainer>
        ),
        [parentMap, crs, mapZoom, basemaps, zoomFactor]
    );

    return (
        <div className={LEAFLET_POSITION_CLASSES.topright}>
            <div className="leaflet-control leaflet-bar">{minimap}</div>
        </div>
    );
}

interface OverviewProps {
    crs: CRS;
    basemaps: BasemapOptions[];
    zoomFactor: number;
}

interface MiniboundProps {
    parentMap: Map;
    zoomFactor: number;
    boundbox: LatLngBounds;
}
