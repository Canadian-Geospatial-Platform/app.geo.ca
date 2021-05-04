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
import { useLocation } from 'react-router';
// import { Link } from "react-router-dom";
import { StoreEnhancer } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import BeatLoader from 'react-spinners/BeatLoader';
import { useMap } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@material-ui/icons/Search';
import { loadState } from '../../reducers/localStorage';
import { getQueryParams } from '../../common/queryparams';
import Pagination from '../pagination/pagination';
import { setFilters, setOrgFilter, setTypeFilter, setThemeFilter, setFoundational } from '../../reducers/action';
import organisations from './organisations.json';
import types from './types.json';
import themes from './themes.json';
import './geosearch.scss';

const GeoSearch = (showing: boolean): JSX.Element => {
    const location = useLocation();
    const queryParams = getQueryParams(location.search);
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
    const [initKeyword, setKeyword] = useState(queryParams && queryParams.keyword ? queryParams.keyword.trim() : '');
    const language = t('app.language');
    const storeorgfilters = useSelector((state) => state.mappingReducer.orgfilter);
    const storetypefilters = useSelector((state) => state.mappingReducer.typefilter);
    const storethemefilters = useSelector((state) => state.mappingReducer.themefilter);
    const storefoundational = useSelector((state) => state.mappingReducer.foundational);
    const dispatch = useDispatch();
    // const [orgfilters, setOrg] = useState(storeorgfilters);
    // const [typefilters, setType] = useState(storetypefilters);
    // const [themefilters, setTheme] = useState(storethemefilters);
    // const [foundational, setFound] = useState(storefoundational);
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
    window.open(`/result?id=${encodeURI(id.trim())}&lang=${language}`, `View Record ${id.trim()}`);
  }

    const handleChange = (e: ChangeEvent) => {
        e.preventDefault();
        setKeyword((e.target as HTMLInputElement).value);
    };

    const eventHandler = (event: unknown, keyword: string, bounds: unknown) => {
        const mbounds = event.target.getBounds();
        // console.log(mbounds,bounds);
        map.off('moveend', eventHandler);
        // console.log('status:', loading, 'keyword', keyword,initKeyword);
        if (!loading && mapCount === 0 && !Object.is(mbounds, bounds)) {
            // console.log('research:', loading, keyword, mapCount);
            mapCount++;
            setLoadingStatus(true);
            // setBounds(mbounds);
            // setPageNumber(1);
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
        if (thfilters.length > 0) {
            searchParams.themes = thfilters.map((fs: number) => themes[language][fs].replace(/\'/g,"\'\'")).join('|');
        }
        if (ofilters.length > 0) {
            searchParams.org = ofilters.map((fs: number) => organisations[language][fs].replace(/\'/g,"\'\'")).join('|');
        }
        if (tfilters.length > 0) {
            searchParams.type = tfilters.map((fs: number) => types[language][fs].replace(/\'/g,"\'\'")).join('|');
        }
        if (found) {
            searchParams.foundational = 'true';
        }
        // console.log(searchParams);
        dispatch(setFilters({ orgfilter: ofilters, typefilter: tfilters, themefilter: thfilters, foundational: found }));
        axios
            .get(' https://bkbu8krpzc.execute-api.ca-central-1.amazonaws.com/staging/search', { params: searchParams })
            .then((response) => response.data)
            .then((data) => {
                // console.log(data);
                const res = data.Items;
                const rcnt = res.length > 0 ? res[0].total : 0;
                setResults(res);
                setCount(rcnt);
                setBounds(bounds);
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
        handleSearch(keyword, initBounds);
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode === 13) {
            handleSubmit();
        }
    };

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

    /* useEffect(() => {
        if (showing && !loading) {
            handleSearch(initKeyword, initBounds, true);
        }
    }, [pn]); */

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
            handleSearch(initKeyword, initBounds);
        }
        const handleResize = () => {
            setPPG(window.innerWidth > 600 ? 8 : window.innerWidth > 400 ? 5 : 3);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [showing, language, storeorgfilters, storetypefilters, storethemefilters, storefoundational]);
    // map.on('moveend', event=>eventHandler(event,initKeyword, initBounds));

    // console.log(storethemefilters);
    // console.log(loading, cpn, cnt);
    return (
        <div className="geoSearchContainer">
            <div className="searchInput">
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
                    {' '}
                    <SearchIcon />{' '}
                </button>
            </div>
            {storetypefilters.length + storeorgfilters.length + storethemefilters.length + (storefoundational ? 1 : 0) > 0 && (
                <div className="searchFilters">
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
            <div className="container" aria-live="assertive" aria-busy={loading ? 'true' : 'false'}>
                {cnt > 0 && (!loading || cpn ) && <Pagination rpp={rpp} ppg={ppg} rcnt={cnt} current={pn} loading={loading} selectPage={(pnum:number)=>handleSearch(initKeyword, initBounds, pnum)} />}
                {loading ? (
                    <div className="d-flex justify-content-center">
                        <BeatLoader color="#515AA9" />
                    </div>
                ) : !Array.isArray(results) || results.length === 0 || results[0].id === undefined ? (
                    t('page.changesearch')
                ) : (
                    <div className="row rowDivider">
                        {results.map((result: SearchResult, mindex:number) => (
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
                        ))}
                    </div>
                )}
                {cnt > 0 && (!loading || cpn ) && <Pagination rpp={rpp} ppg={ppg} rcnt={cnt} current={pn} loading={loading} selectPage={(pnum:number)=>handleSearch(initKeyword, initBounds, pnum)} />}
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
    themes?: string;
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
