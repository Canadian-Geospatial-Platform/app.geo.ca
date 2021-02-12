import React, { useEffect } from "react";
import { render } from 'react-dom';

//import SearchIcon from '@material-ui/icons/Search';
import SearchIcon from '@material-ui/icons/ImageSearch';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import { useMap } from 'react-leaflet';
import HowtoPanel from '../../howto/howto-panel';
import ButtonApp from '../button';

export default function Howto(): JSX.Element {
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
        render(<HowtoPanel map={map} />, map.getContainer().getElementsByClassName('cgp-apppanel')[0]);
    }

    useEffect(()=>{
        if (queryParams && queryParams["howto"]) {
            handleclick();
        }
    })
    return <ButtonApp tooltip="appbar.howto" icon={<HelpOutlineIcon />} onClickFunction={handleclick} />;
}
