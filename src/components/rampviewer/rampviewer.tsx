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

    useEffect(() => {
        const rvScript = document.getElementById("rvJS");
        if (!rvScript) {
            appendScript({id: "rvJS", scriptToAppend: "/assests/js/rv-main.jsx" });
        }
    }, [language]);

    const rampVeiwerStyle = {
        display: "flex",
        width: "100%",
        height: "calc(100vh - 90px)"
    }
    return (
        <div className="mapPage">
            <div is="rv-map" style={rampVeiwerStyle} rv-langs='["en-CA", "fr-CA"]'></div>
            <script src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>
            <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=default,Object.entries,Object.values,Array.prototype.find,Array.prototype.findIndex,Array.prototype.values,Array.prototype.includes,HTMLCanvasElement.prototype.toBlob,String.prototype.repeat,String.prototype.codePointAt,String.fromCodePoint,NodeList.prototype.@@iterator,Promise,Promise.prototype.finally"></script>
        </div>
    );
};
interface scriptAttr {
    id?: string; 
    scriptToAppend?:string;
    integrity?:string;
    crossorigin?:string;
}
export default RampViewer;