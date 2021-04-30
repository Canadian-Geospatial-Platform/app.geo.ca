/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-filename-extension */
import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { StoreEnhancer } from 'redux';
import { loadState } from '../../reducers/localStorage';
import { useTranslation } from 'react-i18next';
import { getQueryParams } from '../../common/queryparams';

const RampViewer = (rv: string): JSX.Element => {
    const location = useLocation();
    const queryParams = getQueryParams(location.search);
    const { t } = useTranslation();
    const language = t('app.language');
    const localState: StoreEnhancer<unknown, unknown> | undefined = loadState();
    const mapping = localState !== undefined ? localState.mappingReducer.mapping : [];
    
    const appendScript = (attr: scriptAttr) => {
        const script = document.createElement("script");
        if (attr.id) {
            script.id = attr.id;
        }
        if (attr.scriptToAppend) {
            script.src = attr.scriptToAppend;
        }
        if (attr.integrity) {
            script.integrity = attr.integrity;
        }
        if (attr.crossorigin) {
            script.crossorigin = attr.crossorigin;
        }
        //script.async = true;
        document.body.appendChild(script);
    }

    const addMapDiv = (attr: mapAttr) => {
        const mapDiv = document.createElement("div");
        mapDiv.id = attr.id;
        mapDiv.setAttribute("is", attr.is);
        mapDiv.setAttribute("rv-langs", attr.rvLangs);
        mapDiv.setAttribute("rv-service-endpoint", "https://rcs.open.canada.ca");
        mapDiv.setAttribute("data-rv-keys", JSON.stringify(attr.rvKeys));

        const rvMapPage = document.getElementById("rvMapPage");
        if (rvMapPage) {
            rvMapPage.prepend(mapDiv);
        }
    }
    useEffect(() => {
        const rvKeys = queryParams.rvKey ? [queryParams.rvKey]:mapping;
        const rvMap = document.getElementById("rvMap");
        if (!rvMap) {
            addMapDiv({id: "rvMap", is: "rv-map", rvLangs: `["${language}-CA"]`, rvKeys});
        }
         
        const jqScript = document.getElementById("jqJS");
        if (!jqScript) {
            appendScript({id: "jqJS", scriptToAppend: "https://code.jquery.com/jquery-2.2.4.min.js", integrity: "sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=", crossorigin: "anonymous" });
        }
        const pfScript = document.getElementById("pfJS");
        if (!pfScript) {
            appendScript({id: "pfJS", scriptToAppend: "https://cdn.polyfill.io/v2/polyfill.min.js?features=default,Object.entries,Object.values,Array.prototype.find,Array.prototype.findIndex,Array.prototype.values,Array.prototype.includes,HTMLCanvasElement.prototype.toBlob,String.prototype.repeat,String.prototype.codePointAt,String.fromCodePoint,NodeList.prototype.@@iterator,Promise,Promise.prototype.finally" });
        } 
        const rvScript = document.getElementById("rvJS");
        if (!rvScript) {
            appendScript({id: "rvJS", scriptToAppend: "/assets/js/rv-main.js" });
        }
            
    }, [language, queryParams.rvKey]);

    return (
        <div id="rvMapPage" className="mapPage" />
    );
};
interface scriptAttr {
    id?: string; 
    scriptToAppend?:string;
    integrity?:string;
    crossorigin?:string;
}

interface mapAttr {
    id: string; 
    is: string;
    rvLangs: string;
    rvKeys: string[];
}
export default RampViewer;