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
import { useTranslation } from 'react-i18next';
import { loadState } from '../../reducers/localStorage';
import { getQueryParams } from '../../common/queryparams';

const RampViewer = (): JSX.Element => {
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
        // script.async = true;
        if (attr.beforeElementName) {
            const beforeEl = document.getElementsByName(attr.beforeElementName);
            if (beforeEl.length>0) {
                document.body.insertBefore(script, beforeEl[0]);
            } else {
                document.body.appendChild(script);
            }
        } else {
            document.body.appendChild(script);
        }    
    }

    const addMapDiv = (attr: mapAttr) => {
        const mapDiv = document.createElement("div");
        mapDiv.id = attr.id;
        mapDiv.setAttribute("is", attr.is);
        mapDiv.setAttribute("rv-langs", attr.rvLangs);
        mapDiv.setAttribute("rv-service-endpoint", "https://rcs.open.canada.ca");
        mapDiv.setAttribute("data-rv-keys", JSON.stringify(attr.rvKeys));

        // const rvMapPage = document.getElementById("rvMapPage");
        const rvMap = document.getElementById("rvMap");
        if (rvMap) {
            rvMap.replaceWith(mapDiv);
        } else {
            const rvMapPage = document.getElementById("rvMapPage");
            if (rvMapPage) {
                rvMapPage.prepend(mapDiv);
            }
        }
    }
    useEffect(() => {
        // console.log("rvmap refresh");
        const rvScript = document.getElementById("rvJS");
        if (rvScript) {
            rvScript.remove();
        }
        const rvKeys = queryParams.rvKey ? [queryParams.rvKey]:mapping;
        addMapDiv({id: "rvMap", is: "rv-map", rvLangs: `["${language}-CA"]`, rvKeys});
        appendScript({id: "rvJS", scriptToAppend: "/assets/js/rv-main.js" });
    }, [language]);

    return (
        <div id="rvMapPage" className="mapPage">
            <div id="rvMap" is="rv-map" 
                 rv-langs={`["${language}-CA"]`} 
                 rv-service-endpoint="https://rcs.open.canada.ca" 
                 data-rv-keys={queryParams.rvKey ? JSON.stringify([queryParams.rvKey]):JSON.stringify(mapping)} 
            />
        </div>
    );
};
interface scriptAttr {
    id?: string; 
    scriptToAppend?:string;
    integrity?:string;
    crossorigin?:string;
    beforeElementName?: string;
}

interface mapAttr {
    id: string; 
    is: string;
    rvLangs: string;
    rvKeys: string[];
}
export default RampViewer;