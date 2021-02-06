import { StateContext } from './state';
import {ActionType} from './action';

export interface Action {
    type: ActionType.ADD_MAPPING | ActionType.DEL_MAPPING | ActionType.CLEAR_MAPPING;
    payload?: string;
}

export const reducer = (state: StateContext, action: Action) => {
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
    default:
      throw new Error('Not among actions');
  }
};