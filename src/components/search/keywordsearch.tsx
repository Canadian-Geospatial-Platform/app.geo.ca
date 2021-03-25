/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, createRef, useEffect, ChangeEvent } from 'react';
import { useLocation, useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import SearchIcon from '@material-ui/icons/Search';
import FilterIcon from '@material-ui/icons/Filter';
import axios from 'axios';
import BeatLoader from 'react-spinners/BeatLoader';
import { getQueryParams } from '../../common/queryparams';
import SearchFilter from '../searchfilter/searchfilter';
import Pagination from '../pagination/pagination';
import { setFilters, setOrgFilter, setTypeFilter, setThemeFilter, setFoundational } from '../../reducers/action';
import organisations from './organisations.json';
import types from './types.json';
import themes from './themes.json';
// import { css } from '@emotion/core';
import './keywordsearch.scss';

const KeywordSearch: React.FunctionComponent = () => {
    const location = useLocation();
    const queryParams: { [key: string]: string } = getQueryParams(location.search);
    const history = useHistory();
    const { t } = useTranslation();
    const rpp = 10;
    const [ppg, setPPG] = useState(window.innerWidth > 600 ? 8 : window.innerWidth > 400 ? 6 : 4);
    const [sfloaded, setSF] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allkw, setKWShowing] = useState<string[]>([]);
    const [pn, setPageNumber] = useState(1);
    const [cnt, setCount] = useState(0);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [initKeyword, setKeyword] = useState(queryParams && queryParams.keyword ? queryParams.keyword.trim() : '');
    // const store = useStore();
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
    const language = t('app.language');

    const inputRef: React.RefObject<HTMLInputElement> = createRef();

    // console.log(state, dispatch);
    const applyFilters = () => {
        dispatch(setFilters({ orgfilter: orgfilters, typefilter: typefilters, themefilter: themefilters, foundational }));
        setFReset(false);
        setPageNumber(1);
    };

    const clearAll = () => {
        setOrg([]);
        setType([]);
        setTheme([]);
        setFound(false);
        dispatch(setFilters({ orgfilter: [], typefilter: [], themefilter: [], foundational: false }));
        setFReset(false);
        setPageNumber(1);
    };

    const handleSearch = (keyword: string) => {
        setLoading(true);

        const searchParams: SearchParams = {
            keyword,
            keyword_only: 'true',
            lang: language,
            min: (pn - 1) * rpp + 1,
            max: cnt > 0 ? Math.min(pn * rpp, cnt) : pn * rpp,
        };
        if (storethemefilters.length > 0) {
            searchParams.themes = storethemefilters.map((fs: number) => themes[language][fs]).join('|');
        }
        if (storeorgfilters.length > 0) {
            searchParams.org = storeorgfilters.map((fs: number) => organisations[language][fs]).join('|');
        }
        if (storetypefilters.length > 0) {
            searchParams.type = storetypefilters.map((fs: number) => types[language][fs]).join('|');
        }
        if (storefoundational) {
            searchParams.foundational = 'true';
        }
        // console.log(searchParams);
        axios
            .get('https://hqdatl0f6d.execute-api.ca-central-1.amazonaws.com/dev/geo', { params: searchParams })
            .then((response) => response.data)
            .then((data) => {
                // console.log(data);
                const res = data.Items;
                const rcnt = res.length > 0 ? res[0].total : 0;
                setResults(res);
                setCount(rcnt);
                setKWShowing([]);
                setKeyword(keyword);
                setLoading(false);
            })
            .catch(() => {
                // console.log(error);
                setResults([]);
                setCount(0);
                setKWShowing([]);
                setKeyword(keyword);
                setLoading(false);
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
        setPageNumber(1);
        handleSearch(keyword);
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode === 13) {
            handleSubmit();
        }
    };

    const handleView = (id: string) => {
        window.open(`/#/result?id=${encodeURI(id.trim())}&lang=${language}`, `View Record ${id.trim()}`);
    };

    const handleKeyword = (keyword: string) => {
        window.open(`/#/search?keyword=${encodeURI(keyword.trim())}&lang=${language}`, `Search ${keyword.trim()}`);
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

    const handleFound = (found: unknown): void => {
        setFReset(true);
        setFound(found);
    };

    const clearOrgFilter = (filter: number) => {
        const newfilter = orgfilters.filter((fs: number) => fs !== filter);
        dispatch(setOrgFilter(newfilter));
        setOrg(newfilter);
        setFReset(false);
        setPageNumber(1);
    };

    const clearTypeFilter = (filter: number) => {
        const newfilter = typefilters.filter((fs: number) => fs !== filter);
        dispatch(setTypeFilter(newfilter));
        setType(newfilter);
        setFReset(false);
        if (pn > 1) {
            setPageNumber(1);
        } else {
            handleSearch(initKeyword);
        }
    };

    const clearThemeFilter = (filter: number) => {
        const newfilter = themefilters.filter((fs: number) => fs !== filter);
        dispatch(setThemeFilter(newfilter));
        setTheme(newfilter);
        setFReset(false);
        if (pn > 1) {
            setPageNumber(1);
        } else {
            handleSearch(initKeyword);
        }
    };

    const clearFound = () => {
        dispatch(setFoundational(false));
        setFound(false);
        setFReset(false);
        if (pn > 1) {
            setPageNumber(1);
        } else {
            handleSearch(initKeyword);
        }
    };

    useEffect(() => {
        if (!sfloaded) {
            if (queryParams.org !== undefined || queryParams.type !== undefined || queryParams.theme !== undefined) {
                const oIndex = (organisations[language] as string[]).findIndex((os: string) => os === queryParams.org);
                const tIndex = (types[language] as string[]).findIndex((ts: string) => ts === queryParams.type);
                const thIndex = (themes[language] as string[]).findIndex((ths: string) => ths === queryParams.theme);
                const orgfilter = oIndex > -1 ? [oIndex] : [];
                const typefilter = tIndex > -1 ? [tIndex] : [];
                const themefilter = thIndex > -1 ? [thIndex] : [];
                dispatch(setFilters({ orgfilter, typefilter, themefilter, foundational: false }));
                setOrg(orgfilter);
                setType(typefilter);
                setTheme(themefilter);
                setSF(true);
            }
        }

        if (!fReset) {
            // console.log(store.getState());
            // saveState(store.getState());
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
    }, [language, pn, fReset, sfloaded, queryParams.org, queryParams.type, queryParams.theme, dispatch]);

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
                        />
                        <button className="icon-button" disabled={loading} type="button" onClick={!loading ? handleSubmit : undefined}>
                            <SearchIcon />
                        </button>
                    </div>
                    <div className="col-12 col-advanced-filters-button">
                        <button
                            className={filterbyshown ? 'advanced-filters-button link-button open' : 'advanced-filters-button link-button'}
                            disabled={loading}
                            type="button"
                            onClick={!loading ? () => setFilterbyshown(!filterbyshown) : undefined}
                        >
                            {t('page.advancedsearchfilters')}
                        </button>
                    </div>
                </div>
            </div>
            {storetypefilters.length + storeorgfilters.length + storethemefilters.length + (storefoundational ? 1 : 0) > 0 && (
                <div className="container-fluid container-search-filters-active">
                    <div className="row row-search-filters-active">
                        <div className="col-12">
                            <div className="btn-group btn-group-search-filters-active" role="toolbar" aria-label="Active filters">
                                {storetypefilters.map((typefilter: number) => (
                                    <button
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
                                        type="button"
                                        className="btn btn-filter"
                                        disabled={loading}
                                        onClick={!loading ? () => clearThemeFilter(themefilter) : undefined}
                                    >
                                        {themes[language][themefilter]} <i className="fas fa-times" />
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
                                <FilterIcon /> {t('filter.filterby')}:
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
                                    <button type="button" className="link-button filter-title" onClick={() => setOfOpen(!ofOpen)}>
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
                        {cnt > 0 && <Pagination rpp={rpp} ppg={ppg} rcnt={cnt} current={pn} selectPage={setPageNumber} />}
                    </div>
                </div>
            </div>
            {/* Results */}
            <div className="container-fluid container-results">
                <div className="row row-results">
                    {loading ? (
                        <div className="col-12 col-beat-loader">
                            <BeatLoader color="#515aa9" />
                        </div>
                    ) : !Array.isArray(results) || results.length === 0 || results[0].id === undefined ? (
                        <div className="col-12 col-search-message">{t('page.changesearch')}</div>
                    ) : (
                        results.map((result: SearchResult) => {
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
                                        <div className="col-lg-4">
                                            <div className="search-image">
                                                <MapContainer
                                                    center={[
                                                        (coordinates[0][2][1] + coordinates[0][0][1]) / 2,
                                                        (coordinates[0][1][0] + coordinates[0][0][0]) / 2,
                                                    ]}
                                                    zoom={zoom}
                                                >
                                                    <TileLayer
                                                        url="https://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/CBMT_CBCT_GEOM_3857/MapServer/WMTS/tile/1.0.0/BaseMaps_CBMT_CBCT_GEOM_3857/default/default028mm/{z}/{y}/{x}.jpg"
                                                        attribution={t('mapctrl.attribution')}
                                                    />
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
                                            >
                                                {t('page.viewrecord')} <i className="fas fa-long-arrow-alt-right" />
                                            </button>
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
                        {cnt > 0 && <Pagination rpp={rpp} ppg={ppg} rcnt={cnt} current={pn} selectPage={setPageNumber} />}
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

export default KeywordSearch;
