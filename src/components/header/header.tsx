import React, {useState} from 'react';
import {useLocation, useHistory} from 'react-router';
import i18n from '../../assests/i18n/i18n';
import { useTranslation } from 'react-i18next';

import logo from '../../assests/img/GeoDotCaBanner.jpg';
import './header.scss';

export default function Header(): JSX.Element {
    const history = useHistory();
    const { t } = useTranslation();
    const [langFromUrl, setLF] = useState(false);
    const location = useLocation();
    
    if (location && location.search && location.search!=='' && !langFromUrl) {
        location.search.substr(1).split('&').forEach( (q:string)=>{
            let item = q.split("=");
            if (item[0]==='lang' && i18n.language.substring(0,2) !== item[1]) {
                i18n.changeLanguage(item[1]+'-CA');
                setLF(true);
            }
        });
    }
    const changeLanguage = (lng: string) => {
        //(typeof dispatch ==='function') ? dispatch(setLanguage(lng)) : setLanguage(lng);
        i18n.changeLanguage(lng);
    }
    
    return (
        <header className="header">
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-3 header-logo-col">
                        <img src={logo} alt="" onClick={location.pathname==='/'?()=>history.go(0):()=>history.push('/')} />
                    </div>
                    <div className="col-9 header-nav-col">
                        <nav className="header-nav">
                            <ul className="list-group flex-row justify-content-end align-items-center menu-list">
                                <li className="list-group-item" onClick={location.pathname==='/'?()=>history.go(0):()=>history.push('/')}>{t('nav.home')}</li>
                                <li className="list-group-item" onClick={() => changeLanguage(t('nav.language.key'))}>{t('nav.language.name')}</li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}
