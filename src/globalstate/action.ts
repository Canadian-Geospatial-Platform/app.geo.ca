export enum ActionType {
    ADD_MAPPING = 'addMapping',
    DEL_MAPPING = 'delMapping',
    CLEAR_MAPPING = 'clearMapping',
  }
//export type Action = { type: ActionType.ADD_MAPPING, payload: idstring } | { type: ActionType.DEL_MAPPING, payload: idstring } | { type: ActionType.CLEAR_MAPPING };
export function addMapping(rid:string) {
    return {type: ActionType.ADD_MAPPING, payload: rid};
} 

export function delMapping(rid:string) {
    return {type: ActionType.DEL_MAPPING, payload: rid};
}

export function clearMapping() {
    return {type: ActionType.CLEAR_MAPPING};
}