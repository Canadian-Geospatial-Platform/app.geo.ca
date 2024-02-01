/* eslint-disable prettier/prettier */
import { LatLng, LatLngBounds } from 'leaflet';
import { SpatialData, StacData } from '../app';
import { getMapOptions, MapOptions } from '../common/map';
import {
    Action,
    ActionType,
    BooleanAction,
    BoundboxAction,
    CenterAction,
    FilterAction,
    FiltersAction,    
    FreezeSpatialAction,    
    SpatialAction,
    SpatialTemporalAction,
    StacAction,
    ZoomAction,
} from './action';

export interface SpatialTemporalFilter {
    extents: number[];
    startDate: string;
    endDate: string;
}
export interface MainMapInfo {
    zoom: number;
    center: LatLng;
}
export interface FreezeMapSpatial {
    freeze: boolean;
}
export interface mappingState {
    mapping: mappingObj[];
    orgfilter: number[];
    typefilter: number[];
    themefilter: number[];
    spatialfilter: number[];
    foundational: boolean;
    spatialData: SpatialData;
    stacfilter: number[];
    stacData: StacData;
    spatempfilter: SpatialTemporalFilter;
    center: LatLng;
    zoom: number;
    boundbox?: LatLngBounds;
    freezeMapSearch: FreezeMapSpatial;
}
export interface mappingObj {
    id: string;
    title: mappingTitle;
}
export interface mappingTitle {
    en: string;
    fr: string;
}
export interface ConfigInfo {
    projection: any;
    zoomFactor: number;
}
export function getMiniZoom(zoom: number, zoomFactor: number): number {
    const miniZoom = zoom - zoomFactor;
    return miniZoom > 0 ? miniZoom : 0;
}
export function getMainZoom(zoom: number, zoomFactor: number): number {
    let newZoom;
    if (zoom === 0) {
        newZoom = 4;
    } else {
        newZoom = zoom + zoomFactor;
    }
    return newZoom;
}
const mainMap: Element | null = document.getElementById('root');
const jsonConfig = mainMap && mainMap.getAttribute('data-leaflet');
const config = jsonConfig
    ? JSON.parse(jsonConfig.replace(/'/g, '"'))
    : { name: 'Web Mercator', projection: 3857, zoom: 4, center: [60, -100], language: 'en', search: true, auth: false };
const mapOptions: MapOptions = getMapOptions(config.projection);
// const initZoom = config.zoom - mapOptions.zoomFactor > 0 ? config.zoom - mapOptions.zoomFactor : 0;
const initcenter: LatLng = new LatLng(config.center[0], config.center[1]);

// const radius = 20;
// const southwest: LatLng = new LatLng(initcenter.lat - radius, initcenter.lng - radius);
// const northeast: LatLng = new LatLng(initcenter.lat + radius / 2, initcenter.lng + radius * 2);
// const initbounds = mapOptions.maxBounds ? mapOptions.maxBounds : new LatLngBounds(southwest, northeast);
export const INITCONFIGINFO: ConfigInfo = { projection: config.projection, zoomFactor: mapOptions.zoomFactor };
export const INITMAINMAPINFO: MainMapInfo = { center: initcenter, zoom: config.zoom };
export const INITSPATIALTEMPORALFILTER: SpatialTemporalFilter = {
    extents: [],
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
};
const defaultState: mappingState = {
    mapping: [],
    orgfilter: [],
    typefilter: [],
    themefilter: [],
    spatialfilter: [],
    foundational: false,
    spatialData: { viewableOnTheMap: 0, notViewableOnTheMap: 0 },
    stacfilter: [],
    stacData: { hnap: 0, stac: 0 },
    spatempfilter: INITSPATIALTEMPORALFILTER,
    center: INITMAINMAPINFO.center,
    zoom: INITMAINMAPINFO.zoom,
    freezeMapSearch: { freeze: false },
};

const mappingReducer = (
    state: mappingState = defaultState,
    action:
        | Action
        | BooleanAction
        | FilterAction
        | FiltersAction
        | SpatialAction
        | StacAction
        | SpatialTemporalAction        
        | CenterAction
        | ZoomAction
        | BoundboxAction
        | FreezeSpatialAction
): mappingState => {
    switch (action.type) {
        case ActionType.SET_MAPPING:
            return { ...state, mapping: action.payload };
        case ActionType.SET_ORG:
            return { ...state, orgfilter: action.payload };
        case ActionType.SET_TYPE:
            return { ...state, typefilter: action.payload };
        case ActionType.SET_THEME:
            return { ...state, themefilter: action.payload };
        case ActionType.SET_SPATIAL:
            return { ...state, spatialfilter: action.payload };
        case ActionType.SET_FOUND:
            return { ...state, foundational: action.payload };
        case ActionType.SET_FREEZEMAPSEARCH:
            return { ...state, freezeMapSearch: action.payload };
        case ActionType.SET_FILTERS:
            return { ...state, ...action.payload };
        case ActionType.SET_SPATIALDATA:
            return { ...state, spatialData: action.payload };
        case ActionType.SET_STAC:
            return { ...state, stacfilter: action.payload };
        case ActionType.SET_STACDATA:
            return { ...state, stacData: action.payload };
        case ActionType.SET_SPATEMP:
            return { ...state, spatempfilter: action.payload };
        case ActionType.SET_CENTER:
            return { ...state, center: action.payload };
        case ActionType.SET_ZOOM:
            return { ...state, zoom: action.payload };
        case ActionType.SET_BOUNDBOX:
            return { ...state, boundbox: action.payload };
        default:
            return state;
    }
};

export default mappingReducer;
