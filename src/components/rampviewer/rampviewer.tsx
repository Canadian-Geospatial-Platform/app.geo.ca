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
// import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { getQueryParams } from '../../common/queryparams';

const RampViewer = (rv: string): JSX.Element => {
    const location = useLocation();
    const queryParams = getQueryParams(location.search);
    const { t } = useTranslation();
    const language = t('app.language');
    
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
        mapDiv.setAttribute("rv-langs", attr["rv-langs"]);

        const rvMapPage = document.getElementById("rvMapPage");
        if (rvMapPage) {
            rvMapPage.prepend(mapDiv);
        }
    }
    useEffect(() => {
        
        const rvMap = document.getElementById("rvMap");
        if (!rvMap) {
            addMapDiv({"id": "rvMap", "is": "rv-map", "rv-langs": `["${language}-CA"]`});
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
            
    }, [language]);

    const rvConfig = {
        "language": language,
        /* "layers": [
        {
          "id": "powerplant100mw-electric",
          "name": "Electric Transmission Line",
          "layerType": "esriFeature",
          "metadataUrl": "http://csw.open.canada.ca/geonetwork/srv/csw?service=CSW&version=2.0.2&request=GetRecordById&outputSchema=csw:IsoRecord&ElementSetName=full&id=3a1eb6ef-6054-4f9d-b1f6-c30322cd7abf",
          "url": "http://geoappext.nrcan.gc.ca/arcgis/rest/services/NACEI/energy_infrastructure_of_north_america_en/MapServer/1"
        },] */
    };
    return (
        <div id="rvMapPage" className="mapPage">
            {/* <script src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>
            <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=default,Object.entries,Object.values,Array.prototype.find,Array.prototype.findIndex,Array.prototype.values,Array.prototype.includes,HTMLCanvasElement.prototype.toBlob,String.prototype.repeat,String.prototype.codePointAt,String.fromCodePoint,NodeList.prototype.@@iterator,Promise,Promise.prototype.finally"></script> */}
        </div>
    );
};
interface scriptAttr {
    id?: string; 
    scriptToAppend?:string;
    integrity?:string;
    crossorigin?:string;
}

interface mapAttr {
    "id": string; 
    "is": string;
    "rv-langs": string;
}
export default RampViewer;