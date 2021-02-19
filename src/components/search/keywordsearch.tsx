/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, createRef, useEffect, ChangeEvent } from 'react';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import SearchIcon from '@material-ui/icons/Search';
import FilterIcon from '@material-ui/icons/Filter';
import ClearIcon from '@material-ui/icons/Clear';
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
    const queryParams: { [key: string]: string }  = getQueryParams(location.search);
    const { t } = useTranslation();
    const rpp = 10;
    const [loading, setLoading] = useState(false);
    const [allkw, setKWShowing] = useState<string[]>([]);
    const [pn, setPageNumber] = useState(1);
    const [cnt, setCount] = useState(0);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [initKeyword, setKeyword] = useState(queryParams && queryParams.keyword ? queryParams.keyword.trim() : '');
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
    const language = t('app.language');

    const inputRef = createRef();

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
            searchParams.theme = storethemefilters.map((fs: string) => fs).join(',');
        }
        if (storeorgfilters.length > 0) {
            searchParams.org = storeorgfilters.map((fs: string) => fs).join('|');
        }
        if (storetypefilters.length > 0) {
            searchParams.type = storetypefilters.map((fs: string) => fs).join('|');
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
            .catch((error) => {
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

    const handleKeyUp = (e:React.KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode === 13) {
            handleSubmit();
        }
    };

    const handleView = (id: string) => {
        window.open(`/#/result?id=${encodeURI(id.trim())}`, `View Record ${id.trim()}`);
    };

    const handleKeyword = (keyword: string) => {
        window.open(`/#/search?keyword=${encodeURI(keyword.trim())}`, `Search ${keyword.trim()}`);
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

    const handleOrg = (filters: string[]) => {
        setFReset(true);
        setOrg(filters);
    };

    const handleType = (filters: string[]) => {
        setFReset(true);
        setType(filters);
    };

    const handleTheme = (filters: string[]) => {
        setFReset(true);
        setTheme(filters);
    };

    const handleFound = (found: boolean) => {
        setFReset(true);
        setFound(found);
    };

    const clearOrgFilter = (filter:string) =>{
        const  newfilter = orgfilters.filter(fs=>fs!==filter);
        dispatch(setOrgFilter(newfilter)); 
        setOrg(newfilter);
        setFReset(false);
        setPageNumber(1);     
    };

    const clearTypeFilter = (filter:string) =>{
        const  newfilter = typefilters.filter(fs=>fs!==filter);
        dispatch(setTypeFilter(newfilter)); 
        setType(newfilter);
        setFReset(false);
        setPageNumber(1);     
    };

    const clearThemeFilter = (filter:string) =>{
        const  newfilter = themefilters.filter(fs=>fs!==filter);
        dispatch(setThemeFilter(newfilter)); 
        setTheme(newfilter);
        setFReset(false);
        setPageNumber(1);     
    };

    const clearFound = () =>{
        dispatch(setFoundational(false)); 
        setFound(false);
        setFReset(false);
        setPageNumber(1);     
    };

    useEffect(() => {
        if (!fReset) {
            /* const filteractive = (themefilters.length>0 || orgfilters.length > 0 || typefilters.length > 0); 
            if ((initKeyword !== '') || (initKeyword === '' && !filteractive)) {
                handleSearch(initKeyword);
            }
            if (initKeyword === '' && filteractive) {
                setResults([]);
                setCount(0);
                setPageNumber(1);
            } */
            handleSearch(initKeyword);
        }
    }, [language, pn, fReset, orgfilters, typefilters, themefilters, foundational]);

    return (
        <div className="pageContainer keyword-search-page">
            {/* Filters / Search Bar */}
            <div className="container-fluid container-filters-search">
                <div className="row row-filters-search">
                    <div className="col-md-2">
                        <div className="searchFilters">
                            <h2>
                                <FilterIcon /> Filter by:
                            </h2>
                            <SearchFilter
                                filtertitle="Organisations"
                                filtervalues={organisations}
                                filterselected={orgfilters}
                                selectFilters={handleOrg}
                            />
                            <SearchFilter
                                filtertitle="Types"
                                filtervalues={types}
                                filterselected={typefilters}
                                selectFilters={handleType}
                            />
                            <SearchFilter
                                filtertitle="Themes"
                                filtervalues={themes}
                                filterselected={themefilters}
                                selectFilters={handleTheme}
                            />
                            <SearchFilter
                                filtertitle="Foundational Layers Only"
                                filtervalues={[]}
                                filterselected={foundational ? ['true'] : []}
                                selectFilters={handleFound}
                            />
                            <div className="filterAction">
                                <button type="button"
                                    className={fReset ? 'btn searchButton submit' : 'btn searchButton submit disabled'}
                                    onClick={fReset ? applyFilters : undefined}
                                >
                                    Apply Filters
                                </button>
                                <button type="button" className="btn searchButton clear" onClick={clearAll}>
                                    Clear All
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-10">
                        <div className="searchInput">
                            <input
                                placeholder="Search ..."
                                id="search-input"
                                type="search"
                                ref={inputRef}
                                value={initKeyword}
                                disabled={loading}
                                onChange={handleChange}
                                onKeyUp={(e:React.KeyboardEvent<HTMLInputElement>) => handleKeyUp(e)}
                            />
                            <button className="icon-button" disabled={loading} type="button" onClick={!loading ? handleSubmit : undefined}>
                                <SearchIcon />
                            </button>
                        </div>
                        <div className="searchListFilters row">
                            {typefilters.map((typefilter) => (
                                <button type="button" className="btn btn-medium btn-button" disabled = {loading} onClick={!loading ? () => clearTypeFilter(typefilter): null}>                                      
                                    <span className = "glyphicon glyphicon-remove">{typefilter} <ClearIcon size='small'/></span>                   
                                </button>
                            ))
                            }
                            {orgfilters.map((orgfilter) => (
                                <button type="button" className="btn btn-medium btn-button" disabled = {loading} onClick={!loading ? () => clearOrgFilter(orgfilter): null}>                     
                                    <span className = "glyphicon glyphicon-remove">{orgfilter}  <ClearIcon size='small'/></span>                
                                </button>
                            ))
                            }
                            {themefilters.map((themefilter) => (
                                <button type="button" className="btn btn-medium btn-button" disabled = {loading} onClick={!loading ? () => clearThemeFilter(themefilter): null}>                    
                                    <span className = "glyphicon glyphicon-remove">{themefilter} <ClearIcon size='small'/></span>                                        
                                </button>
                            ))
                            }
                            {foundational && 
                                <button type="button" className="btn btn-medium btn-button" disabled = {loading} onClick={!loading ? clearFound: null}>                    
                                    <span className = "glyphicon glyphicon-remove">Foundational Layers Only <ClearIcon size='small'/></span>                                        
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
            {/* Pagination - Top */}
            <div className="container-fluid container-pagination container-pagination-top">
                <div className="row row-pagination row-pagination-top">
                    <div className="col-12">
                        {' '}
                        {cnt > 0 && <Pagination rpp={rpp} ppg={10} rcnt={cnt} current={pn} selectPage={setPageNumber} />}
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
                        <div className="col-12 col-search-message">
                            {Array.isArray(results) && results.length === 0 ? 'Input keyword to search' : 'No result'}
                        </div>
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
                                                        attribution="© Her Majesty the Queen in Right of Canada, as represented by the Minister of Natural Resources"
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
                                                            {allkwshowing ? 'Show Less' : 'View More'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="search-meta">
                                                <ul className="list list-unstyled">
                                                    <li className="list-item">
                                                        <strong>Organisation:</strong> {result.organisation}
                                                    </li>
                                                    <li className="list-item">
                                                        <strong>Published:</strong> {result.published}
                                                    </li>
                                                </ul>
                                            </div>
                                            <p className="search-desc">
                                                {result.description.substr(0, 240)}{' '}
                                                {result.description.length > 240 ? <span>...</span> : ''}
                                            </p>
                                            <button type="button" className="btn btn-search" onClick={() => handleView(result.id)}>
                                                View Record <i className="fas fa-long-arrow-alt-right" />
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
                        {cnt > 0 && <Pagination rpp={rpp} ppg={10} rcnt={cnt} current={pn} selectPage={setPageNumber} />}
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
