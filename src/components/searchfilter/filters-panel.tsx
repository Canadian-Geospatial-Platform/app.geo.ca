/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { useDispatch, useSelector} from "react-redux";
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
    const storeorgfilters = useSelector(state => state.mappingReducer.orgfilter);
    const storetypefilters = useSelector(state => state.mappingReducer.typefilter);
    const storethemefilters = useSelector(state => state.mappingReducer.themefilter);
    const storefoundational = useSelector(state => state.mappingReducer.foundational);
    const dispatch = useDispatch(); 
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

    const handleOrg = (filters: string[]) => {
        setFReset(true);
        setOrg(filters);
    };

    const handleType = (filters: string[]) => {
        setFReset(true);
        setType(filters);
    };

    const handleTheme = (filters: string[]) => {
        setFReset(true);
        setTheme(filters);
    };

    const handleFound = (found: boolean) => {
        setFReset(true);
        setFound(found);
    };

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
                            <h2>Filter By:</h2>
                            <SearchFilter filtertitle="Organisations" filtervalues={organisations} filterselected={orgfilters} selectFilters={handleOrg} />
                            <SearchFilter filtertitle="Types" filtervalues={types} filterselected={typefilters} selectFilters={handleType} />
                            <SearchFilter filtertitle="Themes" filtervalues={themes} filterselected={themefilters} selectFilters={handleTheme} />
                            <SearchFilter filtertitle="Foundational Layers Only" filtervalues={[]} filterselected={foundational?["true"]:[]} selectFilters={handleFound} />
                            <div className="filterAction">
                                <button type="button" className={fReset?"btn searchButton submit":"btn searchButton submit disabled"} onClick={fReset?applyFilters:undefined}>Apply Filters</button>
                                <button type="button" className="btn searchButton clear" onClick={clearAll}>Clear All</button>
                            </div>
                        </div>
                    </Typography>
                ) as unknown) as Element
            }
        />
    );
}
