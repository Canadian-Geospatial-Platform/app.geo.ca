import { Typography } from '@material-ui/core';
import AccountIcon from '@material-ui/icons/AccountBox';

import PanelApp, {PanelProps} from '../appbar/panel';
import Dashboard from './cognito-auth/Dashboard';

export default function AccountPanel(props: PanelProps): JSX.Element {
    // TODO: access Leaflat map from custom component to use inside panel event
    // TODO: register and unregister events when panel open and close
    return (
        <PanelApp
            title="appbar.account"
            icon={<AccountIcon />}
            showing = {props.showing}
            closeFunction = {props.closeFunction}
            content={
                ((
                    <Typography variant="body2" color="textSecondary" component="p">
                        <Dashboard />
                    </Typography>
                ) as unknown) as Element
            }
        />
    );
}
