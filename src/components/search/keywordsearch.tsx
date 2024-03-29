/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, createRef, useEffect, ChangeEvent } from 'react';
import { useLocation, useHistory } from 'react-router';
import { StoreEnhancer } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import BeatLoader from 'react-spinners/BeatLoader';
import { useTranslation } from 'react-i18next';
// import i18n from '../../assets/i18n/i18n';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import SvgIcon from '@material-ui/core/SvgIcon';
import SearchIcon from '@material-ui/icons/Search';
import FilterIcon from '../../assets/icons/filter.svg';
import { loadState } from '../../reducers/localStorage';
import { NavBar } from '../navbar/nav-bar';
import { getQueryParams } from '../../common/queryparams';
import { envglobals } from '../../common/envglobals';
import { analyticPost, AnalyticParams } from '../../common/analytic';
import SearchFilter from '../searchfilter/searchfilter';
import Pagination from '../pagination/pagination';
import { setFilters, setOrgFilter, setTypeFilter, setThemeFilter, setSpatialFilter, setFoundational } from '../../reducers/action';
import organisations from './organisations.json';
import types from './types.json';
import themes from './themes.json';
import spatials from './spatials.json';
import stacs from './stac.json';
// import { css } from '@emotion/core';
import './keywordsearch.scss';
import { SpatialData, StacData } from '../../app';

const EnvGlobals = envglobals();

const KeywordSearch = (): JSX.Element => {
    const location = useLocation();
    const queryParams: { [key: string]: string } = getQueryParams(location.search);
    const history = useHistory();
    const { t } = useTranslation();
    const rpp = 10;
    const [spatialData] = useState<SpatialData>(useSelector((state) => state.mappingReducer.spatialData));
    const spatialLabelParams = [];
    const [stacData] = useState<StacData>(useSelector((state) => state.mappingReducer.stacData));
    const stacLabelParams = [];
    const [ppg, setPPG] = useState(window.innerWidth > 600 ? 8 : window.innerWidth > 400 ? 6 : 4);
    const [sfloaded, setSF] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allkw, setKWShowing] = useState<string[]>([]);
    const [pn, setPageNumber] = useState(1);
    const [cpn, setPn] = useState(false);
    const [cnt, setCount] = useState(0);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [initKeyword, setKeyword] = useState(queryParams && queryParams.keyword ? queryParams.keyword.trim().replaceAll('+', ' ') : '');
    // const store = useStore();
    const storeorgfilters = useSelector((state) => state.mappingReducer.orgfilter);
    const storetypefilters = useSelector((state) => state.mappingReducer.typefilter);
    const storethemefilters = useSelector((state) => state.mappingReducer.themefilter);
    const storefoundational = useSelector((state) => state.mappingReducer.foundational);
    const storespatialfilters = useSelector((state) => (state.mappingReducer.spatialfilter ? state.mappingReducer.spatialfilter : []));
    const storestacfilters = useSelector((state) => (state.mappingReducer.stacfilter ? state.mappingReducer.stacfilter : []));
    const dispatch = useDispatch();
    const [orgfilters, setOrg] = useState(storeorgfilters);
    const [typefilters, setType] = useState(storetypefilters);
    const [themefilters, setTheme] = useState(storethemefilters);
    const [spatialfilters, setSpatial] = useState(storespatialfilters);
    const [stacfilters, setStac] = useState(storestacfilters);
    const [foundational, setFound] = useState(storefoundational);
    const [fReset, setFReset] = useState(false);
    const [filterbyshown, setFilterbyshown] = useState(false);
    const [ofOpen, setOfOpen] = useState(false);
    const language = t('app.language');
    const [analyticParams, setAnalyticParams] = useState({ loc: '/search', lang: language, type: 'search', event: 'search' });

    const inputRef: React.RefObject<HTMLInputElement> = createRef();

    // console.log(language);
    const applyFilters = () => {
        dispatch(
            setFilters({
                orgfilter: orgfilters,
                typefilter: typefilters,
                themefilter: themefilters,
                spatialfilter: spatialfilters,
                foundational,
                stacfilter: stacfilters,
            })
        );
        setFReset(false);
        // setPageNumber(1);
    };

    const clearAll = () => {
        setOrg([]);
        setType([]);
        setTheme([]);
        setStac([]);
        setFound(false);
        dispatch(setFilters({ orgfilter: [], typefilter: [], themefilter: [], spatialfilter: [], foundational: false, stacfilter: [] }));
        setFReset(false);
        // setPageNumber(1);
    };

    const handleSearch = (keyword: string, pnum?: number) => {
        const cpr = pnum !== undefined;
        const currentLang = !sfloaded && queryParams.lang !== undefined ? queryParams.lang : language;
        setPn(cpr);
        setLoading(true);
        const pageNumber = pnum !== undefined ? pnum : 1;
        const localState: StoreEnhancer<unknown, unknown> | undefined = loadState();
        const ofilters = localState !== undefined ? localState.mappingReducer.orgfilter : [];
        const tfilters = localState !== undefined ? localState.mappingReducer.typefilter : [];
        const thfilters = localState !== undefined ? localState.mappingReducer.themefilter : [];
        const spafilters = localState !== undefined ? localState.mappingReducer.spafilter : [];
        const stfilters = localState !== undefined ? (localState.mappingReducer.stfilter ? localState.mappingReducer.stfilter : []) : [];
        const found = localState !== undefined ? localState.mappingReducer.foundational : false;
        const searchParams: SearchParams = {
            keyword,
            keyword_only: 'true',
            lang: currentLang,
            min: (pageNumber - 1) * rpp + 1,
            max: pageNumber * rpp,
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
            searchParams.type = spatialArray.join('|');
            aParams.spatial = spatialArray;
        } else if (aParams.spatial) {
            delete aParams.spatial;
        }
        if (spafilters.length > 0) {
            const stArray = stfilters.map((fs: number) => stacs[language][fs].toLowerCase().replace(/\'/g, "''"));
            searchParams.type = stArray.join('|');
            aParams.stac = stArray;
        } else if (aParams.stac) {
            delete aParams.stac;
        }
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
            })
        );

        // console.log(searchParams);
        axios
            .get(`${EnvGlobals.APP_API_DOMAIN_URL}${EnvGlobals.APP_API_ENDPOINTS.SEARCH}`, { params: searchParams, headers: {} })
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
                setKWShowing([]);
                setKeyword(keyword);
                setAnalyticParams(aParams);
                setLoading(false);
                setOrg(ofilters);
                setType(tfilters);
                setTheme(thfilters);
                setSpatial(spafilters);
                setStac(stfilters);
                setFound(found);
                setSF(true);
            })
            .catch(() => {
                // console.log(error);
                setResults([]);
                setPn(false);
                setCount(0);
                setPageNumber(1);
                setKWShowing([]);
                setKeyword(keyword);
                setAnalyticParams(aParams);
                setLoading(false);
                setOrg(ofilters);
                setType(tfilters);
                setTheme(thfilters);
                setSpatial(spafilters);
                setStac(stfilters);
                setFound(found);
                setSF(true);
            });
    };

    const handleChange = (e: ChangeEvent) => {
        if (e.target !== null) {
            e.preventDefault();
            setKeyword((e.target as HTMLInputElement).value);
        }
    };

    const handleSubmit = (event?: React.MouseEvent | undefined) => {
        if (event) {
            event.preventDefault();
        }

        const keyword = (inputRef.current as HTMLInputElement).value;
        // setPageNumber(1);
        handleSearch(keyword);
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode === 13) {
            handleSubmit();
        }
    };

    const handleView = (id: string) => {
        const viewParams: AnalyticParams = {
            uuid: id,
            loc: '/search',
            lang: language,
            type: 'access',
            event: 'view',
        };

        viewParams.search = analyticParams.search;
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
    };

    const handleKeyword = (keyword: string) => {
        window.open(`/search?keyword=${encodeURI(keyword.trim())}&lang=${language}`, `_blank`);
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
    const clearFound = () => {
        dispatch(setFoundational(false));
        setFound(false);
        setFReset(false);
    };

    /* const changePageNumber = (pagenumber: number) => {
        setPageNumber(pagenumber);
        handleSearch(initKeyword, true);
    }; */

    useEffect(() => {
        if (!fReset && !loading) {
            handleSearch(initKeyword);
        }
        const handleResize = () => {
            setPPG(window.innerWidth > 600 ? 8 : window.innerWidth > 400 ? 6 : 4);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [language, fReset, storeorgfilters, storetypefilters, storethemefilters, storespatialfilters, storefoundational]);

    // console.log(loading, cpn);
    spatialLabelParams.splice(0);
    spatialLabelParams.push(spatialData?.viewableOnTheMap);
    spatialLabelParams.push(spatialData?.notViewableOnTheMap);
    stacLabelParams.splice(0);
    stacLabelParams.push(stacData?.hnap);
    stacLabelParams.push(stacData?.stac);
    //console.log(spatialLabelParams);
    return (
        <div className="pageContainer keyword-search-page">
            {/* Filters / Search Bar */}
            <div className="container-fluid container-search">
                <div className="row row-search align-items-center">
                    <div className="col-12 col-search-nav">
                        <button
                            className="search-nav-button link-button"
                            disabled={loading}
                            type="button"
                            onClick={() => history.push(`/?keyword=${initKeyword}`)}
                        >
                            {t('page.gotogeosearchpage')}
                        </button>
                    </div>
                    <div className="col-12 col-search-input">
                        <input
                            placeholder={t('page.search')}
                            id="search-input"
                            type="search"
                            ref={inputRef}
                            value={initKeyword}
                            disabled={loading}
                            onChange={handleChange}
                            onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyUp(e)}
                            aria-label={t('appbar.search')}
                        />
                        <button
                            className="icon-button"
                            disabled={loading}
                            type="button"
                            onClick={!loading ? handleSubmit : undefined}
                            aria-label={t('appbar.search')}
                        >
                            <SearchIcon />
                        </button>
                    </div>
                    <div className="col-12 col-advanced-filters-button">
                        <button
                            className={filterbyshown ? 'advanced-filters-button link-button open' : 'advanced-filters-button link-button'}
                            disabled={loading}
                            type="button"
                            onClick={!loading ? () => setFilterbyshown(!filterbyshown) : undefined}
                            aria-expanded={filterbyshown ? 'true' : 'false'}
                        >
                            {t('page.advancedsearchfilters')}
                        </button>
                    </div>
                </div>
            </div>
            {storetypefilters.length +
                storeorgfilters.length +
                storethemefilters.length +
                storespatialfilters.length +
                storestacfilters.length +
                (storefoundational ? 1 : 0) >
                0 && (
                <div className="container-fluid container-search-filters-active">
                    <div className="row row-search-filters-active">
                        <div className="col-12">
                            <div className="btn-group btn-group-search-filters-active" role="toolbar" aria-label="Active filters">
                                {storetypefilters.map((typefilter: number) => (
                                    <button
                                        key={`tf-${typefilter}`}
                                        type="button"
                                        className="btn btn-filter"
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
                                        className="btn btn-filter"
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
                                        className="btn btn-filter"
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
                                        className="btn btn-filter"
                                        disabled={loading}
                                        onClick={!loading ? () => clearSpatialFilter(spatialfilter) : undefined}
                                    >
                                        {spatials[language][spatialfilter]} <i className="fas fa-times" />
                                    </button>
                                ))}
                                {storestacfilters.map((stacfilter: number) => (
                                    <button
                                        key={`stf-${stacfilter}`}
                                        type="button"
                                        className="btn btn-filter"
                                        disabled={loading}
                                        onClick={!loading ? () => clearStacFilter(stacfilter) : undefined}
                                    >
                                        {stacs[language][stacfilter]} <i className="fas fa-times" />
                                    </button>
                                ))}
                                {storefoundational && (
                                    <button
                                        type="button"
                                        className="btn btn-filter"
                                        disabled={loading}
                                        onClick={!loading ? clearFound : undefined}
                                    >
                                        {t('filter.foundational')} <i className="fas fa-times" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {filterbyshown && (
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
                                    filtertitle={t('filter.spatial')}
                                    filtervalues={spatials[language]}
                                    filterselected={spatialfilters}
                                    selectFilters={handleSpatial}
                                    filtername="spatial"
                                    externalLabel
                                    labelParams={spatialLabelParams}
                                />

                                <SearchFilter
                                    filtertitle={t('filter.stac')}
                                    filtervalues={stacs[language]}
                                    filterselected={stacfilters}
                                    selectFilters={handleStac}
                                    filtername="stac"
                                    externalLabel
                                    labelParams={stacLabelParams}
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
            {/* Pagination - Top */}
            <div className="container-fluid container-pagination container-pagination-top">
                <div className="row row-pagination row-pagination-top">
                    <div className="col-12">
                        {cnt > 0 && (!loading || cpn) && (
                            <Pagination
                                rpp={rpp}
                                ppg={ppg}
                                rcnt={cnt}
                                current={pn}
                                selectPage={(pnum: number) => handleSearch(initKeyword, pnum)}
                                loading={loading}
                            />
                        )}
                    </div>
                </div>
            </div>
            {/* Results */}
            <div className="container-fluid container-results" aria-live="assertive" aria-busy={loading ? 'true' : 'false'}>
                <div className="row row-results">
                    {loading ? (
                        <div className="col-12 col-beat-loader">
                            <BeatLoader color="#515aa9" />
                        </div>
                    ) : !Array.isArray(results) || results.length === 0 || results[0].id === undefined ? (
                        <div className="col-12 col-search-message">{t('page.noresult')}</div>
                    ) : (
                        results.map((result: SearchResult, mindex: number) => {
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
                                        <div className="col-lg-8">
                                            <h2 className="search-title">{result.title}</h2>
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
                                                            aria-expanded={allkwshowing ? true : false}
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
                                            <button
                                                type="button"
                                                className="btn btn-search"
                                                onClick={() => handleView(result.id)}
                                                aria-label={result.title}
                                                autoFocus={cpn && keywords.length === 0 && mindex === 0 ? true : false}
                                            >
                                                {t('page.viewrecord')} <i className="fas fa-long-arrow-alt-right" />
                                            </button>
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
                                                        url="https://maps-cartes.services.geo.ca/server2_serveur2/rest/services/BaseMaps/CBMT_CBCT_GEOM_3857/MapServer/WMTS/tile/1.0.0/BaseMaps_CBMT_CBCT_GEOM_3857/default/default028mm/{z}/{y}/{x}.jpg"
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
                            );
                        })
                    )}
                </div>
            </div>
            {/* Pagination - Bottom */}
            <div className="container-fluid container-pagination container-pagination-bottom">
                <div className="row row-pagination row-pagination-bottom">
                    <div className="col-12">
                        {cnt > 0 && (!loading || cpn) && (
                            <Pagination
                                rpp={rpp}
                                ppg={ppg}
                                rcnt={cnt}
                                current={pn}
                                selectPage={(pnum: number) => handleSearch(initKeyword, pnum)}
                                loading={loading}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface SearchParams {
    keyword: string;
    keyword_only: 'true' | 'false';
    lang: string;
    min: number;
    max: number;
    theme?: string;
    org?: string;
    type?: string;
    spatial?: string;
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

export default KeywordSearch;
