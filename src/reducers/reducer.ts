/* eslint-disable prettier/prettier */
import { ActionType, Action, BooleanAction, FilterAction, FiltersAction } from './action';

export interface mappingState {
    mapping: mappingObj[];
    orgfilter: number[];
    typefilter: number[];
    themefilter: number[];
    spatialfilter: number[];
    foundational: boolean;
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
};

const mappingReducer = (
    state: mappingState = defaultState,
    action: Action | BooleanAction | FilterAction | FiltersAction
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
        default:
            return state;
    }
};

export default mappingReducer;
