import { Typography } from '@material-ui/core';
import AccountIcon from '@material-ui/icons/AccountBox';

import PanelApp, {PanelProps} from '../appbar/panel';
// import Dashboard from './cognito-auth/Dashboard';

export default function AccountPanel(props: PanelProps): JSX.Element {
    // TODO: access Leaflat map from custom component to use inside panel event
    // TODO: register and unregister events when panel open and close
    const { showing, closeFunction } = props;
    // const { t } = useTranslation();
    return (
        <PanelApp
            title="appbar.account"
            icon={<AccountIcon />}
            showing = {showing}
            closeFunction = {closeFunction}
            content={
                ((
                    <Typography variant="body2" color="textSecondary" component="p">
                        Account
                    </Typography>
                ) as unknown) as Element
            }
        />
    );
}
