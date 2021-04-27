/* eslint-disable prettier/prettier */
import { Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/ImageSearch';

import PanelApp, {PanelProps} from '../appbar/panel';
import GeoSearch from './geosearch';

export default function SearchPanel(props: PanelProps): JSX.Element {
    // TODO: access Leaflat map from custom component to use inside panel event
    // TODO: register and unregister events when panel open and close
    const { showing, sf, closeFunction } = props;
    
    return (
        <PanelApp
            title="appbar.search"
            icon={<SearchIcon />}
            showing = {showing}
            closeFunction = {closeFunction}
            content={
                ((
                    <Typography variant="body2" color="textSecondary" component="div">
                        { GeoSearch(showing, sf, closeFunction) }
                    </Typography>
                ) as unknown) as Element
            }
        />
    );
}
