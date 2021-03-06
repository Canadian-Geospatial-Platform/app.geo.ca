/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import FilterIcon from '@material-ui/icons/Filter';

import PanelApp, { PanelProps } from '../appbar/panel';
import SearchFilter from './searchfilter';
import organisations from '../search/organisations.json';
import types from '../search/types.json';
import themes from '../search/themes.json';
import { setFilters } from '../../reducers/action';

export default function FilterPanel(props: PanelProps): JSX.Element {
    const { showing, closeFunction } = props;
    const { t } = useTranslation();
    const storeorgfilters = useSelector((state) => state.mappingReducer.orgfilter);
    const storetypefilters = useSelector((state) => state.mappingReducer.typefilter);
    const storethemefilters = useSelector((state) => state.mappingReducer.themefilter);
    const storefoundational = useSelector((state) => state.mappingReducer.foundational);
    const dispatch = useDispatch();
    const language = t('app.language');
    const [orgfilters, setOrg] = useState(storeorgfilters);
    const [typefilters, setType] = useState(storetypefilters);
    const [themefilters, setTheme] = useState(storethemefilters);
    const [foundational, setFound] = useState(storefoundational);
    const [fReset, setFReset] = useState(false);
    const [ofOpen, setOfOpen] = useState(false);
    // console.log(state, dispatch);
    const applyFilters = () => {
        dispatch(setFilters({ orgfilter: orgfilters, typefilter: typefilters, themefilter: themefilters, foundational }));
        setFReset(false);
    };
    const clearAll = () => {
        setOrg([]);
        setType([]);
        setTheme([]);
        setFound(false);
        dispatch(setFilters({ orgfilter: [], typefilter: [], themefilter: [], foundational: false }));
        setFReset(false);
    };

    const handleOrg = (filters: unknown): void => {
        setFReset(true);
        setOrg(filters);
    };

    const handleType = (filters: unknown): void => {
        setFReset(true);
        setType(filters);
    };

    const handleTheme = (filters: unknown): void => {
        setFReset(true);
        setTheme(filters);
    };

    const handleFound = (found: unknown): void => {
        setFReset(true);
        setFound(found);
    };

    useEffect(() => {
        // const filteractive = (themefilters.length>0 || orgfilters.length > 0 || typefilters.length > 0);
        if (showing) {
            setOrg(storeorgfilters);
            setType(storetypefilters);
            setTheme(storethemefilters);
            setFound(storefoundational);
            setFReset(false);
        }
    }, [showing, language]);

    return (
        <PanelApp
            title="appbar.filters"
            icon={<FilterIcon />}
            showing={showing}
            closeFunction={closeFunction}
            content={
                ((
                    <Typography variant="body2" color="textSecondary" component="div">
                        <div className="container-fluid container-filter-selection small-panel">
                            <div className="row row-filters">
                                <h2 className="filters-title">{t('filter.filterby')}:</h2>
                                <div className="filters-wrap">
                                    <SearchFilter
                                        filtertitle={t('filter.organisations')}
                                        filtervalues={organisations[language]}
                                        filterselected={orgfilters}
                                        selectFilters={handleOrg}
                                    />
                                    <SearchFilter
                                        filtertitle={t('filter.types')}
                                        filtervalues={types[language]}
                                        filterselected={typefilters}
                                        selectFilters={handleType}
                                    />
                                    <SearchFilter
                                        filtertitle={t('filter.themes')}
                                        filtervalues={themes[language]}
                                        filterselected={themefilters}
                                        selectFilters={handleTheme}
                                    />
                                    <div className={ofOpen ? 'filter-wrap open' : 'filter-wrap'}>
                                        <button type="button" className="link-button filter-title" onClick={() => setOfOpen(!ofOpen)}>
                                            {t('filter.otherfilters')}
                                        </button>
                                        <SearchFilter
                                            filtertitle={t('filter.foundational')}
                                            filtervalues={[]}
                                            filterselected={foundational ? [1] : []}
                                            selectFilters={handleFound}
                                        />
                                    </div>
                                    <div className="filter-actions d-flex justify-content-end">
                                        <button
                                            type="button"
                                            className={fReset ? 'btn search-btn submit' : 'btn search-btn submit disabled'}
                                            onClick={fReset ? applyFilters : undefined}
                                        >
                                            {t('filter.applyfilters')}
                                        </button>
                                        <button type="button" className="btn search-btn clear" onClick={clearAll}>
                                            {t('filter.clearall')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Typography>
                ) as unknown) as Element
            }
        />
    );
}
