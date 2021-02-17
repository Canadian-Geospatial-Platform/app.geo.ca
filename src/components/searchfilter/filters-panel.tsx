import React, { useState } from "react";
import { Typography } from '@material-ui/core';
//import SearchIcon from '@material-ui/icons/Search';
import FilterIcon from '@material-ui/icons/Filter';

import PanelApp, {PanelProps} from '../appbar/panel';
import SearchFilter from './searchfilter';
import organisations from "../search/organisations.json";
import types from "../search/types.json";
import themes from "../search/themes.json";
import { useStateContext } from "../../globalstate/state";
import { setOrgFilter, setTypeFilter, setThemeFilter, setFoundational } from "../../globalstate/action";

export default function FilterPanel(props: PanelProps): JSX.Element {
    // TODO: access Leaflat map from custom component to use inside panel event
    // TODO: register and unregister events when panel open and close
    const { state, dispatch } = useStateContext(); 
    const [orgfilters, setOrg] = useState(state.orgfilter);
    const [typefilters, setType] = useState(state.typefilter);
    const [themefilters, setTheme] = useState(state.themefilter);
    const [foundational, setFound] = useState(state.foundational);
    const [fReset, setFReset] = useState(false);
 //console.log(state, dispatch);
    const applyFilters = () => {
        if (typeof dispatch ==='function') {
            dispatch(setOrgFilter(orgfilters));
            dispatch(setTypeFilter(typefilters));
            dispatch(setThemeFilter(themefilters));
            dispatch(setFoundational(foundational));
        } 
        setFReset(false);
    }
    const clearAll = () => {
        setOrg([]);
        setType([]);
        setTheme([]);
        setFound(false);
        if (typeof dispatch ==='function') {
            dispatch(setOrgFilter([]));
            dispatch(setTypeFilter([]));
            dispatch(setThemeFilter([]));
            dispatch(setFoundational(false));
        } 
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
            showing = {props.showing}
            closeFunction = {props.closeFunction}
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
                            <button className={fReset?"btn searchButton submit":"btn searchButton submit disabled"} onClick={fReset?applyFilters:undefined}>Apply Filters</button>
                                <button className="btn searchButton clear" onClick={clearAll}>Clear All</button>
                            </div>
                        </div>
                    </Typography>
                ) as unknown) as Element
            }
        />
    );
}
