import { StateContext } from './state';
import {ActionType} from './action';

export interface Action {
    type: ActionType.ADD_MAPPING | ActionType.DEL_MAPPING | ActionType.CLEAR_MAPPING;
    payload?: string;
}

export const reducer = (state: StateContext, action: Action) => {
  switch (action.type) {
    case ActionType.ADD_MAPPING:
        const addMapping = state.mapping.map(m=>m).push(action.payload);
        return { ...state, mapping: addMapping };
    case ActionType.DEL_MAPPING:
        const delMapping = state.mapping.map(m=>m);
        const delIndex = delMapping.findIndex(mid => mid===action.payload);
        delMapping.splice(delIndex, 1);
        return { ...state, mapping: delMapping };
    case ActionType.CLEAR_MAPPING:
        return { ...state, mapping: [] };
    default:
      throw new Error('Not among actions');
  }
};