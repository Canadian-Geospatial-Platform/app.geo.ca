/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState } from 'react';
import {useLocation, useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import i18n from '../../assests/i18n/i18n';
import logo from '../../assests/img/GeoDotCaBanner.jpg';
import { getQueryParams } from '../../common/queryparams';
import './header.scss';

export default function Header(): JSX.Element {
    const history = useHistory();
    const { t } = useTranslation();
    const [langFromUrl, setLF] = useState(false);
    const location = useLocation();
    const queryParams: { [key: string]: string }  = getQueryParams(location.search);
    if (!langFromUrl && queryParams.lang!==undefined && i18n.language.substring(0,2) !== queryParams.lang) {
        i18n.changeLanguage( `${queryParams.lang}-CA` );
        setLF(true);
    }
    const gotoHome = () => {
        if (location.pathname==='/' && queryParams.keyword===undefined) {
            history.go(0);
        } else {
            history.push({
                pathname: '/',
                search: ''
            });
        }
    }

    return (
        <header className="header">
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-3 header-logo-col">
                        <a href="http://3.97.100.83" target="_blank"><img src={logo} alt="" /></a>
                    </div>
                    <div className="col-9 header-nav-col">
                        <nav className="header-nav">
                            <ul className="list-group flex-row justify-content-end align-items-center menu-list">
                                <li className="list-group-item" onClick={gotoHome}>{t('nav.home')}</li>
                                <li className="list-group-item" onClick={() => i18n.changeLanguage(t('nav.language.key'))}>{t('nav.language.name')}</li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}
