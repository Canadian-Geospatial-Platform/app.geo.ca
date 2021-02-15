import { Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/ImageSearch';

import PanelApp, {PanelProps} from '../appbar/panel';
import GeoSearch from './geosearch';

export default function SearchPanel(props: PanelProps): JSX.Element {
    // TODO: access Leaflat map from custom component to use inside panel event
    // TODO: register and unregister events when panel open and close
    //const {map} = props;

    return (
        <PanelApp
            title="appbar.search"
            icon={<SearchIcon />}
            showing = {props.showing}
            closeFunction = {props.closeFunction}
            content={
                ((
                    <Typography variant="body2" color="textSecondary" component="div">
                        <GeoSearch />
                    </Typography>
                ) as unknown) as Element
            }
        />
    );
}
