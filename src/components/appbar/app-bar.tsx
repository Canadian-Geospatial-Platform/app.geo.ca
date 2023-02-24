/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
import { useState, useRef, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router';
// import { useDispatch } from 'react-redux';

import { useTranslation } from 'react-i18next';
import { useMap } from 'react-leaflet';
import { DomEvent } from 'leaflet';

import { makeStyles } from '@material-ui/core/styles';
import { Drawer, List, Divider, IconButton, Tooltip, Fade } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import SvgIcon from "@material-ui/core/SvgIcon";
// import SearchIcon from '@material-ui/icons/ImageSearch';
import SearchIcon from '@material-ui/icons/Search';
import AccountIcon from '@material-ui/icons/AccountBox';
import FilterIcon from '../../assets/icons/filter.svg';
import AnalyticIcon from '../../assets/icons/analytic.svg';

import { Basemap, BasemapOptions } from '../../common/basemap';
import ButtonApp from './button';
import Version from './buttons/version';
import { getQueryParams } from '../../common/queryparams';
import SearchPanel from '../search/search-panel';
import FiltersPanel from '../searchfilter/filters-panel';
import AnalyticPanel from '../analytic/analytic-panel';
import DashboardPanel from '../dashboard/dashboard-panel';
import HowtoPanel from '../howto/howto-panel';
import './app-bar.scss';

const drawerWidth = 200;
const drawerWidthFull = '100vw';

const useStyles = (panel: string) => makeStyles((theme) => ({
    root: {
        display: 'flex',
        height: panel==='analytic'? 'calc( 100vh - 91px )' : '100%',
        width: panel==='ks' ? '100vw':'60px',
        border: '2px solid rgba(0, 0, 0, 0.2)',
        transition: '.4s',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        [theme.breakpoints.down('sm')]: {
            width: drawerWidthFull,
        },
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflow: 'hidden',
        width: panel==='ks' ?'0':'61px',
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        height: '48px',
    },
    spacer: {
        flexGrow: 1,
        backgroundColor: 'white',
    },
    githubSection: {
        paddingBottom: '12px',
    },
}));

export function Appbar(props: AppBarProps): JSX.Element {
    const { search, auth } = props;
    const { t } = useTranslation();
    // const history = useHistory();
    const location = useLocation();
    // const dispatch = useDispatch();
    const queryParams: { [key: string]: string } = getQueryParams(location.search);
    const [initKeyword, setKeyword] = useState( queryParams && queryParams.keyword ? queryParams.keyword.trim().replaceAll('+', ' ') : '');
    const [analyticOrg, setAnalyticOrg] = useState(-1);
    const [open, setOpen] = useState(false);
    const [ksOnly, setKSOnly] = useState(queryParams.ksonly !== undefined);
    const [panel, setPanel] = useState(
        (queryParams.keyword !== undefined ||
            queryParams.ksonly !== undefined ||
            queryParams.org !== undefined ||
            queryParams.type !== undefined ||
            queryParams.foundational !== undefined ||
            queryParams.theme !== undefined) ? ' search' :
            (queryParams.analytic !== undefined?' analytics':'')
    );
    const classes = useStyles(ksOnly?'ks':(panel===' analytics'?'analytic':''))();
    const language = t('app.language');
    const appBar = useRef();
    const map = useMap();
    useEffect(() => {
        // disable events on container
        DomEvent.disableClickPropagation(appBar.current.children[0] as HTMLElement);
        DomEvent.disableScrollPropagation(appBar.current.children[0] as HTMLElement);
    }, []);

    useEffect(() => {
        const basemap: Basemap = new Basemap(`${language}-CA`);
        const basemaps: BasemapOptions[] = basemap.wmCBMT;
        map.eachLayer((layer: unknown) => {
            // console.log(layer);
            map.removeLayer(layer);
        });
        basemaps.forEach(base=>{
            L.tileLayer(base.url).addTo(map);
        })

    }, [language, map]);

    const handleDrawerClose = () => {
        setOpen(!open);
    };

    /* const gotoKeywordSearch = () => {
        history.push({
            pathname: '/search',
            search: initKeyword !== '' ? `keyword=${initKeyword}` : '',
        });
    }; */

    useEffect(() => {
        setPanel(
            (queryParams.keyword !== undefined ||
                queryParams.ksonly !== undefined ||
                queryParams.org !== undefined ||
                queryParams.type !== undefined ||
                queryParams.foundational !== undefined ||
                queryParams.theme !== undefined) ? ' search' :
                (queryParams.analytic !== undefined?' analytics':'')
        );
        setKSOnly(queryParams.ksonly !== undefined);
    }, [queryParams.keyword, queryParams.ksonly, queryParams.org, queryParams.type, queryParams.theme, queryParams.foundational, queryParams.analytic]);

    useEffect(() => {
        const appBarEl = document.getElementById("app-left-bar");
        if (panel === ' analytics') {
            appBarEl.classList.add("analytic-show");
        } else {
            appBarEl.classList.remove("analytic-show");
        }

        if (ksOnly) {
            appBarEl.classList.add("kso-show");
        } else {
            appBarEl.classList.remove("kso-show");
        }
        // document.getElementById("app-left-bar").classList.add("test");
    }, [panel, ksOnly]);

    return (
        <div className={classes.root} ref={appBar}>
            <Drawer
                variant="permanent"
                className={open && panel === '' ? classes.drawerOpen : classes.drawerClose}
                classes={{ paper: open && panel === '' ? classes.drawerOpen : classes.drawerClose }}
            >
                <div className={classes.toolbar}>
                    { panel === '' &&
                        <Tooltip title={t('appbar.drawer')} placement="right" TransitionComponent={Fade}>
                            <IconButton
                                onClick={handleDrawerClose}
                                aria-label={t('appbar.opendrawer')}
                                aria-expanded={!open ? 'false' : 'true'}
                            >
                                {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                            </IconButton>
                        </Tooltip>
                    }
                </div>
                <Divider />
                <List>
                    {/* {items.map((item) => (
                        <Layers key={`${id}-${item.id}`} />
                    ))} */}
                    {search && <ButtonApp tooltip="appbar.search" current={panel === ' search'} icon={<SearchIcon />} onClickFunction={() => setPanel(' search')} />}
                    {search && (panel === ' search' || ksOnly) && <div className={ksOnly?'cgp-apppanel search ks-only':`cgp-apppanel${panel}`}><SearchPanel showing={panel === ' search' || ksOnly} initKeyword={initKeyword} ksOnly={ksOnly} setKSOnly={setKSOnly} setKeyword={setKeyword} closeFunction={() => setPanel('')} auth={auth} /></div>}
                    {/* {search && (
                        <ButtonApp tooltip="appbar.keywordsearch" current={false} icon={<KeywordSearchIcon />} onClickFunction={gotoKeywordSearch} />
                    )} */}
                    <ButtonApp tooltip="appbar.filters" current={panel === ' filters'} icon={<SvgIcon><FilterIcon /></SvgIcon>} onClickFunction={() => setPanel(' filters')} />
                    {panel === ' filters' && <div className={`cgp-apppanel${panel}`}><FiltersPanel showing={panel === ' filters'} closeFunction={(cp?: string) => setPanel(cp !== undefined ? cp : '')} /></div>}
                    <ButtonApp tooltip="appbar.analytics" current={panel === ' analytics'} icon={<SvgIcon><AnalyticIcon /></SvgIcon>} onClickFunction={() => setPanel(' analytics')} />
                    {panel === ' analytics' && <div className={`cgp-apppanel${panel}`}><AnalyticPanel showing={panel === ' analytics'} analyticOrg={analyticOrg} setAnalyticOrg={setAnalyticOrg} closeFunction={() => setPanel('')} /></div>}
                </List>
                <Divider className={classes.spacer} />
                <List>
                    {auth && <ButtonApp tooltip="appbar.account" current={panel === ' account'} icon={<AccountIcon />} onClickFunction={() => setPanel(' account')} />}
                    {auth && panel === ' account' && <div className={`cgp-apppanel${panel}`}><DashboardPanel showing={panel === ' account'} closeFunction={() => setPanel('')} /></div>}
                    <ButtonApp tooltip="appbar.howto" current={panel === ' howto'} icon={<HelpOutlineIcon />} onClickFunction={() => setPanel(' howto')} />
                    {panel === ' howto' && <div className={`cgp-apppanel${panel}`}><HowtoPanel showing={panel === ' howto'} closeFunction={() => setPanel('')} /></div>}
                </List>
                <Divider />
                <List className={classes.githubSection}>
                    <Version />
                </List>
            </Drawer>
        </div>
    );
}

interface AppBarProps {
    search: boolean;
    auth: boolean;
}
