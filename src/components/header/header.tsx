/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState } from 'react';
// import { useSelector } from "react-redux";
import { StoreEnhancer } from 'redux';
import { useLocation, useHistory } from 'react-router';
import { Collapse, Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import i18n from '../../assests/i18n/i18n';
import { loadState } from '../../reducers/localStorage';
import logo from '../../assests/img/GeoDotCaBanner.jpg';
import { getQueryParams } from '../../common/queryparams';
import './header.scss';
// Reacstrap Collapse - Responsive Navbar


export default function Header(): JSX.Element {
    const history = useHistory();
    const { t } = useTranslation();
    const [langFromUrl, setLF] = useState(false);
    const [collapse, setCollapse] = useState(false);
    const location = useLocation();
    const queryParams: { [key: string]: string } = getQueryParams(location.search);
    if (!langFromUrl && queryParams.lang !== undefined && i18n.language.substring(0, 2) !== queryParams.lang) {
        i18n.changeLanguage(`${queryParams.lang}-CA`);
        setLF(true);
    }
    // const mapping = useSelector(state => state.mappingReducer.mapping);

    const gotoHome = () => {
        setCollapse(false);
        if (location.pathname === '/' && !location.search) {
            history.go(0);
        } else {
            history.push({
                pathname: '/',
                search: '',
            });
        }
    };

    const viewMyMap = () => {
        const localState: StoreEnhancer<unknown, unknown> | undefined = loadState();
        const mapping = localState !== undefined ? localState.mappingReducer.mapping : [];
        // console.log(mapping);
        if (mapping.length > 0) {
            window.open(
                `https://viewer-visualiseur-dev.services.geo.ca/fgpv-vpgf/index-${t('app.language')}.html?keys=${encodeURI(
                    mapping.join(',')
                )}`,
                `View MyMap`
            );
        } else {
            alert(t('nav.nomap'));
        }
    };

    // Reacstrap Collapse - Responsive Navbar
    const toggle = () => setCollapse(!collapse);

    return (
        <header className="header">
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-12 header-nav-col">
                        <nav className="navbar navbar-light navbar-expand-lg header-nav">
                            <a href="http://wp-01-1130072660.ca-central-1.elb.amazonaws.com/" target="_blank">
                                <img src={logo} alt="" />
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
                                <span
                                    className={collapse ? 'navbar-toggler-icon nav-bar-open' : 'navbar-toggler-icon nav-bar-closed'}
                                ></span>
                            </Button>

                            <Collapse isOpen={collapse} className="navbar-collapse navbar-wrap">
                                <ul className="navbar-nav ml-auto">
                                    <li className="nav-item">
                                        <button type="button" onClick={gotoHome}>
                                            {t('nav.search')}
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button type="button" onClick={viewMyMap}>
                                            {t('nav.mymap')}
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button type="button" onClick={() => i18n.changeLanguage(t('nav.language.key'))}>
                                            {t('nav.language.name')}
                                        </button>
                                    </li>
                                </ul>
                            </Collapse>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}
