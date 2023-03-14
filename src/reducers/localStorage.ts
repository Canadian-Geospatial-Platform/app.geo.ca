/* eslint-disable prettier/prettier */
import { StoreEnhancer } from 'redux';
import { INITMAINMAPINFO, INITSPATIALTEMPORALFILTER } from './reducer';

function checkNestedProperty(obj, props: string): boolean {
    const splitted = props.split('.');
    let temp = obj;
    for (const index in splitted) {
        if (temp[splitted[index]] === 'undefined' || !temp[splitted[index]]) return false;
        temp = temp[splitted[index]];
    }
    return true;
}


export const loadState = (): StoreEnhancer<unknown, unknown> | undefined => {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        }
        const state = JSON.parse(serializedState);
        if (!checkNestedProperty(state, 'mappingReducer.spatempfilter')) {
            state['mappingReducer'].spatempfilter = INITSPATIALTEMPORALFILTER;
        }
        if (!checkNestedProperty(state, 'mappingReducer.spatialfilter')) {
            state['mappingReducer'].spatialfilter = [];
        }
        if (!checkNestedProperty(state, 'mappingReducer.stacfilter')) {
            state['mappingReducer'].stacfilter = [];
        }
        if (!checkNestedProperty(state, 'mappingReducer.center')) {
            state['mappingReducer'].center = INITMAINMAPINFO.center;
        }
        if (!checkNestedProperty(state, 'mappingReducer.zoom')) {
            state['mappingReducer'].zoom = INITMAINMAPINFO.zoom;
        }
        return state;
    } catch (err) {
        return undefined;
    }
};

export const saveState = (state: unknown): void => {
    try {
        // console.log(state);
        const serializedState = JSON.stringify(state);
        // console.log(serializedState)
        localStorage.clear();
        localStorage.setItem('state', serializedState);
    } catch (err) {
        // ignore write errors
        console.log('error set local:', err);
    }
};
