import React, { useContext } from "react";
import { Typography } from '@material-ui/core';
//import SearchIcon from '@material-ui/icons/Search';
import FilterIcon from '@material-ui/icons/Filter';

import PanelApp from '../appbar/panel';
import SearchFilter from './searchfilter';
import organisations from "../search/organisations.json";
import types from "../search/types.json";
import { useStateContext } from "../../globalstate/state";
import { setOrgFilter, setTypeFilter } from "../../globalstate/action";

export default function FilterPanel(): JSX.Element {
    // TODO: access Leaflat map from custom component to use inside panel event
    // TODO: register and unregister events when panel open and close
    const { state, dispatch } = useStateContext(); 
    const orgfilters = state.orgfilter;
    const typefilters = state.typefilter;
 //console.log(state, dispatch);
    return (
        <PanelApp
            title="appbar.filters"
            icon={<FilterIcon />}
            content={
                ((
                    <Typography variant="body2" color="textSecondary" component="div">
                        <div className="searchFilters">
                            <SearchFilter filtertitle="Organisitions" filtervalues={organisations} filterselected={orgfilters} selectFilters={(ofilter:string) => setOrgFilter(ofilter)} />
                            <SearchFilter filtertitle="Types" filtervalues={types} filterselected={typefilters} selectFilters={(tfilter:string) => setTypeFilter(tfilter)} />
                        </div>
                    </Typography>
                ) as unknown) as Element
            }
        />
    );
}
