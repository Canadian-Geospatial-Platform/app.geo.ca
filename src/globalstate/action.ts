export enum ActionType {
    ADD_MAPPING = 'addMapping',
    DEL_MAPPING = 'delMapping',
    CLEAR_MAPPING = 'clearMapping',
  }
//export type Action = { type: ActionType.ADD_MAPPING, payload: idstring } | { type: ActionType.DEL_MAPPING, payload: idstring } | { type: ActionType.CLEAR_MAPPING };
export function addMapping(rid:string) {
    return dispatch => {
        dispatch({type: ActionType.ADD_MAPPING, payload: rid});
    }
} 

export function delMapping(rid:string) {
    return dispatch => {
        dispatch({type: ActionType.DEL_MAPPING, payload: rid});
    }
}

export function clearMapping() {
    return dispatch => {
        dispatch({type: ActionType.CLEAR_MAPPING});
    }
}