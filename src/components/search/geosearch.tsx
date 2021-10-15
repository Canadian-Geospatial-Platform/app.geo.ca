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
import React, { useState, createRef, useEffect, ChangeEvent } from 'react';
import { StoreEnhancer } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import BeatLoader from 'react-spinners/BeatLoader';
import { useMap, MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@material-ui/icons/Search';
import SvgIcon from "@material-ui/core/SvgIcon";
import FilterIcon from '../../assets/icons/filter.svg';
import { loadState } from '../../reducers/localStorage';
import { NavBar } from '../navbar/nav-bar';
import { envglobals } from '../../common/envglobals';
import {analyticPost, AnalyticParams} from '../../common/analytic';
import SearchFilter from '../searchfilter/searchfilter';
import Pagination from '../pagination/pagination';
import { setFilters, setOrgFilter, setTypeFilter, setThemeFilter, setFoundational } from '../../reducers/action';
import organisations from './organisations.json';
import types from './types.json';
import themes from './themes.json';
import './geosearch.scss';

const GeoSearch = (showing: boolean, ksOnly: boolean, setKeyword: (kw:string)=>void, setKSOnly: (kso:boolean)=>void, initKeyword?: string): JSX.Element => {
    const { t } = useTranslation();
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
    const analyticParams = {loc: '/', lang: language, type: 'search', event: 'search'};
    const storeorgfilters = useSelector((state) => state.mappingReducer.orgfilter);
    const storetypefilters = useSelector((state) => state.mappingReducer.typefilter);
    const storethemefilters = useSelector((state) => state.mappingReducer.themefilter);
    const storefoundational = useSelector((state) => state.mappingReducer.foundational);
    const dispatch = useDispatch();
    const [orgfilters, setOrg] = useState(storeorgfilters);
    const [typefilters, setType] = useState(storetypefilters);
    const [themefilters, setTheme] = useState(storethemefilters);
    const [foundational, setFound] = useState(storefoundational);
    const [fReset, setFReset] = useState(false);
    const [filterbyshown, setFilterbyshown] = useState(false);
    const [ofOpen, setOfOpen] = useState(false);
    const [allkw, setKWShowing] = useState<string[]>([]);
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
                event: 'footprint'
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
        const result = Array.isArray(results) && results.length > 0 && cardOpen ? results.find((r: SearchResult) => r.id === event) : undefined;

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

  const handleView = (evt:React.MouseEvent<HTMLButtonElement>, id:string) => {
    evt.stopPropagation();
    const viewParams: AnalyticParams = {
        search: analyticParams.search,
        geo: JSON.stringify(analyticParams.geo),
        uuid: id, 
        loc: '/',
        lang: language,
        type: 'access',
        event: 'view'
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
    window.open(`/result?id=${encodeURI(id.trim())}&lang=${language}`, `_blank`);
  }

    const handleChange = (e: ChangeEvent) => {
        e.preventDefault();
        setKeyword((e.target as HTMLInputElement).value);
    };

    const eventHandler = (event: unknown, keyword: string, bounds: unknown) => {
        const mbounds = event.target.getBounds();
        // console.log(mbounds,bounds);
        map.off('moveend');
        // console.log('status:', loading, 'keyword', keyword,initKeyword);
        if (!loading && mapCount === 0 && !Object.is(mbounds, bounds)) {
            // console.log('research:', loading, keyword, mapCount);
            mapCount++;
            setLoadingStatus(true);
            handleSearch(keyword, mbounds);
        }
    };

    const handleSearch = (keyword: string, bounds: unknown, pnum?:number) => {
        const cpr = pnum!==undefined ? true:false;
        setPn(cpr);
        !loading && setLoadingStatus(true);
        const pageNumber = pnum!==undefined ? pnum: 1;

        const localState: StoreEnhancer<unknown, unknown> | undefined = loadState();
        const ofilters = localState !== undefined ? localState.mappingReducer.orgfilter : [];
        const tfilters = localState !== undefined ? localState.mappingReducer.typefilter : [];
        const thfilters = localState !== undefined ? localState.mappingReducer.themefilter : [];
        const found = localState !== undefined ? localState.mappingReducer.foundational : false;
        // const MappingState = getMappingState();
        const searchParams: SearchParams = {
            north: bounds._northEast.lat,
            east: bounds._northEast.lng,
            south: bounds._southWest.lat,
            west: bounds._southWest.lng,
            keyword,
            lang: language,
            min: (pageNumber - 1) * rpp + 1,
            max: pageNumber * rpp,
        };
        const aParams = Object.assign(analyticParams);
        aParams.search = keyword;
        aParams.geo = JSON.stringify(bounds);
       
        if (thfilters.length > 0) {
            const themeArray = thfilters.map((fs: number) => themes[language][fs].toLowerCase().replace(/\'/g,"\'\'"));
            searchParams.theme = themeArray.join('|');
            aParams.theme = themeArray;
        } else if (aParams.theme) {
            delete aParams.theme;
        }

        if (ofilters.length > 0) {
            const orgArray = ofilters.map((fs: number) => organisations[language][fs].toLowerCase().replace(/\'/g,"\'\'"));
            searchParams.org = orgArray.join('|');
            aParams.org = orgArray;
        } else if (aParams.org) {
            delete aParams.org;
        }

        if (tfilters.length > 0) {
            const typeArray = tfilters.map((fs: number) => types[language][fs].toLowerCase().replace(/\'/g,"\'\'"));
            searchParams.type = typeArray.join('|');
            aParams.type_filter = typeArray;
        } else if (aParams.type_filter) {
            delete aParams.type_filter;
        }

        if (found) {
            searchParams.foundational = 'true';
            aParams.foundational = 'true';
        } else if (aParams.foundational) {
            delete aParams.foundational;
        }
        
        // console.log(searchParams);
        dispatch(setFilters({ orgfilter: ofilters, typefilter: tfilters, themefilter: thfilters, foundational: found }));
        
        axios.get(envglobals().APP_API_SEARCH_URL, { params: searchParams })
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
                setBounds(bounds);
                // setAnalyticParams(aParams);
                setKeyword(keyword);
                // if (!cpr && pn!==1) {
                setPageNumber(pageNumber);
                // }
                setLoadingStatus(false);
                // setOrg(ofilters);
                // setType(tfilters);
                // setTheme(thfilters);
                // setFound(found);
                if (selected !== 'search' && open && res.find((r: SearchResult) => r.id === selected)) {
                    setSelected('search');
                    setOpen(false);
                    selectResult(undefined);
                }
                map.on('moveend', (event) => eventHandler(event, keyword, initBounds));
                mapCount = 0;
            })
            .catch((error) => {
                console.log(error);
                setResults([]);
                setCount(0);
                setPn(false);
                setPageNumber(1);
                setBounds(bounds);
                // setAnalyticParams(aParams);
                setKeyword(keyword);
                setSelected('search');
                setOpen(false); 
                selectResult(undefined);
                setLoadingStatus(false);
                // setOrg(ofilters);
                // setType(tfilters);
                // setTheme(thfilters);
                // setFound(found);
                map.on('moveend', (event) => eventHandler(event, keyword, initBounds));
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
    }

    const applyFilters = () => {
        dispatch(setFilters({ orgfilter: orgfilters, typefilter: typefilters, themefilter: themefilters, foundational }));
        setFReset(false);
        // setPageNumber(1);
    };

    const clearAll = () => {
        setOrg([]);
        setType([]);
        setTheme([]);
        setFound(false);
        dispatch(setFilters({ orgfilter: [], typefilter: [], themefilter: [], foundational: false }));
        setFReset(false);
        // setPageNumber(1);
    };

    const handleKOSearch = (keyword: string, pnum?: number) => {
        const cpr = pnum!==undefined;
        // const currentLang = (!sfloaded && queryParams.lang !== undefined)?queryParams.lang:language;
        setPn(cpr);
        setLoading(true);
        const pageNumber = pnum!==undefined ? pnum : 1;
        const localState: StoreEnhancer<unknown, unknown> | undefined = loadState();
        const ofilters = localState !== undefined ? localState.mappingReducer.orgfilter : [];
        const tfilters = localState !== undefined ? localState.mappingReducer.typefilter : [];
        const thfilters = localState !== undefined ? localState.mappingReducer.themefilter : [];
        const found = localState !== undefined ? localState.mappingReducer.foundational : false;
        const searchParams: KOSearchParams = {
            keyword,
            keyword_only: 'true',
            lang: language,
            min: (pageNumber - 1) * rpp + 1,
            max: pageNumber * rpp,
        };

        const aParams = Object.assign(analyticParams);
        aParams.search = keyword;
        if (thfilters.length > 0) {
            const themeArray = thfilters.map((fs: number) => themes[language][fs].toLowerCase().replace(/\'/g,"\'\'"));
            searchParams.theme = themeArray.join('|');
            aParams.theme = themeArray;
        } else if (aParams.theme) {
            delete aParams.theme;
        }
        if (ofilters.length > 0) {
            const orgArray = ofilters.map((fs: number) => organisations[language][fs].toLowerCase().replace(/\'/g,"\'\'"));
            searchParams.org = orgArray.join('|');
            aParams.org = orgArray;
        } else if (aParams.org) {
            delete aParams.org;
        }
        if (tfilters.length > 0) {
            const typeArray = tfilters.map((fs: number) => types[language][fs].toLowerCase().replace(/\'/g,"\'\'"));
            searchParams.type = typeArray.join('|');
            aParams.type_filter = typeArray;
        } else if (aParams.type_filter) {
            delete aParams.type_filter;
        }
        if (found) {
            searchParams.foundational = 'true';
            aParams.foundational = 'true';
        } else if (aParams.foundational) {
            delete aParams.foundational;
        }

        dispatch(setFilters({ orgfilter: ofilters, typefilter: tfilters, themefilter: thfilters, foundational: found }));
        // console.log(searchParams);
        axios.get(envglobals().APP_API_SEARCH_URL, { params: searchParams })
            .then((response) =>  {
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
                setKWShowing([]);
                setKeyword(keyword);
                // setAnalyticParams(aParams);
                setLoading(false);
                setOrg(ofilters);
                setType(tfilters);
                setTheme(thfilters);
                setFound(found);
                // setSF(true);
            })
            .catch(() => {
                // console.log(error);
                setResults([]);
                setPn(false);
                setCount(0);
                setPageNumber(1);
                setKWShowing([]);
                setKeyword(keyword);
                // setAnalyticParams(aParams);
                setLoading(false);
                setOrg(ofilters);
                setType(tfilters);
                setTheme(thfilters);
                setFound(found);
                // setSF(true);
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

    const clearFound = () => {
        dispatch(setFoundational(false));
        setFound(false);
        setFReset(false);
    };

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
                    handleKOSearch(initKeyword);
                }    
            } else {
                handleSearch(initKeyword, initBounds);
            }    
        }
        const handleResize = () => {
            setPPG(window.innerWidth > 600 ? 8 : window.innerWidth > 400 ? 5 : 3);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [showing, ksOnly, fReset, language, storeorgfilters, storetypefilters, storethemefilters, storefoundational]);
    // map.on('moveend', event=>eventHandler(event,initKeyword, initBounds));

    // console.log(storethemefilters);
    // console.log(loading, cpn, cnt);
    return (
        <div className="geoSearchContainer">
            <div className={ksOnly?"container-fluid container-search input-container":"searchInput input-container"}>
                <div className={ksOnly?"col-12 col-search-input":"searchInput"}>
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
                <div className={ksOnly?"col-12 col-advanced-filters-button":"col-advanced-filters-button"}>    
                    <span>{t('appbar.keywordonly')}</span>
                    <label className="switch">
                        <input type="checkbox" disabled={loading} checked={ksOnly} onChange={()=>ksToggle(!ksOnly)} />
                        <span className="slider round"></span>
                    </label>
                {ksOnly && <button
                        className={filterbyshown ? 'advanced-filters-button link-button open' : 'advanced-filters-button link-button'}
                        disabled={loading}
                        type="button"
                        onClick={!loading ? () => setFilterbyshown(!filterbyshown) : undefined}
                        aria-expanded={filterbyshown ? 'true' : 'false'}
                    >
                        {t('page.advancedsearchfilters')}
                    </button>
                }    
                </div>
            </div>
            {storetypefilters.length + storeorgfilters.length + storethemefilters.length + (storefoundational ? 1 : 0) > 0 && (
                <div className={ksOnly?"container-fluid container-search-filters-active":"searchFilters"}>
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
                                <SvgIcon><FilterIcon /></SvgIcon> {t('filter.filterby')}:
                            </h3>
                            <div className="filters-wrap">
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
                {cnt > 0 && (!loading || cpn ) && <Pagination rpp={rpp} ppg={ppg} rcnt={cnt} current={pn} loading={loading} selectPage={ksOnly?(pnum:number)=>handleKOSearch(initKeyword, pnum):(pnum:number)=>handleSearch(initKeyword, initBounds, pnum)} />}
                {loading ? (
                    <div className="col-12 col-beat-loader">
                        <BeatLoader color="#515aa9" />
                    </div>
                ) : !Array.isArray(results) || results.length === 0 || results[0].id === undefined ? (
                    <div className="col-12 col-search-message">{t('page.changesearch')}</div>
                ) : (
                    <div className="row row-results rowDivider">
                    {ksOnly?results.map((result: SearchResult, mindex:number) => {
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
                                        <div className={ksOnly?"col-lg-8":"col-lg-12"}>
                                            <h2 className="search-title">{result.title}</h2>
                                            {ksOnly && 
                                            <div className="search-keywords">
                                                <div
                                                    className={
                                                        allkwshowing ? 'btn-group btn-group-keywords' : 'btn-group btn-group-keywords less'
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
                                                                autoFocus = {cpn && mindex===0 && ki===0?true:false}
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
                                            </div> }
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
                                                {result.description.substr(0, 240)}{' '}
                                                {result.description.length > 240 ? <span>...</span> : ''}
                                            </p>
                                            <div className="search-result-buttons">
                                                <button
                                                    type="button"
                                                    className="btn btn-search"
                                                    onClick={(e) => handleView(e, result.id)}
                                                    aria-label={result.title}
                                                    autoFocus = {cpn && keywords.length===0 && mindex===0?true:false}
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
                                                >
                                                    <TileLayer
                                                        url="https://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/CBMT_CBCT_GEOM_3857/MapServer/WMTS/tile/1.0.0/BaseMaps_CBMT_CBCT_GEOM_3857/default/default028mm/{z}/{y}/{x}.jpg"
                                                        attribution={t('mapctrl.attribution')}
                                                    />
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
                            )
                        }) 
                        :
                        results.map((result: SearchResult, mindex:number) => (
                            <div
                                key={result.id}
                                className={
                                    selected === result.id && open === true ? 'col-sm-12 searchResult selected' : 'col-sm-12 searchResult'
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
                                        {result.description.substr(0, 240)} {result.description.length > 240 ? <span>...</span> : ''}
                                    </p>
                                    <div className="searchResultButtons">
                                        <button
                                            type="button"
                                            className="btn btn-sm searchButton"
                                            onClick={() => handleSelect(result.id)}
                                            aria-label={result.id}
                                            autoFocus = {cpn && mindex===0?true:false}
                                        >
                                            {selected === result.id && open === true? t('page.removefootprint') : t('page.viewfootprint')}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm searchButton"
                                            onClick={(e) => handleView(e, result.id)}
                                            aria-label={result.title}

                                        >
                                            {t('page.viewrecord')} <i className="fas fa-long-arrow-alt-right" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) }
                    </div>
                )}
                {cnt > 0 && (!loading || cpn ) && <Pagination rpp={rpp} ppg={ppg} rcnt={cnt} current={pn} loading={loading} selectPage={ksOnly?(pnum:number)=>handleKOSearch(initKeyword, pnum):(pnum:number)=>handleSearch(initKeyword, initBounds, pnum)} />}
            </div>
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
    foundational?: 'true';
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
