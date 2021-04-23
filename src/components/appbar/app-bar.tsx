/* eslint-disable prettier/prettier */
import { useState, useRef, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import { Drawer, List, Divider, IconButton, Tooltip, Fade } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { DomEvent } from 'leaflet';

// import Layers from './buttons/layers';
// import Search from './buttons/search';
// import KeywordSearch from './buttons/keywordsearch';
// import Filter from './buttons/filters';
// import Account from './buttons/account';
// import Howto from './buttons/howto';

import SvgIcon from "@material-ui/core/SvgIcon";
import SearchIcon from '@material-ui/icons/ImageSearch';
import KeywordSearchIcon from '@material-ui/icons/Search';
import FilterIcon from '../../assets/icons/filter.svg';
import AccountIcon from '@material-ui/icons/AccountBox';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import ButtonApp from './button';
import Version from './buttons/version';
import { setFilters } from '../../reducers/action';
import { getQueryParams } from '../../common/queryparams';
import SearchPanel from '../search/search-panel';
import FiltersPanel from '../searchfilter/filters-panel';
import AccountPanel from '../account/account-panel';
import HowtoPanel from '../howto/howto-panel';
import organisations from '../search/organisations.json';
import types from '../search/types.json';
import themes from '../search/themes.json';
import './app-bar.scss';

const drawerWidth = 200;
const drawerWidthFull = '100vw';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        height: '100%',
        width: '60px',
        border: '2px solid rgba(0, 0, 0, 0.2)',
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
        width: '61px',
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
    const { id, search, auth } = props;
    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const queryParams: { [key: string]: string } = getQueryParams(location.search);
    const classes = useStyles();
    // console.log(queryParams, queryParams.keyword);
    const [open, setOpen] = useState(false);
    const [panel, setPanel] = useState(
        queryParams.keyword !== undefined ||
            queryParams.org !== undefined ||
            queryParams.type !== undefined ||
            queryParams.theme !== undefined
            ? ' search'
            : ''
    );
    const language = t('app.language');
    const appBar = useRef();
    useEffect(() => {
        // disable events on container
        DomEvent.disableClickPropagation(appBar.current.children[0] as HTMLElement);
        DomEvent.disableScrollPropagation(appBar.current.children[0] as HTMLElement);
    }, []);

    // side menu items
    // const items = [{ divider: true }, { id: 'layers' }, { divider: true }, { id: 'fullscreen' }, { id: 'help' }];
    // const items = [{ id: 'legend' }];

    const handleDrawerClose = () => {
        setOpen(!open);
    };

    const gotoKeywordSearch = () => {
        history.push({
            pathname: '/search',
            search: queryParams.keyword !== undefined ? `keyword=${queryParams.keyword}` : '',
        });
    };

    useEffect(() => {
        setPanel(
            queryParams.keyword !== undefined ||
                queryParams.org !== undefined ||
                queryParams.type !== undefined ||
                queryParams.theme !== undefined
                ? ' search'
                : ''
        );
        if (queryParams.org !== undefined || queryParams.type !== undefined || queryParams.theme !== undefined) {
            const oIndex = (organisations[language] as string[]).findIndex((os: string) => os === queryParams.org);
            const tIndex = (types[language] as string[]).findIndex((ts: string) => ts === queryParams.type);
            const thIndex = (themes[language] as string[]).findIndex((ths: string) => ths === queryParams.theme);
            const orgfilter = oIndex > -1 ? [oIndex] : [];
            const typefilter = tIndex > -1 ? [tIndex] : [];
            const themefilter = thIndex > -1 ? [thIndex] : [];
            dispatch(setFilters({ orgfilter, typefilter, themefilter, foundational: false }));
        }
    }, [language, queryParams.keyword, queryParams.org, queryParams.type, queryParams.theme, dispatch]);

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
                    {search && panel === ' search' && <div className={`cgp-apppanel${panel}`}><SearchPanel showing={panel === ' search'} closeFunction={() => setPanel('')} /></div>}
                    {search && (
                        <ButtonApp tooltip="appbar.keywordsearch" current={false} icon={<KeywordSearchIcon />} onClickFunction={gotoKeywordSearch} />
                    )}
                    <ButtonApp tooltip="appbar.filters" current={panel === ' filters'} icon={<SvgIcon><FilterIcon /></SvgIcon>} onClickFunction={() => setPanel(' filters')} />
                    {panel === ' filters' && <div className={`cgp-apppanel${panel}`}><FiltersPanel showing={panel === ' filters'} closeFunction={(cp?: string) => setPanel(cp!==undefined?cp:'')} /></div>}
                </List>
                <Divider className={classes.spacer} />
                <List>
                    {auth && <ButtonApp tooltip="appbar.account" current={panel === ' account'} icon={<AccountIcon />} onClickFunction={() => setPanel(' account')} />}
                    {auth && panel === ' account' && <div className={`cgp-apppanel${panel}`}><AccountPanel showing={panel === ' account'} closeFunction={() => setPanel('')} /></div>}
                    <ButtonApp tooltip="appbar.howto" current={panel === ' howto'} icon={<HelpOutlineIcon />} onClickFunction={() => setPanel(' howto')} />
                    {panel === ' howto' && <div className={`cgp-apppanel${panel}`}><HowtoPanel showing={panel === ' howto'} closeFunction={() => setPanel('')} /></div>}
                </List>
                <Divider />
                <List className={classes.githubSection}>
                    <Version />
                </List>
            </Drawer>
            {/* <div className={`cgp-apppanel${panel}`}>
                {search && <SearchPanel showing={panel === ' search'} closeFunction={() => setPanel('')} />}
                <FiltersPanel showing={panel === ' filters'} closeFunction={() => setPanel('')} />
                {auth && <AccountPanel showing={panel === ' account'} closeFunction={() => setPanel('')} />}
                <HowtoPanel showing={panel === ' howto'} closeFunction={() => setPanel('')} />
            </div> */}
        </div>
    );
}

interface AppBarProps {
    id: string;
    search: boolean;
    auth: boolean;
}
