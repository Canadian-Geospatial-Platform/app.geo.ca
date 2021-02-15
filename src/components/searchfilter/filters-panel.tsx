import React, { useContext } from "react";
import { Typography } from '@material-ui/core';
//import SearchIcon from '@material-ui/icons/Search';
import FilterIcon from '@material-ui/icons/Filter';

import PanelApp, {PanelProps} from '../appbar/panel';
import SearchFilter from './searchfilter';
import organisations from "../search/organisations.json";
import types from "../search/types.json";
import themes from "../search/themes.json";
import { useStateContext } from "../../globalstate/state";
import { setOrgFilter, setTypeFilter, setThemeFilter } from "../../globalstate/action";

export default function FilterPanel(props: PanelProps): JSX.Element {
    // TODO: access Leaflat map from custom component to use inside panel event
    // TODO: register and unregister events when panel open and close
    const { state, dispatch } = useStateContext(); 
    const orgfilters = state.orgfilter;
    const typefilters = state.typefilter;
    const themefilters = state.themefilter;
 //console.log(state, dispatch);
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
                            <SearchFilter filtertitle="Organisitions" filtervalues={organisations} filterselected={orgfilters} selectFilters={(ofilter:string[]) => (typeof dispatch ==='function') ? dispatch(setOrgFilter(ofilter)) : setOrgFilter(ofilter)} />
                            <SearchFilter filtertitle="Types" filtervalues={types} filterselected={typefilters} selectFilters={(tfilter:string[]) => (typeof dispatch ==='function') ? dispatch(setTypeFilter(tfilter)) : setTypeFilter(tfilter)} />
                            <SearchFilter filtertitle="Themes" filtervalues={themes} filterselected={themefilters} selectFilters={(thfilter:string[]) => (typeof dispatch ==='function') ? dispatch(setThemeFilter(thfilter)) : setThemeFilter(thfilter)} />
                        </div>
                    </Typography>
                ) as unknown) as Element
            }
        />
    );
}
