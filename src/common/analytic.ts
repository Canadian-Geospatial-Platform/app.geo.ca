/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */
import axios from 'axios';
import { envglobals } from './envglobals';
import apiKey from '../security/apikey.json';

const EnvGlobals = envglobals();

export const analyticPost = (aParams: AnalyticParams, successFunc?: any, errorFunc?: any) => {
    // console.log(aParams);
    axios.post(
        `${EnvGlobals.APP_API_DOMAIN_URL}${EnvGlobals.APP_API_ENDPOINTS.ANALYTIC}`, 
        aParams, 
        { 
          headers: { 
            'x-api-key': apiKey
          }
        }
    ).then((response)=>typeof successFunc === 'function'?successFunc(response):{}
    ).catch((error)=>typeof errorFunc === 'function'?errorFunc(error):{});
  
}

export const analyticGet = (endpointUrl: string, aParams: LastAllParams, successFunc?: any, errorFunc?: any, finallyFunc?: any) => {
    // console.log(aParams);
    axios.get(
        `${EnvGlobals.APP_API_DOMAIN_URL}${EnvGlobals.APP_API_ENDPOINTS.ANALYTIC}/${endpointUrl}`, 
        { 
          params: aParams
        }
    ).then((response)=>typeof successFunc === 'function'?successFunc(response):{}
    ).catch((error)=>typeof errorFunc === 'function'?errorFunc(error):{}
    ).finally(()=>typeof finallyFunc === 'function'?finallyFunc():{});

  
}

export interface AnalyticParams {
    search?: string;
    theme?: string[];
    org?: string[];
    type_filter?: string[];
    foundational?: 'true'|'false';
    geo?: string;
    uuid?: string;
    resource?: string;
    resource_type?: string;
    loc: string;
    lang: 'en'|'fr';
    type: 'access'|'use'|'search';
    event: 'search'|'view'|'map'|'footprint'|'geocore'|'resource'|'hnap';
}

export interface LastAllParams {
    lang?: 'en'|'fr';
    org?: string[];
    userId?: string
}