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
 //console.log(state, dispatch);
    const applyFilters = () => {
        if (typeof dispatch ==='function') {
            dispatch(setOrgFilter(orgfilters));
            dispatch(setTypeFilter(typefilters));
            dispatch(setThemeFilter(themefilters));
            dispatch(setFoundational(foundational));
        } 
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
    }
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
                            <SearchFilter filtertitle="Organisitions" filtervalues={organisations} filterselected={orgfilters} selectFilters={setOrg} />
                            <SearchFilter filtertitle="Types" filtervalues={types} filterselected={typefilters} selectFilters={setType} />
                            <SearchFilter filtertitle="Themes" filtervalues={themes} filterselected={themefilters} selectFilters={setTheme} />
                            <SearchFilter filtertitle="Foundational" filtervalues={[]} filterselected={foundational?["true"]:[]} selectFilters={setFound} />
                            <div className="filterAction">
                                <button className="btn searchButton submit" onClick={applyFilters}>Apply Filters</button>
                                <button className="btn searchButton clear" onClick={clearAll}>Clear All</button>
                            </div>
                        </div>
                    </Typography>
                ) as unknown) as Element
            }
        />
    );
}
