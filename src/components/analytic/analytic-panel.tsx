/* eslint-disable prettier/prettier */
import { useTranslation } from 'react-i18next';
import { Typography, SvgIcon } from '@material-ui/core';
import AnalyticIcon from '../../assets/icons/analytic.svg';

import PanelApp, { PanelProps } from '../appbar/panel';
import Analytic from './analytic';

export default function AnalyticPanel(props: PanelProps): JSX.Element {
    const { showing, analyticOrg, setAnalyticOrg, closeFunction } = props;
    const { t } = useTranslation();

    return (
        <PanelApp
            title="appbar.analytics"
            icon={<SvgIcon><AnalyticIcon /></SvgIcon>}
            showing={showing}
            closeFunction={closeFunction}
            content={
                ((
                    <Typography variant="body2" color="textSecondary" component="div">
                        { Analytic({analyticOrg, setAnalyticOrg}) }
                    </Typography>
                ) as unknown) as Element
            }
        />
    );
}
