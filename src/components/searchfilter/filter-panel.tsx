import React, { useState } from "react";
import { Typography } from '@material-ui/core';
//import SearchIcon from '@material-ui/icons/Search';
import FilterIcon from '@material-ui/icons/filter';

import PanelApp from '../appbar/panel';
import SearchFilter from './searchfilter';
import organisations from "../search/organisations.json";
import types from "../search/types.json";

export default function FilterPanel(props: SearchProps): JSX.Element {
    // TODO: access Leaflat map from custom component to use inside panel event
    // TODO: register and unregister events when panel open and close
    const [orgfilters, setOrg] = useState("");
    const [typefilters, setType] = useState("");

    return (
        <PanelApp
            title="appbar.filters"
            icon={<FilterIcon />}
            content={
                ((
                    <Typography variant="body2" color="textSecondary" component="div">
                        <div className="searchFilters">
                            <SearchFilter filtertitle="Organisitions" filtervalues={organisations} filterselected={orgfilters} selectFilters={setOrg} />
                            <SearchFilter filtertitle="Types" filtervalues={types} filterselected={typefilters} selectFilters={setType} />
                        </div>
                    </Typography>
                ) as unknown) as Element
            }
        />
    );
}
interface SearchProps {
    map: React.ReactNode
}
