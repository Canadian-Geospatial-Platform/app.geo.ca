/* eslint-disable prettier/prettier */
export interface Action {
    type: ActionType.ADD_MAPPING | ActionType.DEL_MAPPING | ActionType.CLEAR_MAPPING | ActionType.SET_ORG | ActionType.SET_TYPE | ActionType.SET_THEME | ActionType.SET_FOUND | ActionType.SET_FILTERS ;
    payload?: string | string[] | boolean | unknown;
}

export enum ActionType {
    ADD_MAPPING = 'addMapping',
    DEL_MAPPING = 'delMapping',
    CLEAR_MAPPING = 'clearMapping',
    SET_ORG = 'setOrgFilter',
    SET_TYPE = 'setTypeFilter',
    SET_THEME = 'setThemeFilter',
    SET_FOUND = 'setFoundational',
    SET_FILTERS = 'setFilters'
  }
// export type Action = { type: ActionType.ADD_MAPPING, payload: idstring } | { type: ActionType.DEL_MAPPING, payload: idstring } | { type: ActionType.CLEAR_MAPPING };
export function addMapping(rid:string):Action {
    return {type: ActionType.ADD_MAPPING, payload: rid};
} 

export function delMapping(rid:string):Action {
    return {type: ActionType.DEL_MAPPING, payload: rid};
}

export function clearMapping():Action {
    return {type: ActionType.CLEAR_MAPPING};
}

export function setOrgFilter(orgfilter:string[]):Action {
    return {type: ActionType.SET_ORG, payload: orgfilter};
}

export function setTypeFilter(typefilter:string[]):Action {
    return {type: ActionType.SET_TYPE, payload: typefilter};
}

export function setThemeFilter(themefilter:string[]):Action {
    return {type: ActionType.SET_THEME, payload: themefilter};
}

export function setFoundational(foundational:boolean):Action {
    return {type: ActionType.SET_FOUND, payload: foundational};
}

export function setFilters(filters: unknown):Action {
    return {type: ActionType.SET_FILTERS, payload: filters};
}
