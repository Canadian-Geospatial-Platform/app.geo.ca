import React, { useEffect } from "react";
import { render } from 'react-dom';

import KeywordSearchIcon from '@material-ui/icons/Search';
//import SearchIcon from '@material-ui/icons/ImageSearch';

import ButtonApp from '../button';

export default function KeywordSearch(): JSX.Element {
    const querySearch = window.location.href.split('?')[1];
    
    function handleclick() {
        const url = "/search" + (querySearch!==undefined && querySearch!==''?"?"+querySearch : "");
        window.open(url, '_self');
    }

    return <ButtonApp tooltip="appbar.keywordsearch" icon={<KeywordSearchIcon />} onClickFunction={handleclick} />;
}
