/* eslint-disable prettier/prettier */
import { StoreEnhancer } from 'redux';

export const loadState = ():StoreEnhancer<unknown,unknown>|undefined => {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

export const saveState = (state: unknown):void => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.clear();
        localStorage.setItem('state', serializedState);
    } catch (err) {
        // ignore write errors
       // console.log('error set local:', err);
    }
};
