import { Typography } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';

import PanelApp, {PanelProps} from '../appbar/panel';
import Dashboard from './dashboard';
// import Dashboard from './cognito-auth/Dashboard';

export default function DashnoardPanel(props: PanelProps): JSX.Element {
    // TODO: access Leaflat map from custom component to use inside panel event
    // TODO: register and unregister events when panel open and close
    const { showing, closeFunction } = props;
    // const { t } = useTranslation();
    return (
        <PanelApp
            title="dashboard.title"
            icon={<DashboardIcon />}
            showing = {showing}
            closeFunction = {closeFunction}
            content={
                ((
                    <Dashboard />
                ) as unknown) as Element
            }
        />
    );
}
