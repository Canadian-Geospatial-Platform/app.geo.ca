/* eslint-disable prettier/prettier */
import { Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import PanelApp, {PanelProps} from '../appbar/panel';
import GeoSearch from './geosearch';

export default function SearchPanel(props: PanelProps): JSX.Element {
    // TODO: access Leaflat map from custom component to use inside panel event
    // TODO: register and unregister events when panel open and close
    const { showing, initKeyword, ksOnly, setKeyword, setKSOnly, closeFunction } = props;

    return (
        <PanelApp
            title="appbar.search"
            icon={<SearchIcon />}
            showing={showing}
            closeFunction={closeFunction}
            content={
                ((
                    <Typography variant="body2" color="textSecondary" component="div">
                        { GeoSearch(showing, ksOnly, setKeyword, setKSOnly, initKeyword, props.auth)}
                    </Typography>
                ) as unknown) as Element
            }
        />
    );
}
