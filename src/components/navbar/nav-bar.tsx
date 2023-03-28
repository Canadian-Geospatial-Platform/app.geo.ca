
import { useTranslation } from 'react-i18next';

import { ButtonGroup } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import ZoomIn from './buttons/zoom-in';
import ZoomOut from './buttons/zoom-out';
import Fullscreen from './buttons/fullscreen';
import Home from './buttons/home';

import { LEAFLET_POSITION_CLASSES } from '../../common/constant';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
        '& .MuiButtonGroup-vertical': {
            width: '32px',
            '& button': {
                minWidth: '32px',
            },
        },
        position: 'relative',
        flexDirection: 'column',
        bottom: '30px',
        pointerEvents: 'auto',
    }
}));
export interface NavBarProps {
    excludeFullHome?: boolean;
}
export function NavBar(props: NavBarProps): JSX.Element {
    const { excludeFullHome } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <div className={LEAFLET_POSITION_CLASSES.bottomright}>
            <div className={classes.root}>
                <ButtonGroup orientation="vertical" aria-label={t('mapnav.ariaNavbar')} variant="contained">
                    <ZoomIn />
                    <ZoomOut />
                </ButtonGroup>
                {!excludeFullHome &&
                    <ButtonGroup orientation="vertical" aria-label={t('mapnav.ariaNavbar', '')} variant="contained">
                        <Fullscreen />
                        <Home />
                    </ButtonGroup>
                }
            </div>
        </div>
    );
}
