import { mappingObj } from "./reducer";

/* eslint-disable prettier/prettier */
export enum ActionType {
    SET_MAPPING = 'setMapping',
    SET_ORG = 'setOrgFilter',
    SET_TYPE = 'setTypeFilter',
    SET_THEME = 'setThemeFilter',
    SET_FOUND = 'setFoundational',
    SET_FILTERS = 'setFilters'
}

export interface Action {
    type: ActionType.SET_MAPPING;
    payload: mappingObj[];
}

interface Filters {
    orgfilter: number[];
    typefilter: number[];
    themefilter: number[];
    foundational: boolean;
}

export interface BooleanAction {
    type: ActionType.SET_FOUND;
    payload: boolean;
}

export interface FilterAction {
    type: ActionType.SET_ORG | ActionType.SET_TYPE | ActionType.SET_THEME;
    payload: number[];
}
export interface FiltersAction {
    type: ActionType.SET_FILTERS ;
    payload: Filters;
}

// export type Action = { type: ActionType.ADD_MAPPING, payload: idstring } | { type: ActionType.DEL_MAPPING, payload: idstring } | { type: ActionType.CLEAR_MAPPING };
export function setMapping(mlist:mappingObj[]):Action {
    return {type: ActionType.SET_MAPPING, payload: mlist};
} 

export function setOrgFilter(orgfilter:number[]):FilterAction {
    return {type: ActionType.SET_ORG, payload: orgfilter};
}

export function setTypeFilter(typefilter:number[]):FilterAction {
    return {type: ActionType.SET_TYPE, payload: typefilter};
}

export function setThemeFilter(themefilter:number[]):FilterAction {
    return {type: ActionType.SET_THEME, payload: themefilter};
}

export function setFoundational(foundational:boolean):BooleanAction {
    return {type: ActionType.SET_FOUND, payload: foundational};
}

export function setFilters(filters: Filters):FiltersAction {
    return {type: ActionType.SET_FILTERS, payload: filters};
}
