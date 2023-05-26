/* eslint-disable prettier/prettier */

import { SpatialData, StacData } from "./stac";

import {
  Action,
  ActionType,
  BooleanAction,
  BoundboxAction,
  CenterAction,
  FilterAction,
  FiltersAction,
  SpatialAction,
  SpatialTemporalAction,
  StacAction,
  ZoomAction,
} from "./action";
import { Coordinate } from "ol/coordinate";

export interface SpatialTemporalFilter {
  extents: number[];
  startDate: string;
  endDate: string;
}
export interface MainMapInfo {
  zoom: number;
  center: Coordinate;
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
  center: Coordinate;
  zoom: number;
  boundbox?: Coordinate;
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
const mainMap: Element | null = document.getElementById("root");
const jsonConfig = mainMap && mainMap.getAttribute("data-leaflet");
const config = jsonConfig
  ? JSON.parse(jsonConfig.replace(/'/g, '"'))
  : {
      name: "Web Mercator",
      projection: 3857,
      zoom: 4,
      center: [60, -100],
      language: "en",
      search: true,
      auth: false,
    };
export const INITCONFIGINFO: ConfigInfo = {
  projection: config.projection,
  zoomFactor: 5,
};
export const INITMAINMAPINFO: MainMapInfo = {
  center: [-100, 60],
  zoom: config.zoom,
};
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
