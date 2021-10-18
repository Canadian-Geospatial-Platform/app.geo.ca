/* eslint-disable prettier/prettier */
import { useTranslation } from 'react-i18next';
import { Typography, SvgIcon } from '@material-ui/core';
import AnalyticIcon from '../../assets/icons/analytic.svg';

import PanelApp, { PanelProps } from '../appbar/panel';

export default function AnalyticPanel(props: PanelProps): JSX.Element {
    const { showing, closeFunction } = props;
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
                        <p>{t('analytic.title')}</p>
                    </Typography>
                ) as unknown) as Element
            }
        />
    );
}
