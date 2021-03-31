/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, createRef, useEffect, ChangeEvent } from 'react';
import { useLocation, useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
// import SearchIcon from '@material-ui/icons/Search';
// import FilterIcon from '@material-ui/icons/Filter';
// import axios from 'axios';
// import BeatLoader from 'react-spinners/BeatLoader';
import { getQueryParams } from '../../common/queryparams';
// import { css } from '@emotion/core';
//import './keywordsearch.scss';

const RampViewer: React.FunctionComponent = () => {
    const location = useLocation();
    const queryParams: { [key: string]: string } = getQueryParams(location.search);
    const history = useHistory();
    const { t } = useTranslation();
    // const rpp = 10;
    // const [sfloaded, setSF] = useState(false);
    // const [loading, setLoading] = useState(false); 

    // const [initKeyword, setKeyword] = useState(queryParams && queryParams.keyword ? queryParams.keyword.trim() : '');
    // const store = useStore();    
    // const storefoundational = useSelector((state) => state.mappingReducer.foundational);
    const dispatch = useDispatch();    
    // const [foundational, setFound] = useState(storefoundational);
    // const [fReset, setFReset] = useState(false);    
    // const [ofOpen, setOfOpen] = useState(false);
    const language = t('app.language');

    const inputRef: React.RefObject<HTMLInputElement> = createRef();

    // console.log(state, dispatch);

    useEffect(() => {
        // Add state change handling        
    }, [language, dispatch]);


    return (
        <div className="pageContainer keyword-search-page">
            {/* Filters / Search Bar */}
            <div className="container-fluid container-search">
                <div className="row row-search align-items-center">
                    {/* Add some information here */}
                </div>
            </div>           
            
            {/* Need to debug following cv config on AWS serve after consulting with Johann */}        
            {/* <div 
                    id="fgpmap" 
                    is="rv-map" 
                    rv-plugins="coordInfo" 
                    class="fgpMap ng-scope rv-short rv-large" 
                    rv-config="/fgpv-vpgf/config/canada-world-en.json" 
                    rv-langs="['en-CA']" 
                    rv-service-endpoint="https://rcs.open.canada.ca" 
                    data-rv-keys="" 
                    rv-wait="true" 
                    rv-trap-focus="fgpmap" 
                    lang="en" 
                    rv-focus-status="ACTIVE" 
                    style="height: 266px;">
            </div> */}
            
            
        </div>
    );
};


export default RampViewer;
