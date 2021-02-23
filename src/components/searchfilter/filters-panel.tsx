/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector} from "react-redux";
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
// import SearchIcon from '@material-ui/icons/Search';
import FilterIcon from '@material-ui/icons/Filter';

import PanelApp, {PanelProps} from '../appbar/panel';
import SearchFilter from './searchfilter';
import organisations from "../search/organisations.json";
import types from "../search/types.json";
import themes from "../search/themes.json";
import { setFilters } from "../../reducers/action";

export default function FilterPanel(props: PanelProps): JSX.Element {
    const { showing, closeFunction } = props;
    const { t } = useTranslation();
    const storeorgfilters = useSelector(state => state.mappingReducer.orgfilter);
    const storetypefilters = useSelector(state => state.mappingReducer.typefilter);
    const storethemefilters = useSelector(state => state.mappingReducer.themefilter);
    const storefoundational = useSelector(state => state.mappingReducer.foundational);
    const dispatch = useDispatch(); 
    const language = t("app.language");
    const [orgfilters, setOrg] = useState(storeorgfilters);
    const [typefilters, setType] = useState(storetypefilters);
    const [themefilters, setTheme] = useState(storethemefilters);
    const [foundational, setFound] = useState(storefoundational);
    const [fReset, setFReset] = useState(false);
 // console.log(state, dispatch);
    const applyFilters = () => {
        dispatch(setFilters({ orgfilter: orgfilters, typefilter: typefilters, themefilter: themefilters, foundational }));
        setFReset(false);
    }
    const clearAll = () => {
        setOrg([]);
        setType([]);
        setTheme([]);
        setFound(false);
        dispatch(setFilters({ orgfilter: [], typefilter: [], themefilter: [], foundational: false }));
        setFReset(false);
    }

    const handleOrg = (filters:unknown):void => {
        setFReset(true);
        setOrg(filters);
    };

    const handleType = (filters:unknown):void => {
        setFReset(true);
        setType(filters);
    };

    const handleTheme = (filters:unknown):void => {
        setFReset(true);
        setTheme(filters);
    };

    const handleFound = (found:unknown):void => {
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
            showing = {showing}
            closeFunction = {closeFunction}
            content={
                ((
                    <Typography variant="body2" color="textSecondary" component="div">
                        <div className="searchFilters">
                            <h2>{t("filter.filterby")}:</h2>
                            <SearchFilter filtertitle={t("filter.organisations")} filtervalues={organisations[language]} filterselected={orgfilters} selectFilters={handleOrg} />
                            <SearchFilter filtertitle={t("filter.types")} filtervalues={types[language]} filterselected={typefilters} selectFilters={handleType} />
                            <SearchFilter filtertitle={t("filter.themes")} filtervalues={themes[language]} filterselected={themefilters} selectFilters={handleTheme} />
                            <SearchFilter filtertitle={t("filter.foundational")} filtervalues={[]} filterselected={foundational?[1]:[]} selectFilters={handleFound} />
                            <div className="filterAction">
                                <button type="button" className={fReset?"btn searchButton submit":"btn searchButton submit disabled"} onClick={fReset?applyFilters:undefined}>{t("filter.applyfilters")}</button>
                                <button type="button" className="btn searchButton clear" onClick={clearAll}>{t("filter.clearall")}</button>
                            </div>
                        </div>
                    </Typography>
                ) as unknown) as Element
            }
        />
    );
}
