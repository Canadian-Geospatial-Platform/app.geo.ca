//import { StateContext } from './state';
import {ActionType} from './action';

export interface Action {
    type: ActionType.ADD_MAPPING | ActionType.DEL_MAPPING | ActionType.CLEAR_MAPPING | ActionType.SET_ORG | ActionType.SET_TYPE | ActionType.SET_THEME | ActionType.SET_FOUND | ActionType.SET_FILTERS ;
    payload?: any;
}

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
    case ActionType.ADD_MAPPING:
        const addMapping = state.mapping.map(m=>m);
        if (action.payload!==undefined && action.payload!=='' && addMapping.findIndex(mid => mid===action.payload)<0 ) {
            addMapping.push(action.payload);
        }
        return { ...state, mapping: addMapping };
    case ActionType.DEL_MAPPING:
        return { ...state, mapping: state.mapping.filter(mid => mid!==action.payload) };
    case ActionType.CLEAR_MAPPING:
        return { ...state, mapping: [] };
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