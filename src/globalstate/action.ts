export enum ActionType {
    ADD_MAPPING = 'addMapping',
    DEL_MAPPING = 'delMapping',
    CLEAR_MAPPING = 'clearMapping',
    SET_ORG = 'setOrgFilter',
    SET_TYPE = 'setTypeFilter',
    SET_THEME = 'setThemeFilter'
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

export function setOrgFilter(orgfilter:string[]) {
    return {type: ActionType.SET_ORG, payload: orgfilter};
}

export function setTypeFilter(typefilter:string[]) {
    return {type: ActionType.SET_TYPE, payload: typefilter};
}

export function setThemeFilter(themefilter:string[]) {
    return {type: ActionType.SET_THEME, payload: themefilter};
}
