import { Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import PanelApp from '../appbar/panel';
import GeoSearch from './geosearch';

export default function SearchPanel(props: SearchProps): JSX.Element {
    // TODO: access Leaflat map from custom component to use inside panel event
    // TODO: register and unregister events when panel open and close
    const {bounds, selectResult} = props;
    
    return (
        <PanelApp
            title={'appbar.search'}
            icon={<SearchIcon />}
            content={
                ((
                    <Typography variant="body2" color="textSecondary" component="div">
                        <GeoSearch bounds={bounds} selectResult={selectResult} />
                    </Typography>
                ) as unknown) as Element
            }
        />
    );
}

interface SearchProps {
    bounds: React.ReactNode,
    selectResult: Function
}