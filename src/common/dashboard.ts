import axios from 'axios';
import { envglobals } from './envglobals';
import apiKey from '../security/apikey.json';
import { LastAllParams } from './analytic';

const EnvGlobals = envglobals();

export enum DASHBOARD_CALLS {
    ANNOUNCEMENT,
    COMMUNITY,
    SAVED_RECORDS
}

const getAPIURL = (dc: DASHBOARD_CALLS, endpointUrl: string) => {
    let url = "";
    switch (+dc) {
        case DASHBOARD_CALLS.ANNOUNCEMENT:
            url = `${EnvGlobals.APP_API_DOMAIN_URL}${EnvGlobals.APP_API_ENDPOINTS.ANNOUNCEMENTS}/${endpointUrl}`;
            break;
        case DASHBOARD_CALLS.COMMUNITY:
            url = `${EnvGlobals.APP_API_DOMAIN_URL}${EnvGlobals.APP_API_ENDPOINTS.MYCOMMUNITY}/${endpointUrl}`;
            break;
        case DASHBOARD_CALLS.SAVED_RECORDS:
            url = `${EnvGlobals.APP_API_DOMAIN_URL}${EnvGlobals.APP_API_ENDPOINTS.SAVED_RECORDS}/${endpointUrl}`;
            break;
    }
    return url;
}

export const Get = (dc: DASHBOARD_CALLS, endpointUrl: string, aParams: LastAllParams, successFunc?: any, errorFunc?: any, finallyFunc?: any) => {
    axios.get(
        getAPIURL(dc, endpointUrl),
        {
            params: aParams
        }
    ).then((response) => typeof successFunc === 'function' ? successFunc(response) : {}
    ).catch((error) => typeof errorFunc === 'function' ? errorFunc(error) : {}
    ).finally(() => typeof finallyFunc === 'function' ? finallyFunc() : {});
}

export const announcementGetTemp = (endpointUrl: string, aParams: LastAllParams, successFunc?: any, errorFunc?: any, finallyFunc?: any) => {
    let url = `https://mocki.io/v1/804e9c1d-9674-4afa-aa88-5aa4035e8331`;
    if (endpointUrl === 'announcements')
        url = 'https://mocki.io/v1/476b57e4-d591-44e4-ba7e-1aa66f3fef23';
    else if (endpointUrl === 'data')
        url = 'https://mocki.io/v1/06adf1a9-add7-4671-8e3c-ea236722692b';
    else if (endpointUrl === 'resources')
        url = 'https://mocki.io/v1/7c6449f8-832f-472f-9c00-61a3c2ff06f4';
    axios.get(
        url
    ).then((response) => typeof successFunc === 'function' ? successFunc(response) : {}
    ).catch((error) => typeof errorFunc === 'function' ? errorFunc(error) : {}
    ).finally(() => typeof finallyFunc === 'function' ? finallyFunc() : {});
}


