/* eslint-disable prettier/prettier */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-alert */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useEffect } from 'react';
// import { useSelector } from "react-redux";
import { useLocation, useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { Collapse, Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import i18n from '../../assets/i18n/i18n';
import { loadState } from '../../reducers/localStorage';
import { setFilters } from '../../reducers/action';
import { getQueryParams } from '../../common/queryparams';
import MappingModal from '../modal/mappingmodal';
import organisations from '../search/organisations.json';
import types from '../search/types.json';
import themes from '../search/themes.json';
import { envglobals } from '../../common/envglobals';
import './header.scss';
// Reacstrap Collapse - Responsive Navbar

export default function Header(): JSX.Element {
    const history = useHistory();
    const location = useLocation();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const queryParams: { [key: string]: string } = getQueryParams(location.search);
    const [langFromUrl, setLF] = useState(false);
    const [collapse, setCollapse] = useState(false);
    const [showmappinglist, setSML] = useState(false);
    const [showmappingDemo, setSMD] = useState(false);
    const clanguage = t('app.language');
    
    const gotoHome = () => {
        setCollapse(false);
        if (location.pathname === '/' && !location.search) {
            if (clanguage==='en') {
                history.go(0);
            } else {
                window.location.href=`/?lang=${clanguage}`;
            }    
        } else {
            history.push({
                pathname: '/',
                search: '',
            });
        }
    };

    const showMapping = () => {
        const cmapping = loadState() !== undefined ? loadState().mappingReducer.mapping : [];
        const mcntButton = document.getElementById("mcntBtn");
        if (mcntButton) {
            mcntButton.innerText=cmapping.length.toString();
            mcntButton.className = cmapping.length>0 ? "show" : "hidden";
        }
    };

    /* const viewMyMap = () => {
        // const cmapping = loadState() !== undefined ? loadState().mappingReducer.mapping : [];
        // if (cmapping.length > 0) {
        if (location.pathname!=='/map' || queryParams.rvKey) {
            history.push({
                pathname: '/map',
                search: '',
            });
        }
        // } else {
        //    alert(t('nav.nomap'));
        // } 
    };

    const toggleML = () => {
        const cmapping = loadState() !== undefined ? loadState().mappingReducer.mapping : [];
        if (showmappinglist && cmapping.length > 0) {
            // viewMyMap();
        }
        setSML(!showmappinglist);
    } */
    // Reacstrap Collapse - Responsive Navbar
    const toggle = () => setCollapse(!collapse);
    // console.log(location.pathname);
     
    const rvScript = document.getElementById("rvJS");
    if (rvScript) {
        rvScript.remove();
    }
    const rvSVG = document.getElementsByTagName("svg");
    if (rvSVG.length>0) {
        for (const item of rvSVG) {
            if (item.id && item.id.indexOf("SvgjsSvg")===0) {
                item.remove();
            }
        }
    }

    useEffect(() => {
        if (!langFromUrl) {
           let clang:string = clanguage; 
           if (queryParams.lang !== undefined && clang !== queryParams.lang) {
               i18n.changeLanguage(`${queryParams.lang}-CA`);
               clang = queryParams.lang;
           }
           if (queryParams.org !== undefined || queryParams.type !== undefined || queryParams.theme !== undefined || queryParams.foundational !== undefined) {
                const oIndex = (queryParams.org!==undefined)?(organisations[clang] as string[]).findIndex((os: string) => os.toLowerCase() === queryParams.org.toLowerCase()) : -1;
                const tIndex = (queryParams.type!==undefined)?(types[clang] as string[]).findIndex((ts: string) => ts.toLowerCase() === queryParams.type.toLowerCase()) : -1;
                const thIndex = (queryParams.theme!==undefined)?(themes[clang] as string[]).findIndex((ths: string) => ths.toLowerCase() === queryParams.theme.toLowerCase()) : -1;
                const orgfilter = oIndex > -1 ? [oIndex] : [];
                const typefilter = tIndex > -1 ? [tIndex] : [];
                const themefilter = thIndex > -1 ? [thIndex] : [];
                dispatch(setFilters({ orgfilter, typefilter, themefilter, foundational: queryParams.foundational!==undefined && queryParams.foundational ==='y'}));
            } 
           setLF(true);
        }
        
        window.addEventListener('storage', showMapping);
        return () => {
            window.removeEventListener('storage', showMapping);
        }; 
        
    }, [dispatch, langFromUrl, queryParams.lang, queryParams.org, queryParams.theme, queryParams.type]);

    return (
        <header className="header">
            <MappingModal
                className="mapping-modal-dialog"
                wrapClassName="mapping-modal-wrap"
                modalClassName="mapping-modal"
                isTestDemo={showmappingDemo}
                openOnLoad={showmappinglist}
                toggle={()=>{setSML(!showmappinglist); setSMD(false)}}
                onClosed = {showMapping}
            />
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-12 header-nav-col">
                        <nav className="navbar navbar-light navbar-expand-lg header-nav">
                            <a href={envglobals().LOGO_SITE_LINK_URL[clanguage]} target="_blank" aria-label={t('nav.logoLinktext')}>
                                <img src="/assets/img/GeoDotCaBanner.jpg" alt={t('nav.logotext')} />
                            </a>
                            <Button
                                onClick={toggle}
                                id="toggler"
                                className="navbar-toggler"
                                type="button"
                                data-toggle="collapse"
                                aria-controls="navbar-menu"
                                aria-expanded={collapse}
                                aria-label="Toggle navigation"
                            >
                                <span className={collapse ? 'navbar-toggler-icon nav-bar-open' : 'navbar-toggler-icon nav-bar-closed'} />
                            </Button>

                            <Collapse isOpen={collapse} className="navbar-collapse navbar-wrap">
                                <ul className="navbar-nav ml-auto">
                                    <li className="nav-item">
                                        <button type="button" onClick={gotoHome}>
                                            {t('nav.search')}
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button id="myMapBtn" type="button" onClick={()=>setSML(true)}>
                                            {t('nav.mymap')}
                                        </button>
                                        <button id="mcntBtn" type="button" className={loadState() !== undefined && loadState().mappingReducer.mapping.length>0 ? "show" : "hidden"} onClick={()=>setSML(true)}>
                                            {loadState() !== undefined?loadState().mappingReducer.mapping.length:0}
                                        </button> 
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            type="button"
                                            lang={t('nav.language.htmllangcode')}
                                            onClick={() => i18n.changeLanguage(t('nav.language.key'))}
                                        >
                                            {t('nav.language.name')}
                                        </button>
                                    </li>
                                </ul>
                            </Collapse>
                            <button className="demo" type="button" onClick={()=>{setSMD(true); setSML(true)}}>MapDemo</button>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}
