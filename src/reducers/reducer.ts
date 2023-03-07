/* eslint-disable prettier/prettier */
import { LatLng, LatLngBounds } from 'leaflet';
import { SpatialData, StacData } from '../app';
import { ActionType, Action, BooleanAction, FilterAction, FiltersAction, SpatialAction, StacAction, SpatialTemporalAction } from './action';

export interface SpatialTemporalFilter {
    extents: number[];
    center: LatLng;
    zoom: number;
    bbox: LatLngBounds;
    startDate: string;
    endDate: string;
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
}
export interface mappingObj {
    id: string;
    title: mappingTitle;
}
export interface mappingTitle {
    en: string;
    fr: string;
}

const initcenter: LatLng = new LatLng(67.769, -113.9919);
const radius = 20;
const southwest: LatLng = new LatLng(initcenter.lat - radius, initcenter.lng - radius);
const northeast: LatLng = new LatLng(initcenter.lat + radius / 2, initcenter.lng + radius * 2);
const initbounds: LatLngBounds = new LatLngBounds(southwest, northeast);
export const INITSPATIALTEMPORALFILTER: SpatialTemporalFilter = { extents: [], zoom: 1, center: initcenter, bbox: initbounds, startDate: new Date().toISOString(), endDate: new Date().toISOString() };
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
    spatempfilter: INITSPATIALTEMPORALFILTER
};

const mappingReducer = (
    state: mappingState = defaultState,
    action: Action | BooleanAction | FilterAction | FiltersAction | SpatialAction | StacAction | SpatialTemporalAction
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
        default:
            return state;
    }
};

export default mappingReducer;
