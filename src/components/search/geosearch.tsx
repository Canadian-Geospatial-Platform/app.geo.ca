/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-filename-extension */
import { useMediaQuery } from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios';
import { LatLng, LatLngBounds } from 'leaflet';
import React, { ChangeEvent, createRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AttributionControl, GeoJSON, MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import BeatLoader from 'react-spinners/BeatLoader';
import { StoreEnhancer } from 'redux';
import { SpatialData, StacData } from '../../app';
import FilterIcon from '../../assets/icons/filter.svg';
import { AnalyticParams, analyticPost } from '../../common/analytic';
import { envglobals } from '../../common/envglobals';
import { getQueryParams } from '../../common/queryparams';
import {
    setFilters,
    setFoundational,
    setOrgFilter,
    setSpatempFilter,
    setSpatialFilter,
    setStacFilter,
    setStoreBoundbox,
    setStoreCenter,
    setStoreZoom,
    setThemeFilter,
    setTypeFilter,
} from '../../reducers/action';
import { loadState } from '../../reducers/localStorage';
import { FreezeMapSpatial, INITMAINMAPINFO, INITSPATIALTEMPORALFILTER, SpatialTemporalFilter } from '../../reducers/reducer';
import { NavBar } from '../navbar/nav-bar';
import Pagination from '../pagination/pagination';
import SearchFilter from '../searchfilter/searchfilter';
import SpatialTemporalSearchFilter from '../searchfilter/spatial-temporalfilter';
import './geosearch.scss';
import organisations from './organisations.json';
import Sorting, { SortingOptionInfo } from './sorting';
import spatemps from './spatial-temporal.json';
import spatials from './spatials.json';
import stacs from './stac.json';
import themes from './themes.json';
import types from './types.json';

const EnvGlobals = envglobals();
const GeoSearch = (
    showing: boolean,
    ksOnly: boolean,
    setKeyword: (kw: string) => void,
    setKSOnly: (kso: boolean) => void,
    initKeyword: string,
    freeze: FreezeMapSpatial
): JSX.Element => {
    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation();
    const queryParams: { [key: string]: string } = getQueryParams(location.search);
    const { statePn, stateBounds } = location.state !== undefined ? location.state : {};
    const [stateLoaded, setStateLoaded] = useState(false);
    const [spatialData] = useState<SpatialData>(useSelector((state) => state.mappingReducer.spatialData));
    const spatialLabelParams = [];
    const [stacData] = useState<StacData>(useSelector((state) => (state.mappingReducer.stacData ? state.mappingReducer.stacData : {})));
    const stacLabelParams = [];
    const rpp = 10;
    const [ppg, setPPG] = useState(window.innerWidth > 600 ? 8 : window.innerWidth > 400 ? 5 : 3);
    const inputRef: React.RefObject<HTMLInputElement> = createRef();
    let mapCount = 0;
    const map = useMap();
    const [initBounds, setBounds] = useState(map.getBounds());
    const [loading, setLoading] = useState(false);
    // const [sfloaded, setSF] = useState(sf===true?true:false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [cpn, setPn] = useState(false);
    const [pn, setPageNumber] = useState(1);
    const [cnt, setCount] = useState(0);
    const [selected, setSelected] = useState('search');
    const [open, setOpen] = useState(false);
    // const [modal, setModal] = useState(false);
    // const [initKeyword, setKeyword] = useState(queryParams && queryParams.keyword ? queryParams.keyword.trim() : '');
    const language = t('app.language');
    const analyticParams = { loc: '/', lang: language, type: 'search', event: 'search' };
    const storeorgfilters = useSelector((state) => state.mappingReducer.orgfilter);
    const storetypefilters = useSelector((state) => state.mappingReducer.typefilter);
    const storethemefilters = useSelector((state) => state.mappingReducer.themefilter);
    const storespatialfilters = useSelector((state) => (state.mappingReducer.spatialfilter ? state.mappingReducer.spatialfilter : []));
    const storefoundational = useSelector((state) => state.mappingReducer.foundational);
    const storestacfilters = useSelector((state) => (state.mappingReducer.stacfilter ? state.mappingReducer.stacfilter : []));
    const storespatempfilters = useSelector((state) => state.mappingReducer.spatempfilter);
    const dispatch = useDispatch();
    const [zoom, setZoom] = useState(null);
    const [center, setCenter] = useState(null);
    const [boundbox, setBoundbox] = useState(useSelector((state) => state.mappingReducer.boundbox));
    const [orgfilters, setOrg] = useState(storeorgfilters);
    const [typefilters, setType] = useState(storetypefilters);
    const [themefilters, setTheme] = useState(storethemefilters);
    const [spatialfilters, setSpatial] = useState(storespatialfilters);
    const [spatempfilters, setSpatemp] = useState<SpatialTemporalFilter>(storespatempfilters);
    const [foundational, setFound] = useState(storefoundational);
    const [stacfilters, setStac] = useState(storestacfilters);
    const [fReset, setFReset] = useState(false);
    const [filterbyshown, setFilterbyshown] = useState(false);
    const [ofOpen, setOfOpen] = useState(false);
    const [allkw, setKWShowing] = useState<string[]>([]);
    const [sortbyValue, setSortbyValue] = useState(queryParams.sort ? queryParams.sort : 'title');
    /* const orgfilters = useSelector((state) => state.mappingReducer.orgfilter);
    const typefilters = useSelector((state) => state.mappingReducer.typefilter);
    const themefilters = useSelector((state) => state.mappingReducer.themefilter);
    const foundational = useSelector((state) => state.mappingReducer.foundational);
    const dispatch = useDispatch(); */

    const selectResult = (result: SearchResult | undefined) => {
        map.eachLayer((layer: unknown) => {
            // console.log(layer);
            const { feature } = layer;
            if (
                !!feature &&
                feature.type &&
                feature.type === 'Feature' &&
                feature.properties &&
                feature.properties.tag &&
                feature.properties.tag === 'geoViewGeoJSON'
            ) {
                map.removeLayer(layer);
            }
        });

        if (result) {
            const data = {
                type: 'Feature',
                properties: { id: result.id, tag: 'geoViewGeoJSON' },
                geometry: {
                    type: 'Polygon',
                    coordinates: JSON.parse(result.coordinates),
                },
            };
            const selectedParams: AnalyticParams = {
                search: analyticParams.search,
                geo: JSON.stringify(analyticParams.geo),
                uuid: result.id,
                loc: '/',
                lang: language,
                type: 'access',
                event: 'footprint',
            };

            if (analyticParams.theme) {
                selectedParams.theme = analyticParams.theme;
            }
            if (analyticParams.org) {
                selectedParams.org = analyticParams.org;
            }
            if (analyticParams.type_filter) {
                selectedParams.type_filter = analyticParams.type_filter;
            }
            if (analyticParams.foundational) {
                selectedParams.foundational = analyticParams.foundational;
            }
            analyticPost(selectedParams);
            // eslint-disable-next-line new-cap
            new L.geoJSON(data).addTo(map);
        }
    };

    const handleSelect = (event: string) => {
        // const {selectResult} = this.props;
        const cardOpen = selected === event ? !open : true;
        const result =
            Array.isArray(results) && results.length > 0 && cardOpen ? results.find((r: SearchResult) => r.id === event) : undefined;

        setSelected(event);
        setOpen(cardOpen);
        selectResult(result);
    };

    const setLoadingStatus = (flag: boolean) => {
        flag &&
            map._handlers.forEach((handler) => {
                handler.disable();
            });
        setLoading(flag);
        !flag &&
            map._handlers.forEach((handler) => {
                handler.enable();
            });
    };

    const handleView = (evt: React.MouseEvent<HTMLButtonElement>, id: string, title: string) => {
        console.log(evt);
        evt.stopPropagation();
        const viewParams: AnalyticParams = {
            search: analyticParams.search,
            geo: JSON.stringify(analyticParams.geo),
            uuid: id,
            loc: '/',
            lang: language,
            type: 'access',
            event: 'view',
        };

        if (analyticParams.theme) {
            viewParams.theme = analyticParams.theme;
        }
        if (analyticParams.org) {
            viewParams.org = analyticParams.org;
        }
        if (analyticParams.type_filter) {
            viewParams.type_filter = analyticParams.type_filter;
        }
        if (analyticParams.foundational) {
            viewParams.foundational = analyticParams.foundational;
        }
        analyticPost(viewParams);
        if (evt.button === 0) {
            history.push({
                pathname: `/result/${language}/${encodeURI(title.trim().toLowerCase().replaceAll(' ', '-').replaceAll('/', '%2F'))}`,
                search: `id=${encodeURI(id.trim())}&lang=${language}`,
                state: {
                    stateKO: ksOnly,
                    stateKeyword: initKeyword,
                    statePn: pn,
                    stateBounds: initBounds,
                },
            });
        } else if (evt.button === 1) {
            const metadataState = {
                lang: `${language}`,
                id: `${encodeURI(id.trim())}`,
                title: `${encodeURI(title.trim().toLowerCase().replaceAll(' ', '-'))}`,
                stateKO: ksOnly,
                stateKeyword: initKeyword,
                statePn: pn,
                stateBounds: initBounds,
            };
            localStorage.setItem('metadataState', JSON.stringify(metadataState));
            window.open(`/result?id=${encodeURI(id.trim())}&lang=${language}`, '_blank', 'noreferrer');
        }
    };

    const handleChange = (e: ChangeEvent) => {
        e.preventDefault();
        setKeyword((e.target as HTMLInputElement).value);
    };

    const eventHandler = (event: unknown, passkw: string) => {
        const mbounds = event.target.getBounds();
        // console.log(mbounds,bounds);
        // console.log(passkw);
        // map.off('moveend');
        if (!loading && mapCount === 0 && !Object.is(mbounds, initBounds)) {
            // console.log('research:', loading, keyword, mapCount);
            mapCount++;
            setLoadingStatus(true);
            handleSearch(passkw, mbounds);
        }
    };

    const handleSearch = (keyword: string, bounds: unknown, pnum?: number) => {
        map.off('moveend');
        const cpr = pnum !== undefined ? true : false;
        setPn(cpr);
        !loading && setLoadingStatus(true);
        const pageNumber = pnum !== undefined ? pnum : 1;

        const localState: StoreEnhancer<unknown, unknown> | undefined = loadState();
        const ofilters = localState !== undefined ? localState.mappingReducer.orgfilter : [];
        const tfilters = localState !== undefined ? localState.mappingReducer.typefilter : [];
        const thfilters = localState !== undefined ? localState.mappingReducer.themefilter : [];
        const spafilters =
            localState !== undefined ? (localState.mappingReducer.spatialfilter ? localState.mappingReducer.spatialfilter : []) : [];
        const spatfilters: SpatialTemporalFilter =
            localState !== undefined
                ? localState.mappingReducer.spatempfilter
                    ? localState.mappingReducer.spatempfilter
                    : INITSPATIALTEMPORALFILTER
                : INITSPATIALTEMPORALFILTER;
        const found = localState !== undefined ? localState.mappingReducer.foundational : false;
        const stfilters =
            localState !== undefined ? (localState.mappingReducer.stacfilter ? localState.mappingReducer.stacfilter : []) : [];
        // const MappingState = getMappingState();
        const searchParams: SearchParams = {
            north: bounds._northEast.lat,
            east: bounds._northEast.lng,
            south: bounds._southWest.lat,
            west: bounds._southWest.lng,
            keyword: keyword.replace(/"/g, '\\"'),
            lang: language,
            min: (pageNumber - 1) * rpp + 1,
            max: pageNumber * rpp,
            sort: sortbyValue,
        };
        const aParams = Object.assign(analyticParams);
        aParams.search = keyword;
        // aParams.geo = JSON.stringify(bounds);
        aParams.geo = [
            [bounds._northEast.lat, bounds._northEast.lng],
            [bounds._southWest.lat, bounds._southWest.lng],
        ];

        if (thfilters.length > 0) {
            const themeArray = thfilters.map((fs: number) => themes[language][fs].toLowerCase().replace(/\'/g, "''"));
            searchParams.theme = themeArray.join('|');
            aParams.theme = themeArray;
        } else if (aParams.theme) {
            delete aParams.theme;
        }

        if (ofilters.length > 0) {
            const orgArray = ofilters.map((fs: number) => organisations[language][fs].toLowerCase().replace(/\'/g, "''"));
            searchParams.org = orgArray.join('|');
            aParams.org = orgArray;
        } else if (aParams.org) {
            delete aParams.org;
        }

        if (tfilters.length > 0) {
            const typeArray = tfilters.map((fs: number) => types[language][fs].toLowerCase().replace(/\'/g, "''"));
            searchParams.type = typeArray.join('|');
            aParams.type_filter = typeArray;
        } else if (aParams.type_filter) {
            delete aParams.type_filter;
        }

        if (spafilters.length > 0) {
            const spatialArray = spafilters.map((fs: number) => spatials[language][fs].toLowerCase().replace(/\'/g, "''"));
            searchParams.spatial = spatialArray.join('|');
            aParams.spatial = spatialArray;
        } else if (aParams.type_filter) {
            delete aParams.spatial;
        }

        if (stfilters.length > 0) {
            const stArray = stfilters.map((fs: number) => stacs[language][fs].toLowerCase().replace(/\'/g, "''"));
            searchParams.stac = stArray.join('|');
            aParams.stac = stArray;
        } else if (aParams.type_filter) {
            delete aParams.stac;
        }

        if (spatfilters.extents.length > 0) {
            const spatArray = spatfilters.extents.map((fs: number) => spatemps[language][fs]);
            if (spatArray.indexOf('SPATIALEXTENT') > -1) {
                searchParams.bbox = `${boundbox._southWest.lat}|${boundbox._southWest.lng}|${boundbox._northEast.lat}|${boundbox._northEast.lng}`;
                searchParams.south = boundbox._southWest.lat;
                searchParams.west = boundbox._southWest.lng;
                searchParams.north = boundbox._northEast.lat;
                searchParams.east = boundbox._northEast.lng;
            }
            if (spatArray.indexOf('TEMPORALEXTENT') > -1) {
                searchParams.begin = `${spatfilters.startDate}`;
                searchParams.end = `${spatfilters.endDate}`;
            }
            //aParams.datetime = spatialArray;
        } else if (aParams.type_filter) {
            //delete aParams.spatial;
        }
        if (found) {
            searchParams.foundational = 'true';
            aParams.foundational = 'true';
        } else if (aParams.foundational) {
            delete aParams.foundational;
        }

        // console.log(searchParams);
        dispatch(
            setFilters({
                orgfilter: ofilters,
                typefilter: tfilters,
                themefilter: thfilters,
                spatialfilter: spafilters,
                foundational: found,
                stacfilter: stfilters,
                spatempfilter: spatfilters,
            })
        );

        axios
            .get(`${EnvGlobals.APP_API_DOMAIN_URL}${EnvGlobals.APP_API_ENDPOINTS.SEARCH}`, { params: searchParams, headers: {} })
            .then((response) => {
                analyticPost(aParams);
                return response.data;
            })
            .then((data) => {
                // console.log(data);
                const res = data.Items;
                const rcnt = res.length > 0 ? res[0].total : 0;
                setResults(res);
                setCount(rcnt);
                // setBounds(bounds);
                // setAnalyticParams(aParams);
                // setKeyword(keyword);
                // if (!cpr && pn!==1) {
                setPageNumber(pageNumber);
                // }
                // setLoadingStatus(false);
                // setOrg(ofilters);
                // setType(tfilters);
                // setTheme(thfilters);
                // setFound(found);
                if (selected !== 'search' && open && res.find((r: SearchResult) => r.id === selected)) {
                    setSelected('search');
                    setOpen(false);
                    selectResult(undefined);
                }
                // map.on('moveend', (event) => eventHandler(event));
                // mapCount = 0;
            })
            .catch((error) => {
                console.log(error);
                setResults([]);
                setCount(0);
                setPn(false);
                setPageNumber(1);
                // setBounds(bounds);
                // setAnalyticParams(aParams);
                // setKeyword(keyword);
                setSelected('search');
                setOpen(false);
                selectResult(undefined);
                // setLoadingStatus(false);
                // setOrg(ofilters);
                // setType(tfilters);
                // setTheme(thfilters);
                // setFound(found);
            })
            .finally(() => {
                setBounds(bounds);
                setKeyword(keyword);
                setKWShowing([]);
                setLoadingStatus(false);
                if (!freeze.freeze) {
                    map.on('moveend', (event) => eventHandler(event, keyword));
                } else {
                    map.off('moveend');
                }
                mapCount = 0;
            });
    };

    const handleSubmit = (event?: React.MouseEvent | undefined) => {
        if (event) {
            event.preventDefault();
        }

        const keyword = (inputRef.current as HTMLInputElement).value;
        // setPageNumber(1);
        if (ksOnly) {
            handleKOSearch(keyword);
        } else {
            handleSearch(keyword, initBounds);
        }
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode === 13) {
            handleSubmit();
        }
    };
    /*
    const clearOrgFilter = (filter: number) => {
        const newfilter = storeorgfilters.filter((fs: number) => fs !== filter);
        dispatch(setOrgFilter(newfilter));
        // setOrg(newfilter);
        // setPageNumber(1);
    };

    const clearTypeFilter = (filter: number) => {
        const newfilter = storetypefilters.filter((fs: number) => fs !== filter);
        dispatch(setTypeFilter(newfilter));
        // setType(newfilter);
        // setPageNumber(1);
    };

    const clearThemeFilter = (filter: number) => {
        const newfilter = storethemefilters.filter((fs: number) => fs !== filter);
        dispatch(setThemeFilter(newfilter));
        // setTheme(newfilter);
        // setPageNumber(1);
    };

    const clearFound = () => {
        dispatch(setFoundational(false));
        // setFound(false);
        // setPageNumber(1);
    };
*/

    const ksToggle = (kso: boolean) => {
        kso && map.off('moveend');
        setKSOnly(kso);
    };

    const applyFilters = () => {
        dispatch(
            setFilters({
                orgfilter: orgfilters,
                typefilter: typefilters,
                themefilter: themefilters,
                spatialfilter: spatialfilters,
                foundational,
                stacfilter: stacfilters,
                spatempfilter: spatempfilters,
            })
        );
        if (spatempfilters.extents.length > 0) {
            const spatArray = spatempfilters.extents.map((fs: number) => spatemps[language][fs]);
            if (spatArray.indexOf('SPATIALEXTENT') > -1) {
                if (boundbox) {
                    dispatch(setStoreBoundbox(boundbox));
                    console.log('set bounds', boundbox);
                }
                if (center !== null) {
                    dispatch(setStoreCenter(center));
                    console.log('set center', center);
                }
                if (zoom !== null) {
                    dispatch(setStoreZoom(zoom));
                    console.log('set zoom', zoom);
                }
            } else {
                dispatch(setStoreZoom(INITMAINMAPINFO.zoom));
                dispatch(setStoreCenter(INITMAINMAPINFO.center));
                dispatch(setStoreBoundbox(undefined));
            }
        } else {
            dispatch(setStoreZoom(INITMAINMAPINFO.zoom));
            dispatch(setStoreCenter(INITMAINMAPINFO.center));
            dispatch(setStoreBoundbox(undefined));
        }
        setFReset(false);
        // setPageNumber(1);
    };

    const clearAll = () => {
        setOrg([]);
        setType([]);
        setTheme([]);
        setSpatial([]);
        setFound(false);
        setSpatemp({ ...spatempfilters, extents: [] });
        dispatch(
            setFilters({
                orgfilter: [],
                typefilter: [],
                themefilter: [],
                spatialfilter: [],
                foundational: false,
                stacfilter: [],
                spatempfilter: { ...INITSPATIALTEMPORALFILTER },
            })
        );
        dispatch(setStoreZoom(INITMAINMAPINFO.zoom));
        dispatch(setStoreCenter(INITMAINMAPINFO.center));
        dispatch(setStoreBoundbox(undefined));
        setFReset(false);
        // setPageNumber(1);
    };

    const handleKOSearch = (keyword: string, pnum?: number) => {
        const cpr = pnum !== undefined;
        // const currentLang = (!sfloaded && queryParams.lang !== undefined)?queryParams.lang:language;
        setPn(cpr);
        setLoading(true);
        const pageNumber = pnum !== undefined ? pnum : 1;
        const localState: StoreEnhancer<unknown, unknown> | undefined = loadState();
        const ofilters = localState !== undefined ? localState.mappingReducer.orgfilter : [];
        const tfilters = localState !== undefined ? localState.mappingReducer.typefilter : [];
        const thfilters = localState !== undefined ? localState.mappingReducer.themefilter : [];
        const spafilters =
            localState !== undefined ? (localState.mappingReducer.spatialfilter ? localState.mappingReducer.spatialfilter : []) : [];
        const stfilters = localState !== undefined ? (localState.mappingReducer.stfilter ? localState.mappingReducer.stfilter : []) : [];
        const spatfilters: SpatialTemporalFilter =
            localState !== undefined ? localState.mappingReducer.spatempfilter : INITSPATIALTEMPORALFILTER;
        const found = localState !== undefined ? localState.mappingReducer.foundational : false;
        const searchParams: KOSearchParams = {
            keyword: keyword.replace(/"/g, '\\"'),
            keyword_only: 'true',
            lang: language,
            min: (pageNumber - 1) * rpp + 1,
            max: pageNumber * rpp,
            sort: sortbyValue,
        };

        const aParams = Object.assign(analyticParams);
        aParams.search = keyword;
        if (thfilters.length > 0) {
            const themeArray = thfilters.map((fs: number) => themes[language][fs].toLowerCase().replace(/\'/g, "''"));
            searchParams.theme = themeArray.join('|');
            aParams.theme = themeArray;
        } else if (aParams.theme) {
            delete aParams.theme;
        }
        if (ofilters.length > 0) {
            const orgArray = ofilters.map((fs: number) => organisations[language][fs].toLowerCase().replace(/\'/g, "''"));
            searchParams.org = orgArray.join('|');
            aParams.org = orgArray;
        } else if (aParams.org) {
            delete aParams.org;
        }
        if (tfilters.length > 0) {
            const typeArray = tfilters.map((fs: number) => types[language][fs].toLowerCase().replace(/\'/g, "''"));
            searchParams.type = typeArray.join('|');
            aParams.type_filter = typeArray;
        } else if (aParams.type_filter) {
            delete aParams.type_filter;
        }
        if (spafilters.length > 0) {
            const spatialArray = spafilters.map((fs: number) => spatials[language][fs].toLowerCase().replace(/\'/g, "''"));
            searchParams.spatial = spatialArray.join('|');
            aParams.spatial = spatialArray;
        } else if (aParams.spatial) {
            delete aParams.spatial;
        }
        if (stfilters.length > 0) {
            const stArray = stfilters.map((fs: number) => stacs[language][fs].toLowerCase().replace(/\'/g, "''"));
            searchParams.stac = stArray.join('|');
            aParams.stac = stArray;
        } else if (aParams.stac) {
            delete aParams.stac;
        }
        /*
        if (spatfilters.extents.length > 0) {
            const spatArray = spatfilters.extents.map((fs: number) => spatemps[language][fs]);
            if (spatArray.indexOf('SPATIALEXTENT') > -1) {
                searchParams.bbox = `${boundbox['_southWest'].lat}|${boundbox['_southWest'].lng}|${boundbox['_northEast'].lat}|${boundbox['_northEast'].lng}`;
                searchParams.south = boundbox._southWest.lat;
                searchParams.west = boundbox._southWest.lng;
                searchParams.north = boundbox._northEast.lat;
                searchParams.east = boundbox._northEast.lng;
            }
            if (spatArray.indexOf('TEMPORALEXTENT') > -1) {
                searchParams.datetime = `${spatfilters.startDate}|${spatfilters.endDate}`;
            }
            //aParams.datetime = spatialArray;
        }*/
        if (found) {
            searchParams.foundational = 'true';
            aParams.foundational = 'true';
        } else if (aParams.foundational) {
            delete aParams.foundational;
        }

        dispatch(
            setFilters({
                orgfilter: ofilters,
                typefilter: tfilters,
                themefilter: thfilters,
                spatialfilter: spafilters,
                foundational: found,
                stacfilter: stfilters,
                spatempfilter: spatfilters,
            })
        );
        // console.log(searchParams);
        axios
            .get(`${EnvGlobals.APP_API_DOMAIN_URL}${EnvGlobals.APP_API_ENDPOINTS.SEARCH}`, { params: searchParams })
            .then((response) => {
                analyticPost(analyticParams);
                return response.data;
            })
            .then((data) => {
                // console.log(data);
                const res = data.Items;
                const rcnt = res.length > 0 ? res[0].total : 0;
                setResults(res);
                setCount(rcnt);
                // if (!cpr && pn!==1) {
                setPageNumber(pageNumber);
                // }
                // setKWShowing([]);
                // setKeyword(keyword);
                // setAnalyticParams(aParams);
                // setLoading(false);
                // setOrg(ofilters);
                // setType(tfilters);
                // setTheme(thfilters);
                // setFound(found);
                // setSF(true);
            })
            .catch(() => {
                // console.log(error);
                setResults([]);
                setPn(false);
                setCount(0);
                setPageNumber(1);
                // setKWShowing([]);
                // setKeyword(keyword);
                // setAnalyticParams(aParams);
                // setLoading(false);
                // setOrg(ofilters);
                // setType(tfilters);
                // setTheme(thfilters);
                // setFound(found);
                // setSF(true);
            })
            .finally(() => {
                setKWShowing([]);
                setKeyword(keyword);
                setLoading(false);
                setOrg(ofilters);
                setType(tfilters);
                setTheme(thfilters);
                setFound(found);
            });
    };

    const handleKwshowing = (rid: string) => {
        const newOpen = allkw.map((o: string) => o);
        const hIndex = allkw.findIndex((os) => os === rid);
        if (hIndex < 0) {
            newOpen.push(rid);
        } else {
            newOpen.splice(hIndex, 1);
        }
        setKWShowing(newOpen);
    };

    const handleKeyword = (keyword: string) => {
        window.open(`/?keyword=${encodeURI(keyword.trim())}&ksonly&lang=${language}`, `_blank`);
    };

    const handleOrg = (filters: unknown): void => {
        setFReset(true);
        setOrg(filters);
    };

    const handleType = (filters: unknown): void => {
        setFReset(true);
        setType(filters);
    };

    const handleTheme = (filters: unknown): void => {
        setFReset(true);
        setTheme(filters);
    };

    const handleSpatial = (filters: unknown): void => {
        setFReset(true);
        setSpatial(filters);
    };

    const handleStac = (filters: unknown): void => {
        setFReset(true);
        setStac(filters);
    };

    const handleSpatemp = (filters: SpatialTemporalFilter): void => {
        console.log(filters);
        setFReset(true);
        setSpatemp(filters);
    };

    const handleZoomChange = (newZoom: number, boundbox: LatLngBounds): void => {
        setZoom(newZoom);
        setBounds(boundbox);
    };
    const handleCenterChange = (newCenter: LatLng): void => {
        console.log('set center', newCenter);
        setFReset(true);
        setCenter(newCenter);
    };
    const handleBoundboxChange = (boundbox: LatLngBounds) => {
        console.log('set bbox', boundbox);
        setFReset(true);
        setBoundbox(boundbox);
    };

    const handleFound = (found: unknown): void => {
        setFReset(true);
        setFound(found);
    };

    const clearOrgFilter = (filter: number) => {
        const newfilter = orgfilters.filter((fs: number) => fs !== filter);
        dispatch(setOrgFilter(newfilter));
        setOrg(newfilter);
        setFReset(false);
        // setPageNumber(1);
    };

    const clearTypeFilter = (filter: number) => {
        const newfilter = typefilters.filter((fs: number) => fs !== filter);
        dispatch(setTypeFilter(newfilter));
        setType(newfilter);
        setFReset(false);
        // handleSearch(initKeyword);
    };

    const clearThemeFilter = (filter: number) => {
        const newfilter = themefilters.filter((fs: number) => fs !== filter);
        dispatch(setThemeFilter(newfilter));
        setTheme(newfilter);
        setFReset(false);
        // handleSearch(initKeyword);
    };

    const clearSpatialFilter = (filter: number) => {
        const newfilter = spatialfilters.filter((fs: number) => fs !== filter);
        dispatch(setSpatialFilter(newfilter));
        setSpatial(newfilter);
        setFReset(false);
        // handleSearch(initKeyword);
    };

    const clearStacFilter = (filter: number) => {
        const newfilter = stacfilters.filter((fs: number) => fs !== filter);
        dispatch(setStacFilter(newfilter));
        setStac(newfilter);
        setFReset(false);
        // handleSearch(initKeyword);
    };

    const clearSpatempFilter = (filter: number) => {
        const newfilter = spatempfilters.extents.filter((fs: number) => fs !== filter);
        dispatch(setSpatempFilter({ ...spatempfilters, extents: newfilter }));
        setSpatemp({ ...spatempfilters, extents: newfilter });
        if (spatemps[language][filter] === 'SPATIALEXTENT') {
            dispatch(setStoreZoom(INITMAINMAPINFO.zoom));
            dispatch(setStoreCenter(INITMAINMAPINFO.center));
            dispatch(setStoreBoundbox(undefined));
        }
        setFReset(false);
        // handleSearch(initKeyword);
    };

    const clearFound = () => {
        dispatch(setFoundational(false));
        setFound(false);
        setFReset(false);
    };
    const isMobile = useMediaQuery('(max-width: 760px)');
    useEffect(() => {
        // console.log(freeze);
        if (!freeze.freeze) {
            map.on('moveend', (event) => eventHandler(event, initKeyword));
        } else {
            map.off('moveend');
        }
    }, [freeze]);
    useEffect(() => {
        /* if (!sfloaded) {
            if (queryParams.org !== undefined || queryParams.type !== undefined || queryParams.theme !== undefined) {
                const oIndex = (organisations[language] as string[]).findIndex((os: string) => os === queryParams.org);
                const tIndex = (types[language] as string[]).findIndex((ts: string) => ts === queryParams.type);
                const thIndex = (themes[language] as string[]).findIndex((ths: string) => ths === queryParams.theme);
                const orgfilter = oIndex > -1 ? [oIndex] : [];
                const typefilter = tIndex > -1 ? [tIndex] : [];
                const themefilter = thIndex > -1 ? [thIndex] : [];
                dispatch(setFilters({ orgfilter, typefilter, themefilter, foundational: false }));
                // setOrg(orgfilter);
                // setType(typefilter);
                // setTheme(themefilter);
                setSF('true');
            }
        } else */

        if (showing && !loading) {
            // console.log(fReset);
            if (ksOnly) {
                if (!fReset) {
                    handleKOSearch(initKeyword, !stateLoaded ? statePn : undefined);
                }
            } else {
                handleSearch(
                    initKeyword,
                    !stateLoaded && stateBounds !== undefined ? stateBounds : initBounds,
                    !stateLoaded ? statePn : undefined
                );
            }
            setStateLoaded(true);
        }
        const handleResize = () => {
            setPPG(window.innerWidth > 600 ? 8 : window.innerWidth > 400 ? 5 : 3);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [
        showing,
        ksOnly,
        sortbyValue,
        fReset,
        language,
        storeorgfilters,
        storetypefilters,
        storespatialfilters,
        storethemefilters,
        storefoundational,
        storestacfilters,
        storespatempfilters,
        stateLoaded,
    ]);

    // map.on('moveend', event=>eventHandler(event,initKeyword, initBounds));

    // console.log(storethemefilters);
    // console.log(loading, cpn, cnt);
    const sortingOptions: SortingOptionInfo[] = [
        { label: 'appbar.sortby.date.desc', value: 'date-desc', sortDirection: 'desc' },
        { label: 'appbar.sortby.date.asc', value: 'date-asc', sortDirection: 'asc' },
        { label: 'appbar.sortby.popularity.desc', value: 'popularity-desc', sortDirection: 'desc' },
        { label: 'appbar.sortby.popularity.asc', value: 'popularity-asc', sortDirection: 'asc' },
        { label: 'appbar.sortby.title', value: 'title' },
    ];

    const handleSorting = (value: string) => {
        setSortbyValue(value);
        console.log('sorting by', value);
        // !loading && handleSortFilter();
    };
    spatialLabelParams.splice(0);
    spatialLabelParams.push(spatialData?.viewableOnTheMap);
    spatialLabelParams.push(spatialData?.notViewableOnTheMap);
    //console.log(spatialLabelParams);
    stacLabelParams.splice(0);
    stacLabelParams.push(stacData?.hnap);
    stacLabelParams.push(stacData?.stac);
    return (
        <div className="geoSearchContainer">
            <div className={ksOnly ? 'container-fluid container-search input-container' : 'searchInput input-container'}>
                <div className={ksOnly ? 'col-12 col-search-input' : 'searchInput'}>
                    <input
                        placeholder={t('page.search')}
                        id="search-input"
                        type="search"
                        ref={inputRef}
                        disabled={loading}
                        value={initKeyword}
                        onChange={handleChange}
                        onKeyUp={(e) => handleKeyUp(e)}
                        aria-label={t('appbar.search')}
                    />
                    <button
                        type="button"
                        className="icon-button"
                        aria-label={t('appbar.search')}
                        disabled={loading}
                        onClick={!loading ? handleSubmit : undefined}
                    >
                        <SearchIcon />
                    </button>
                </div>
                <div className={ksOnly ? 'col-12 col-advanced-filters-button' : 'col-advanced-filters-button'}>
                    <div className={ksOnly ? 'geo-padding-right-30' : 'geo-padding-right-10'}>
                        <span>{t('appbar.keywordonly')}</span>
                        <label className="switch">
                            <input type="checkbox" disabled={loading} checked={ksOnly} onChange={() => ksToggle(!ksOnly)} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div className={ksOnly ? 'geo-padding-right-30' : 'geo-padding-right-5'}>
                        {!loading && (
                            <Sorting
                                label="appbar.sortby.label"
                                labelClassName="sorting-label"
                                selectClassName="sorting-select"
                                optionClassName="sorting-option"
                                iconClassName="sorting-icon"
                                defaultValue={sortbyValue}
                                options={sortingOptions}
                                onSorting={handleSorting}
                            />
                        )}
                    </div>

                    {ksOnly && (
                        <button
                            className={filterbyshown ? 'advanced-filters-button link-button open' : 'advanced-filters-button link-button'}
                            disabled={loading}
                            type="button"
                            onClick={!loading ? () => setFilterbyshown(!filterbyshown) : undefined}
                            aria-expanded={filterbyshown ? 'true' : 'false'}
                        >
                            {t('page.advancedsearchfilters')}
                        </button>
                    )}
                </div>
            </div>
            {storetypefilters.length +
                storeorgfilters.length +
                storethemefilters.length +
                storespatialfilters.length +
                storestacfilters.length +
                storespatempfilters.extents.length +
                (storefoundational ? 1 : 0) >
                0 && (
                    <div className={ksOnly ? 'container-fluid container-search-filters-active' : 'searchFilters'}>
                        <div className="btn-group btn-group-search-filters-active" role="toolbar" aria-label="Active filters">
                            {storetypefilters.map((typefilter: number) => (
                                <button
                                    key={`tf-${typefilter}`}
                                    type="button"
                                    className="btn btn btn-filter"
                                    disabled={loading}
                                    onClick={!loading ? () => clearTypeFilter(typefilter) : undefined}
                                >
                                    {types[language][typefilter]} <i className="fas fa-times" />
                                </button>
                            ))}
                            {storeorgfilters.map((orgfilter: number) => (
                                <button
                                    key={`of-${orgfilter}`}
                                    type="button"
                                    className="btn btn btn-filter"
                                    disabled={loading}
                                    onClick={!loading ? () => clearOrgFilter(orgfilter) : undefined}
                                >
                                    {organisations[language][orgfilter]} <i className="fas fa-times" />
                                </button>
                            ))}
                            {storethemefilters.map((themefilter: number) => (
                                <button
                                    key={`thf-${themefilter}`}
                                    type="button"
                                    className="btn btn btn-filter"
                                    disabled={loading}
                                    onClick={!loading ? () => clearThemeFilter(themefilter) : undefined}
                                >
                                    {themes[language][themefilter]} <i className="fas fa-times" />
                                </button>
                            ))}
                            {storespatialfilters.map((spatialfilter: number) => (
                                <button
                                    key={`spaf-${spatialfilter}`}
                                    type="button"
                                    className="btn btn btn-filter"
                                    disabled={loading}
                                    onClick={!loading ? () => clearSpatialFilter(spatialfilter) : undefined}
                                >
                                    {spatials[language][spatialfilter]} <i className="fas fa-times" />
                                </button>
                            ))}
                            {storespatempfilters.extents.map((spatempfilter: number) => (
                                <button
                                    key={`spatemp-${spatempfilter}`}
                                    type="button"
                                    className="btn btn btn-filter"
                                    disabled={loading}
                                    onClick={!loading ? () => clearSpatempFilter(spatempfilter) : undefined}
                                >
                                    {spatemps[language][spatempfilter]} <i className="fas fa-times" />
                                </button>
                            ))}
                            {storestacfilters.map((stacfilter: number) => (
                                <button
                                    key={`spaf-${stacfilter}`}
                                    type="button"
                                    className="btn btn btn-filter"
                                    disabled={loading}
                                    onClick={!loading ? () => clearStacFilter(stacfilter) : undefined}
                                >
                                    {stacs[language][stacfilter]} <i className="fas fa-times" />
                                </button>
                            ))}
                            {storefoundational && (
                                <button
                                    type="button"
                                    className="btn btn btn-filter"
                                    disabled={loading}
                                    onClick={!loading ? clearFound : undefined}
                                >
                                    {t('filter.foundational')} <i className="fas fa-times" />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            {ksOnly && filterbyshown && (
                <div
                    className={
                        loading
                            ? 'container-fluid container-filter-selection large-panel disabled'
                            : 'container-fluid container-filter-selection large-panel'
                    }
                >
                    <div className="row row-filters">
                        <div className="col-12">
                            <h3 className="filters-title">
                                <SvgIcon>
                                    <FilterIcon />
                                </SvgIcon>{' '}
                                {t('filter.filterby')}:
                            </h3>
                            <div className="filters-wrap">
                                {/*
                                <SpatialTemporalSearchFilter
                                    filtertitle={t('filter.spatemp.title')}
                                    filtervalues={spatemps[language]}
                                    filterselected={spatempfilters}
                                    selectFilters={handleSpatemp}
                                    onBoundboxChange={handleBoundboxChange}
                                    onCenterChange={handleCenterChange}
                                    onZoomChange={handleZoomChange}
                                    filtername="spatemp"
                                    externalLabel
                                    direction={isMobile ? 'column' : 'row'}
                                    temporalDirection={isMobile ? 'row' : 'column'}
                                    gridWidth={isMobile ? '100%' : '50%'}
                                />
                                */}
                                {/*
                                <SearchFilter
                                    filtertitle={t('filter.stac')}
                                    filtervalues={stacs[language]}
                                    filterselected={stacfilters}
                                    selectFilters={handleStac}
                                    filtername="stac"
                                    externalLabel
                                    labelParams={stacLabelParams}
                                />
                                */}
                                <SearchFilter
                                    filtertitle={t('filter.organisations')}
                                    filtervalues={organisations[language]}
                                    filterselected={orgfilters}
                                    selectFilters={handleOrg}
                                />
                                <SearchFilter
                                    filtertitle={t('filter.types')}
                                    filtervalues={types[language]}
                                    filterselected={typefilters}
                                    selectFilters={handleType}
                                />
                                {/*
                                <SearchFilter
                                    filtertitle={t('filter.spatial')}
                                    filtervalues={spatials[language]}
                                    filterselected={spatialfilters}
                                    selectFilters={handleSpatial}
                                    filtername="spatial"
                                    externalLabel
                                    labelParams={spatialLabelParams}
                                />
                                */}
                                <SearchFilter
                                    filtertitle={t('filter.themes')}
                                    filtervalues={themes[language]}
                                    filterselected={themefilters}
                                    selectFilters={handleTheme}
                                />

                                <div className={ofOpen ? 'filter-wrap open' : 'filter-wrap'}>
                                    <button
                                        type="button"
                                        className="link-button filter-title"
                                        aria-expanded={ofOpen ? 'true' : 'false'}
                                        onClick={() => setOfOpen(!ofOpen)}
                                    >
                                        {t('filter.otherfilters')}
                                    </button>
                                    <SearchFilter
                                        filtertitle={t('filter.foundational')}
                                        filtervalues={[]}
                                        filterselected={foundational ? [1] : []}
                                        selectFilters={handleFound}
                                    />
                                </div>
                            </div>
                            <div className="filter-actions d-flex justify-content-end">
                                <button
                                    type="button"
                                    className={fReset ? 'btn search-btn submit' : 'btn search-btn submit disabled'}
                                    onClick={fReset ? applyFilters : undefined}
                                >
                                    {t('filter.applyfilters')}
                                </button>
                                <button type="button" className="btn search-btn clear" onClick={clearAll}>
                                    {t('filter.clearall')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="container-fluid container-results" aria-live="assertive" aria-busy={loading ? 'true' : 'false'}>
                {cnt > 0 && (!loading || cpn) && (
                    <Pagination
                        rpp={rpp}
                        ppg={ppg}
                        rcnt={cnt}
                        current={pn}
                        loading={loading}
                        selectPage={
                            ksOnly
                                ? (pnum: number) => handleKOSearch(initKeyword, pnum)
                                : (pnum: number) => handleSearch(initKeyword, initBounds, pnum)
                        }
                    />
                )}
                {loading ? (
                    <div className="col-12 col-beat-loader">
                        <BeatLoader color="#515aa9" />
                    </div>
                ) : !Array.isArray(results) || results.length === 0 || results[0].id === undefined ? (
                    <div className="col-12 col-search-message">{t('page.noresult')}</div>
                ) : (
                    <div className="row row-results rowDivider">
                        {ksOnly
                            ? results.map((result: SearchResult, mindex: number) => {
                                const coordinates = JSON.parse(result.coordinates);
                                const keywords = result.keywords.substring(0, result.keywords.length - 2).split(',');
                                const allkwshowing = allkw.findIndex((ak) => ak === result.id) > -1;
                                const dist = Math.max(
                                    Math.abs(coordinates[0][2][1] - coordinates[0][0][1]),
                                    Math.abs(coordinates[0][1][0] - coordinates[0][0][0])
                                );
                                const resolution = (40.7436654315252 * dist * 11132) / 15;
                                const zoom = Math.max(Math.log2(3600000 / resolution), 1);
                                // console.log(coordinates[0][2][1] - coordinates[0][0][1], coordinates[0][1][0] - coordinates[0][0][0], zoom);
                                return (
                                    <div key={result.id} className="container-fluid search-result">
                                        <div className="row resultRow">
                                            <div className={ksOnly ? 'col-lg-8' : 'col-lg-12'}>
                                                <h2 className="search-title">{result.title}</h2>
                                                {ksOnly && (
                                                    <div className="search-keywords">
                                                        <div
                                                            className={
                                                                allkwshowing
                                                                    ? 'btn-group btn-group-keywords'
                                                                    : 'btn-group btn-group-keywords less'
                                                            }
                                                            role="toolbar"
                                                            aria-label="Keywords"
                                                        >
                                                            {keywords.map((keyword, ki) => {
                                                                return (
                                                                    <button
                                                                        type="button"
                                                                        className={ki < 5 ? 'btn btn-keyword' : 'btn btn-keyword more'}
                                                                        key={ki}
                                                                        onClick={() => handleKeyword(keyword)}
                                                                        autoFocus={cpn && mindex === 0 && ki === 0 ? true : false}
                                                                    >
                                                                        {keyword}
                                                                    </button>
                                                                );
                                                            })}
                                                            {keywords.length > 5 && (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-keyword-more"
                                                                    onClick={() => handleKwshowing(result.id)}
                                                                    aria-expanded={allkwshowing}
                                                                >
                                                                    {allkwshowing ? t('page.showless') : t('page.viewmore')}
                                                                    {allkwshowing ? (
                                                                        <span className="sr-only">{t('page.showlessnotice')}</span>
                                                                    ) : (
                                                                        <span className="sr-only">{t('page.viewmorenotice')}</span>
                                                                    )}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="search-meta">
                                                    <ul className="list list-unstyled">
                                                        <li className="list-item">
                                                            <strong>{t('page.organisation')}:</strong> {result.organisation}
                                                        </li>
                                                        <li className="list-item">
                                                            <strong>{t('page.published')}:</strong> {result.published}
                                                        </li>
                                                    </ul>
                                                </div>
                                                <p className="search-desc">
                                                    {result.description
                                                        .replace(/\\n\\n/g, ' ')
                                                        .replace(/\\n/g, ' ')
                                                        .substr(0, 240)}{' '}
                                                    {result.description.replace(/\\n\\n/g, ' ').replace(/\\n/g, ' ').length > 240 ? (
                                                        <span>...</span>
                                                    ) : (
                                                        ''
                                                    )}
                                                </p>
                                                <div className="search-result-buttons">
                                                    <button
                                                        type="button"
                                                        className="btn btn-search"
                                                        onMouseUp={(e) => handleView(e, result.id, result.title)}
                                                        aria-label={result.title}
                                                        autoFocus={cpn && keywords.length === 0 && mindex === 0 ? true : false}
                                                    >
                                                        {t('page.viewrecord')} <i className="fas fa-long-arrow-alt-right" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                <div className="search-image">
                                                    <MapContainer
                                                        center={[
                                                            (coordinates[0][2][1] + coordinates[0][0][1]) / 2,
                                                            (coordinates[0][1][0] + coordinates[0][0][0]) / 2,
                                                        ]}
                                                        zoomControl={false}
                                                        zoom={zoom}
                                                        attributionControl={false}
                                                    >
                                                        <TileLayer
                                                            url="https://maps-cartes.services.geo.ca/server2_serveur2/rest/services/BaseMaps/CBMT_CBCT_GEOM_3857/MapServer/WMTS/tile/1.0.0/BaseMaps_CBMT_CBCT_GEOM_3857/default/default028mm/{z}/{y}/{x}.jpg"
                                                            attribution={t('mapctrl.attribution')}
                                                        />
                                                        <AttributionControl position="bottomleft" prefix={false} />
                                                        <NavBar />
                                                        <GeoJSON
                                                            key={result.id}
                                                            data={{
                                                                type: 'Feature',
                                                                properties: { id: result.id, tag: 'geoViewGeoJSON' },
                                                                geometry: { type: 'Polygon', coordinates },
                                                            }}
                                                        />
                                                    </MapContainer>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                            : results.map((result: SearchResult, mindex: number) => (
                                <div
                                    key={result.id}
                                    className={
                                        selected === result.id && open === true
                                            ? 'col-sm-12 searchResult selected'
                                            : 'col-sm-12 searchResult'
                                    }
                                >
                                    <h3 className="searchTitle">{result.title}</h3>
                                    <div>
                                        <p className="searchFields">
                                            <strong>{t('page.organisation')}:</strong> {result.organisation}
                                        </p>
                                        <p className="searchFields">
                                            <strong>{t('page.published')}:</strong> {result.published}
                                        </p>
                                        <p className="searchDesc">
                                            {result.description
                                                .replace(/\\n\\n/g, ' ')
                                                .replace(/\\n/g, ' ')
                                                .substr(0, 240)}{' '}
                                            {result.description.replace(/\\n\\n/g, ' ').replace(/\\n/g, ' ').length > 240 ? (
                                                <span>...</span>
                                            ) : (
                                                ''
                                            )}
                                        </p>
                                        <div className="searchResultButtons">
                                            <button
                                                type="button"
                                                className="btn btn-sm searchButton"
                                                onClick={() => handleSelect(result.id)}
                                                aria-label={result.id}
                                                autoFocus={cpn && mindex === 0 ? true : false}
                                            >
                                                {selected === result.id && open === true
                                                    ? t('page.removefootprint')
                                                    : t('page.viewfootprint')}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-sm searchButton"
                                                onMouseUp={(e) => handleView(e, result.id, result.title)}
                                                aria-label={result.title}
                                            >
                                                {t('page.viewrecord')} <i className="fas fa-long-arrow-alt-right" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
                {cnt > 0 && (!loading || cpn) && (
                    <Pagination
                        rpp={rpp}
                        ppg={ppg}
                        rcnt={cnt}
                        current={pn}
                        loading={loading}
                        selectPage={
                            ksOnly
                                ? (pnum: number) => handleKOSearch(initKeyword, pnum)
                                : (pnum: number) => handleSearch(initKeyword, initBounds, pnum)
                        }
                    />
                )}
            </div>
            {!ksOnly && loading && <div className="searching-cover" />}
        </div>
    );
};

interface SearchParams {
    keyword: string;
    north: number;
    east: number;
    south: number;
    west: number;
    lang: string;
    min: number;
    max: number;
    theme?: string;
    org?: string;
    type?: string;
    spatial?: string;
    foundational?: 'true';
    sort?: string;
    stac?: string;
    begin?: string;
    end?: string;
    bbox?: string;
}
interface KOSearchParams {
    keyword: string;
    keyword_only: 'true' | 'false';
    lang: string;
    min: number;
    max: number;
    theme?: string;
    org?: string;
    type?: string;
    foundational?: 'true';
    sort?: string;
    spatial?: string;
    stac?: string;
    datetime?: string;
    bbox?: string;
}

interface SearchResult {
    row_num: number;
    id: string;
    coordinates: string;
    title: string;
    description: string;
    published: string;
    keywords: string;
    options: [];
    contact: [];
    created: string;
    spatialRepresentation: string;
    type: string;
    temporalExtent: unknown;
    graphicOverview: [];
    language: string;
    organisation: string;
    total: number;
}

export default GeoSearch;
