/* eslint-disable prettier/prettier */
import { SpatialData, StacData } from '../app';
import { ActionType, Action, BooleanAction, FilterAction, FiltersAction, SpatialAction, StacAction } from './action';

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
}
export interface mappingObj {
    id: string;
    title: mappingTitle;
}
export interface mappingTitle {
    en: string;
    fr: string;
}

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
};

const mappingReducer = (
    state: mappingState = defaultState,
    action: Action | BooleanAction | FilterAction | FiltersAction | SpatialAction | StacAction
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
        default:
            return state;
    }
};

export default mappingReducer;
