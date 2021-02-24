/* eslint-disable prettier/prettier */
import { useState, useRef, useEffect } from 'react';
import {useLocation, useHistory} from 'react-router';

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

import SearchIcon from '@material-ui/icons/ImageSearch';
import KeywordSearchIcon from '@material-ui/icons/Search';
import FilterIcon from '@material-ui/icons/Filter';
import AccountIcon from '@material-ui/icons/AccountBox';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import ButtonApp from './button';
import Version from './buttons/version';
import { getQueryParams } from '../../common/queryparams';
import SearchPanel from '../search/search-panel';
import FiltersPanel from '../searchfilter/filters-panel';
import AccountPanel from '../account/account-panel';
import HowtoPanel from '../howto/howto-panel';

import './app-bar.scss';
import { query } from 'esri-leaflet';

const drawerWidth = 200;

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
        overflowX: 'hidden',
        width: '61px',
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
    },
    spacer: {
        flexGrow: 1,
        backgroundColor: 'white',
    },
    githubSection: {
        paddingBottom: '30px',
    },
}));

export function Appbar(props: AppBarProps): JSX.Element {
    const { id, search, auth } = props;
    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation();
    const queryParams: { [key: string]: string } = getQueryParams(location.search);
    const classes = useStyles();
    // console.log(queryParams, queryParams.keyword);
    const [open, setOpen] = useState(false);
    const [panel, setPanel] = useState(queryParams.keyword !== undefined? " search" : "");

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

    useEffect(()=>{
        setPanel(queryParams.keyword !== undefined? " search" : "");
    }, [queryParams.keyword])

    return (
        <div className={classes.root} ref={appBar}>
            <Drawer
                variant="permanent"
                className={open ? classes.drawerOpen : classes.drawerClose}
                classes={{ paper: open ? classes.drawerOpen : classes.drawerClose }}
            >
                <div className={classes.toolbar}>
                    <Tooltip title={t('appbar.drawer')} placement="right" TransitionComponent={Fade}>
                        <IconButton onClick={handleDrawerClose}>{!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}</IconButton>
                    </Tooltip>
                </div>
                <Divider />
                <List>
                    {/* {items.map((item) => (
                        <Layers key={`${id}-${item.id}`} />
                    ))} */}
                    {search && <ButtonApp tooltip="appbar.search" icon={<SearchIcon />} onClickFunction={()=>setPanel(' search')} />}
                    {search && <ButtonApp tooltip="appbar.keywordsearch" icon={<KeywordSearchIcon />} onClickFunction={()=>history.push(`/search${location.search}`)} />}
                    <ButtonApp tooltip="appbar.filters" icon={<FilterIcon />} onClickFunction={()=>setPanel(' filters')} />
                </List>
                <Divider className={classes.spacer} />
                <List>
                    {auth && <ButtonApp tooltip="appbar.account" icon={<AccountIcon />} onClickFunction={()=>setPanel(' account')} />}
                    <ButtonApp tooltip="appbar.howto" icon={<HelpOutlineIcon />} onClickFunction={()=>setPanel(' howto')} />
                </List>
                <Divider />
                <List className={classes.githubSection}>
                    <Version />
                </List>
            </Drawer>
            <div className={`cgp-apppanel${panel}`}>
                {search && <SearchPanel showing={panel===" search"} closeFunction={()=>setPanel('')} />}
                <FiltersPanel showing={panel===" filters"} closeFunction={()=>setPanel('')} />
                {auth && <AccountPanel showing={panel===" account"} closeFunction={()=>setPanel('')} />}
                <HowtoPanel showing={panel===" howto"} closeFunction={()=>setPanel('')} />   
            </div>
        </div>
    );
}

interface AppBarProps {
    id: string;
    search: boolean;
    auth: boolean;
}
