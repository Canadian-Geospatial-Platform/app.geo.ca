import React, { useEffect } from "react";
import { render } from 'react-dom';

import KeywordSearchIcon from '@material-ui/icons/Search';
//import SearchIcon from '@material-ui/icons/ImageSearch';

import { useMap } from 'react-leaflet';
import SearchPanel from '../../search/search-panel';
import ButtonApp from '../button';

export default function KeywordSearch(): JSX.Element {
    const map = useMap();
    const queryParams = {};
    const querySearch = window.location.href.split('?')[1];
    if (querySearch && querySearch.trim()!=='') {
        querySearch.trim().split('&').forEach( q=>{ 
            let item = q.split("=");
            queryParams[item[0]] = decodeURI(item[1]); 
        });
    }
    function handleclick() {
        // render(<SearchPanel map={map} />, map.getContainer().getElementsByClassName('cgp-apppanel')[0]);
        window.open("/#/search");
    }

    useEffect(()=>{
        if (queryParams && queryParams["keyword"]) {
            handleclick();
        }
    })
    return <ButtonApp tooltip="appbar.search" icon={<KeywordSearchIcon />} onClickFunction={handleclick} />;
}
