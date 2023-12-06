import { LatLng, LatLngBounds } from 'leaflet';
import { SpatialData, StacData } from '../app';
import { FreezeMapSpatial, mappingObj, SpatialTemporalFilter } from './reducer';

/* eslint-disable prettier/prettier */
export enum ActionType {
    SET_MAPPING = 'setMapping',
    SET_ORG = 'setOrgFilter',
    SET_TYPE = 'setTypeFilter',
    SET_THEME = 'setThemeFilter',
    SET_SPATIAL = 'setSpatial',
    SET_FOUND = 'setFoundational',
    SET_FILTERS = 'setFilters',
    SET_SPATIALDATA = 'setSpatialData',
    SET_STAC = 'setStac',
    SET_STACDATA = 'setStacData',
    SET_SPATEMP = 'setSpatempFilter',
    SET_CENTER = 'setCenter',
    SET_ZOOM = 'setZoom',
    SET_BOUNDBOX = 'setBoundbox',
    SET_FREEZEMAPSEARCH = 'setFreezeMapSearch',
    SET_METASRC = 'setMetadataSource',
}

export interface Action {
    type: ActionType.SET_MAPPING;
    payload: mappingObj[];
}

interface Filters {
    orgfilter: number[];
    typefilter: number[];
    themefilter: number[];
    spatialfilter: number[];
    foundational: boolean;
    stacfilter: number[];
    spatempfilter: SpatialTemporalFilter;
    metasrcfilter: number[];
}

export interface BooleanAction {
    type: ActionType.SET_FOUND;
    payload: boolean;
}

export interface FreezeSpatialAction {
    type: ActionType.SET_FREEZEMAPSEARCH;
    payload: FreezeMapSpatial;
}
export interface FilterAction {
    type:
        | ActionType.SET_ORG
        | ActionType.SET_TYPE
        | ActionType.SET_THEME
        | ActionType.SET_SPATIAL
        | ActionType.SET_STAC
        | ActionType.SET_METASRC;
    payload: number[];
}
export interface FiltersAction {
    type: ActionType.SET_FILTERS;
    payload: Filters;
}
export interface SpatialTemporalAction {
    type: ActionType.SET_SPATEMP;
    payload: SpatialTemporalFilter;
}

export interface SpatialAction {
    type: ActionType.SET_SPATIALDATA;
    payload: SpatialData;
}

export interface StacAction {
    type: ActionType.SET_STACDATA;
    payload: StacData;
}
export interface CenterAction {
    type: ActionType.SET_CENTER;
    payload: LatLng;
}
export interface ZoomAction {
    type: ActionType.SET_ZOOM;
    payload: number;
}
export interface BoundboxAction {
    type: ActionType.SET_BOUNDBOX;
    payload: LatLngBounds;
}
// export type Action = { type: ActionType.ADD_MAPPING, payload: idstring } | { type: ActionType.DEL_MAPPING, payload: idstring } | { type: ActionType.CLEAR_MAPPING };
export function setMapping(mlist: mappingObj[]): Action {
    return { type: ActionType.SET_MAPPING, payload: mlist };
}

export function setOrgFilter(orgfilter: number[]): FilterAction {
    return { type: ActionType.SET_ORG, payload: orgfilter };
}

export function setTypeFilter(typefilter: number[]): FilterAction {
    return { type: ActionType.SET_TYPE, payload: typefilter };
}

export function setThemeFilter(themefilter: number[]): FilterAction {
    return { type: ActionType.SET_THEME, payload: themefilter };
}

export function setMetasrcFilter(metasrcfilter: number[]): FilterAction {
    return { type: ActionType.SET_METASRC, payload: metasrcfilter };
}

export function setSpatialFilter(spatialfilter: number[]): FilterAction {
    return { type: ActionType.SET_SPATIAL, payload: spatialfilter };
}

export function setSpatialData(spatialData: SpatialData): SpatialAction {
    return { type: ActionType.SET_SPATIALDATA, payload: spatialData };
}

export function setFoundational(foundational: boolean): BooleanAction {
    return { type: ActionType.SET_FOUND, payload: foundational };
}

export function setFreezeMapSearch(freeze: boolean): FreezeSpatialAction {
    return { type: ActionType.SET_FREEZEMAPSEARCH, payload: { freeze } };
}

export function setFilters(filters: Filters): FiltersAction {
    return { type: ActionType.SET_FILTERS, payload: filters };
}

export function setStacFilter(stacfilter: number[]): FilterAction {
    return { type: ActionType.SET_STAC, payload: stacfilter };
}

export function setStacData(stacData: StacData): StacAction {
    return { type: ActionType.SET_STACDATA, payload: stacData };
}

export function setSpatempFilter(spatempfilter: SpatialTemporalFilter): SpatialTemporalAction {
    return { type: ActionType.SET_SPATEMP, payload: spatempfilter };
}
export function setStoreCenter(center: LatLng): CenterAction {
    return { type: ActionType.SET_CENTER, payload: center };
}
export function setStoreZoom(zoom: number): ZoomAction {
    return { type: ActionType.SET_ZOOM, payload: zoom };
}
export function setStoreBoundbox(boundbox: LatLngBounds): BoundboxAction {
    return { type: ActionType.SET_BOUNDBOX, payload: boundbox };
}
