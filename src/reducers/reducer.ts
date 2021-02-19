/* eslint-disable prettier/prettier */
import {ActionType, Action} from './action';

export interface mappingState {
    mapping: string[];
    orgfilter: string[];
    typefilter: string[];
    themefilter: string[];
    foundational: boolean;
}

const defaultState: mappingState = { 
    mapping: [], 
    orgfilter: [], 
    typefilter: [], 
    themefilter: [], 
    foundational: false 
};

const mappingReducer = (
    state: mappingState = defaultState, 
    action: Action
) : mappingState => {
  switch (action.type) {
    case ActionType.SET_MAPPING:
        return { ...state, mapping: action.payload };
    case ActionType.SET_ORG:
        return { ...state, orgfilter: action.payload };    
    case ActionType.SET_TYPE:
        return { ...state, typefilter: action.payload };    
    case ActionType.SET_THEME:
        return { ...state, themefilter: action.payload };    
    case ActionType.SET_FOUND:
        return { ...state, foundational: action.payload };
    case ActionType.SET_FILTERS:
        return { ...state, ...action.payload };           
    default:
        return state;
  }
};

export default mappingReducer;