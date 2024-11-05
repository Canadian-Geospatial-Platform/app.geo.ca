/* eslint-disable prettier/prettier */
import { StoreEnhancer } from 'redux';
import { INITMAINMAPINFO, INITMETADATASRCFILTER, INITSPATIALTEMPORALFILTER } from './reducer';

const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

function checkNestedProperty(obj, props: string): boolean {
    const splitted = props.split('.');
    let temp = obj;
    for (const index in splitted) {
        if (typeof temp[splitted[index]] === 'undefined' || !temp[splitted[index]]) return false;
        temp = temp[splitted[index]];
    }
    return true;
}

export const loadState = (): StoreEnhancer<unknown, unknown> | undefined => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const serializedState = localStorage.getItem('state');
        
        // No state in localStorage, return undefined
        if (serializedState === null) {
            return undefined;
        }

        // Get saved timestamp from localStorage
        const savedTime = localStorage.getItem('stateTimestamp');
        
        // If no timestamp is found or session is expired
        if (savedTime === null) {
            console.log("No session timestamp found, starting a new session");
            localStorage.clear(); // Clear localStorage
            return undefined;
        }

        // Check if the session has expired (5 minutes timeout)
        const currentTime = new Date().getTime();
        if (currentTime - parseInt(savedTime) > SESSION_TIMEOUT) {
            console.log("Session expired, clearing state.");
            localStorage.clear(); // Invalidate state if session expired
            localStorage.setItem('stateTimestamp', currentTime.toString()); // Reset timestamp
            return undefined;
        }

        // Proceed with loading the state if session is valid
        const state = JSON.parse(serializedState);

        // Set default values if they are missing in the state
        if (!checkNestedProperty(state, 'mappingReducer.spatempfilter')) {
            state['mappingReducer'].spatempfilter = INITSPATIALTEMPORALFILTER;
        }
        if (!checkNestedProperty(state, 'mappingReducer.spatialfilter')) {
            state['mappingReducer'].spatialfilter = [];
        }
        if (!checkNestedProperty(state, 'mappingReducer.metasrcfilter')) {
            state['mappingReducer'].metasrcfilter = INITMETADATASRCFILTER;
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
        if (!checkNestedProperty(state, 'mappingReducer.freezeMapSearch')) {
            state['mappingReducer'].freezeMapSearch = { freeze: true };
        }
        return state;
    } catch (err) {
        // Return undefined if any error occurs during state loading
        return undefined;
    }
};

export const saveState = (state: unknown): void => {
    try {
        const serializedState = JSON.stringify(state);
        const currentTime = new Date().getTime().toString(); // Get current timestamp
        
        // Clear existing state in localStorage before saving
        localStorage.clear();
        
        // Save the state and the timestamp
        localStorage.setItem('state', serializedState);
        localStorage.setItem('stateTimestamp', currentTime); // Save current timestamp to track session
    } catch (err) {
        // Handle errors (e.g., if localStorage is unavailable or quota exceeded)
        console.log('error saving to localStorage:', err);
    }
};