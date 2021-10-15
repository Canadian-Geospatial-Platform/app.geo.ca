/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */
import axios from 'axios';
import { envglobals } from './envglobals';
import apiKey from '../security/apikey.json';

export const analyticPost = (aParams: AnalyticParams) => {
    // console.log(aParams);
    axios.post(
        envglobals().APP_API_ANALYTIC_URL, 
        aParams, 
        { 
          headers: { 
            'x-api-key': apiKey
          }
        }
    ).then((response)=>{
        // console.log(response);
    });  
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