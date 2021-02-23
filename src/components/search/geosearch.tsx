/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-filename-extension */
import React, { useState, createRef, useEffect, ChangeEvent } from "react";
import {useLocation} from 'react-router';
import { useDispatch, useSelector} from "react-redux";
import { useMap } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
import { getQueryParams } from '../../common/queryparams'; 
import Pagination from '../pagination/pagination';
import { setOrgFilter, setTypeFilter, setThemeFilter, setFoundational } from '../../reducers/action';
import organisations from './organisations.json';
import types from './types.json';
import themes from './themes.json';
import './geosearch.scss';

const GeoSearch = (showing:boolean):JSX.Element => {
  const location = useLocation();
  const queryParams = getQueryParams(location.search);
  const {t} = useTranslation();
  const rpp = 10;
  const inputRef:React.RefObject<HTMLInputElement> = createRef();
  let mapCount = 0;
  const map = useMap();
  const [initBounds, setBounds] = useState(map.getBounds());
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [pn, setPageNumber] = useState(1);
  const [cnt, setCount] = useState(0);
  const [selected, setSelected] = useState("search");
  const [open, setOpen] = useState(false);
  // const [modal, setModal] = useState(false);
  const [initKeyword, setKeyword] = useState(queryParams && queryParams.keyword?queryParams.keyword.trim():"");
  const language = t("app.language");
  const orgfilters = useSelector(state => state.mappingReducer.orgfilter);
  const typefilters = useSelector(state => state.mappingReducer.typefilter);
  const themefilters = useSelector(state => state.mappingReducer.themefilter);
  const foundational = useSelector(state => state.mappingReducer.foundational);
  const dispatch = useDispatch();

  const selectResult = (result:SearchResult|undefined) => {
    map.eachLayer((layer:unknown) => {
        // console.log(layer);
        const { feature } = layer;
        if ( !!feature && feature.type && feature.type==="Feature" && feature.properties && feature.properties.tag && feature.properties.tag === "geoViewGeoJSON") {
          map.removeLayer(layer);
        }
    });

    if (result) {
        const data = {
                "type": "Feature",
                "properties": {"id": result.id, "tag": "geoViewGeoJSON"},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": JSON.parse(result.coordinates)
                } };

        // eslint-disable-next-line new-cap
        new L.geoJSON(data).addTo(map);
    }
  };
  
  const handleSelect = (event:string) => {
    // const {selectResult} = this.props;
    const cardOpen = selected === event ? !open : true;
    const result = Array.isArray(results) && results.length>0 && cardOpen ? results.find((r:SearchResult)=>r.id===event): undefined;

    setSelected(event);
    setOpen(cardOpen);
    selectResult(result);
  };
  
  const setLoadingStatus = (flag:boolean) => {
    flag &&
    map._handlers.forEach(handler => {
        handler.disable();
    });
    setLoading(flag);

    !flag &&
    map._handlers.forEach(handler => {
        handler.enable();
    });
  }

  const handleView = (evt:React.MouseEvent<HTMLButtonElement>, id:string) => {
    evt.stopPropagation();
    window.open(`/#/result?id=${encodeURI(id.trim())}&lang=${language}`, `View Record ${id.trim()}`);
  }

  const handleChange = (e: ChangeEvent) => {
        e.preventDefault();
        setKeyword((e.target as HTMLInputElement).value);
  };

  const eventHandler = (event:unknown, keyword:string, bounds:unknown) => {
    const mbounds = event.target.getBounds();
    // console.log(mbounds,bounds);
    map.off('moveend', eventHandler);
    // console.log('status:', loading, 'keyword', keyword,initKeyword);
    if (!loading && mapCount === 0 && !Object.is(mbounds, bounds)) {
        // console.log('research:', loading, keyword, mapCount);
        mapCount++;
        setLoadingStatus(true);
        // setBounds(mbounds);
        setPageNumber(1);
        handleSearch(keyword, mbounds);
    }
  }

  const handleSearch = (keyword:string, bounds:unknown) => {
    !loading && setLoadingStatus(true);

    const searchParams:SearchParams = {
        north: bounds._northEast.lat,
        east: bounds._northEast.lng,
        south: bounds._southWest.lat,
        west: bounds._southWest.lng,
        keyword,
        lang: language,
        min: (pn-1)*rpp + 1,
        max: cnt>0?Math.min(pn*rpp, cnt):pn*rpp
    }
    if (themefilters.length > 0) {
        searchParams.theme = themefilters.map((fs:number)=>themes[language][fs]).join(",");
    }
    if (orgfilters.length > 0) {
        searchParams.org = orgfilters.map((fs:number)=>organisations[language][fs]).join("|");
    }
    if (typefilters.length > 0) {
        searchParams.type = typefilters.map((fs:number)=>types[language][fs]).join("|");
    }
    if (foundational) {
        searchParams.foundational = "true";
    }
    // console.log(searchParams);
    axios.get("https://hqdatl0f6d.execute-api.ca-central-1.amazonaws.com/dev/geo", { params: searchParams})
    .then(response => response.data)
    .then((data) => {
        // console.log(data);
        const res = data.Items;
        const rcnt = res.length>0?res[0].total:0;
        setResults(res);
        setCount(rcnt);
        setBounds(bounds);
        setKeyword(keyword);
        setLoadingStatus(false);
        if (selected!=='search' && open && res.find((r:SearchResult)=>r.id===selected)) {
            setSelected('search');
            setOpen(false);
            selectResult(undefined);
        }
        map.on('moveend', event=>eventHandler(event, keyword, initBounds));
        mapCount=0;
    })
    .catch(error=>{
        console.log(error);
        setResults([]);
        setCount(0);
        setBounds(bounds);
        setKeyword(keyword);
        setSelected('search');
        setOpen(false);
        selectResult(undefined);
        setLoadingStatus(false);
        map.on('moveend', event=>eventHandler(event, keyword, initBounds));
        mapCount=0;
    });

  };

  const handleSubmit = (event?: React.MouseEvent | undefined) => {
    if (event) {
        event.preventDefault();
    }

    const keyword = (inputRef.current as HTMLInputElement).value;
    setPageNumber(1);
    handleSearch(keyword, initBounds);
  };

  const handleKeyUp = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
        handleSubmit();
    }
  };
  
  const clearOrgFilter = (filter:number) =>{
    const  newfilter = orgfilters.filter((fs:number)=>fs!==filter);
    dispatch(setOrgFilter(newfilter)); 
    setPageNumber(1);     
  };

  const clearTypeFilter = (filter:number) =>{
    const  newfilter = typefilters.filter((fs:number)=>fs!==filter);
    dispatch(setTypeFilter(newfilter)); 
    setPageNumber(1);     
  };

  const clearThemeFilter = (filter:number) =>{
    const  newfilter = themefilters.filter((fs:number)=>fs!==filter);
    dispatch(setThemeFilter(newfilter)); 
    setPageNumber(1);     
  };

  const clearFound = () =>{
    dispatch(setFoundational(false)); 
    setPageNumber(1);     
  };
  
  useEffect(() => {
    if (showing) {
        handleSearch(initKeyword, initBounds);
    } 
  }, [showing, language, pn, orgfilters, typefilters, themefilters, foundational]);
  // map.on('moveend', event=>eventHandler(event,initKeyword, initBounds));

  // console.log(loading, results);
  return (
        <div className="geoSearchContainer">
            <div className="searchInput">
                <input
                    placeholder={t("page.search")}
                    id="search-input"
                    type="search"
                    ref={inputRef}
                    disabled = {loading}
                    value={initKeyword}
                    onChange={handleChange}
                    onKeyUp={e=>handleKeyUp(e)}
                />
                <button type="button" className="icon-button" disabled = {loading} onClick={!loading ? handleSubmit : undefined}> <SearchIcon /> </button>
            </div>
            <div className="searchFilters">
                <div className="row rowDivider">
                {typefilters.map((typefilter:number) => (
                    <button type="button" className="btn btn-medium btn-button" disabled = {loading} onClick={!loading ? () => clearTypeFilter(typefilter): undefined}>                                      
                        <span className = "glyphicon glyphicon-remove">{types[language][typefilter]} <ClearIcon /></span>                   
                    </button>
                ))
                }
                {orgfilters.map((orgfilter:number) => (
                    <button type="button" className="btn btn-medium btn-button" disabled = {loading} onClick={!loading ? () => clearOrgFilter(orgfilter): undefined}>                     
                        <span className = "glyphicon glyphicon-remove">{organisations[language][orgfilter]}  <ClearIcon /></span>                
                    </button>
                ))
                }
                {themefilters.map((themefilter:number) => (
                    <button type="button" className="btn btn-medium btn-button" disabled = {loading} onClick={!loading ? () => clearThemeFilter(themefilter): undefined}>                    
                        <span className = "glyphicon glyphicon-remove">{themes[language][themefilter]} <ClearIcon /></span>                                        
                    </button>
                ))
                }
                {foundational && 
                    <button type="button" className="btn btn-medium btn-button" disabled = {loading} onClick={!loading ? clearFound: undefined}>                    
                        <span className = "glyphicon glyphicon-remove">{t("filter.foundational")} <ClearIcon /></span>                                        
                    </button>
                }
                </div>
            </div>
            <div className="container">
                {cnt>0 && <Pagination rpp={rpp} ppg={10} rcnt={cnt} current={pn} selectPage={setPageNumber} />}
                {loading ?
                    <div className="d-flex justify-content-center">
                    <BeatLoader color="#515AA9" />
                    </div>
                    :
                    (!Array.isArray(results) || results.length===0 || results[0].id===undefined ?
                    t("page.changesearch") :
                    <div className="row rowDivider">
                    {results.map((result: SearchResult) => (
                        <div key={result.id} className={(selected === result.id && open === true) ? "col-sm-12 searchResult selected":"col-sm-12 searchResult"} onClick={() => handleSelect(result.id)}>
                            <p className="searchTitle">{result.title}</p>
                            <div>
                                <p className="searchFields"><strong>{t("page.organisation")}:</strong> {result.organisation}</p>
                                <p className="searchFields"><strong>{t("page.published")}:</strong> {result.published}</p>
                                <p className="searchDesc">{result.description.substr(0,240)} {result.description.length>240 ? <span>...</span> : ""}</p>
                                
                                <button type="button" className="btn btn-sm searchButton" onClick={(e) => handleView(e, result.id)}>{t("page.viewrecord")} <i className="fas fa-long-arrow-alt-right" /></button>
                            </div>
                        </div>
                    ))}
                    </div>
                )}
                {cnt>0 && <Pagination rpp={rpp} ppg={10} rcnt={cnt} current={pn} selectPage={setPageNumber} />}
            </div>
        </div>
    );
}

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
