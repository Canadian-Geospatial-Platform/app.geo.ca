/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-filename-extension */
import React, { useState, createRef, useEffect } from "react";
import {useLocation} from 'react-router';
import { useDispatch, useSelector} from "react-redux";
import { useMap } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
// reactstrap components
/* import {
  Button,
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap"; */
// import SearchFilter from '../searchfilter/searchfilter';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
import { getQueryParams } from '../../common/queryparams'; 
import Pagination from '../pagination/pagination';
import { setOrgFilter, setTypeFilter, setThemeFilter, setFoundational } from '../../reducers/action';
// import organisations from "./organisations.json";
// import types from "./types.json";
// import { css } from "@emotion/core";
import './geosearch.scss';

const GeoSearch = ({showing}) => {
  const location = useLocation();
  const queryParams = getQueryParams(location.search);
  const {t} = useTranslation();
  const rpp = 10;
  const inputRef = createRef();
  let mapCount = 0;
  const map = useMap();
  const [initBounds, setBounds] = useState(map.getBounds());
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
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
  
  const selectResult = (result) => {
    map.eachLayer((layer) => {
        // console.log(layer);
        const {feature} = layer;
        if ( !!feature && feature.type && feature.type==="Feature" && feature.properties && feature.properties.tag && feature.properties.tag === "geoViewGeoJSON") {
          map.removeLayer(layer);
        }
    });

    if (result!==null) {
        const data = {
                "type": "Feature",
                "properties": {"id": result.id, "tag": "geoViewGeoJSON"},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": JSON.parse(result.coordinates)
                } };
        new L.geoJSON(data).addTo(map);
    }
  };
  
  const handleSelect = (event) => {
    // const {selectResult} = this.props;
    const cardOpen = selected === event ? !open : true;
    const result = Array.isArray(results) && results.length>0 && cardOpen ? results.find(r=>r.id===event): null;

    setSelected(event);
    setOpen(cardOpen);
    selectResult(result);
  };
  
  const setLoadingStatus = (flag) => {
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

  const handleView = (evt, id) => {
    evt.stopPropagation();
    window.open(`/result?id=${encodeURI(id.trim())}`, `View Record ${id.trim()}`);
  }

  const handleChange = (e) => {
    e.preventDefault();
    setKeyword(e.target.value);
  }

  const handleSearch = (keyword, bounds) => {
    !loading && setLoadingStatus(true);

    const searchParams = {
        north: bounds._northEast.lat,
        east: bounds._northEast.lng,
        south: bounds._southWest.lat,
        west: bounds._southWest.lng,
        keyword,
        lang: language,
        min: (pn-1)*rpp + 1,
        max: cnt>0?Math.min(pn*rpp, cnt-1):pn*rpp
    }
    if (themefilters.length > 0) {
        searchParams.theme = themefilters.map(fs=>fs).join(",");
    }
    if (orgfilters.length > 0) {
        searchParams.org = orgfilters.map(fs=>fs).join("|");
    }
    if (typefilters.length > 0) {
        searchParams.type = typefilters.map(fs=>fs).join("|");
    }
    if (foundational) {
        searchParams.foundational = "true";
    }
    // console.log(searchParams);
    axios.get("https://hqdatl0f6d.execute-api.ca-central-1.amazonaws.com/dev/geo", { params: searchParams})
    .then(response => response.data)
    .then((data) => {
        // console.log(data);
        const results = data.Items;
        const rcnt = results.length>0?results[0].total:0;
        setResults(results);
        setCount(rcnt);
        setBounds(bounds);
        setKeyword(keyword);
        setLoadingStatus(false);
        if (selected!=='search' && open && results.find(r=>r.id===selected)) {
            setSelected('search');
            setOpen(false);
            selectResult(null);
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
        selectResult(null);
        setLoadingStatus(false);
        map.on('moveend', event=>eventHandler(event, keyword, initBounds));
        mapCount=0;
    });

  };

  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e);
    }
  };

  const handleSubmit = (event) => {
    if (event) {
        event.preventDefault();
    }
    const keyword = inputRef.current.value;
    setPageNumber(1);
    handleSearch(keyword, initBounds);
  };

  const eventHandler = (event, keyword, bounds) => {
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

  const clearOrgFilter = (filter) =>{
    const  newfilter = orgfilters.filter(fs=>fs!==filter);
    dispatch(setOrgFilter(newfilter)); 
    setPageNumber(1);     
  };

  const clearTypeFilter = (filter) =>{
    const  newfilter = typefilters.filter(fs=>fs!==filter);
    dispatch(setTypeFilter(newfilter)); 
    setPageNumber(1);     
  };

  const clearThemeFilter = (filter) =>{
    const  newfilter = themefilters.filter(fs=>fs!==filter);
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
                    placeholder="Search ..."
                    id="search-input"
                    type="search"
                    ref={inputRef}
                    disabled = {loading}
                    value={initKeyword}
                    onChange={handleChange}
                    onKeyUp={e=>handleKeyUp(e)}
                />
                <button className="icon-button" disabled = {loading} type="button" onClick={!loading ? handleSubmit : null}><SearchIcon /></button>
            </div>
            <div className="searchFilters">
                <div className="row rowDivider">
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
            <div className="container">
                {cnt>0 && <Pagination rpp={rpp} ppg={10} rcnt={cnt} current={pn} selectPage={setPageNumber} />}
                {loading ?
                    <div className="d-flex justify-content-center">
                    <BeatLoader color="#515AA9" />
                    </div>
                    :
                    (!Array.isArray(results) || results.length===0 || results[0].id===undefined ?
                    (Array.isArray(results) && results.length===0 ? 'Input keyword to search' : 'No result') :
                    <div className="row rowDivider">
                    {results.map((result) => (
                        <div key={result.id} className={(selected === result.id && open === true) ? "col-sm-12 searchResult selected":"col-sm-12 searchResult"} onClick={() => handleSelect(result.id)}>
                            <p className="searchTitle">{result.title}</p>
                            <div>
                                <p className="searchFields"><strong>Organisation:</strong> {result.organisation}</p>
                                <p className="searchFields"><strong>Published:</strong> {result.published}</p>
                                <p className="searchDesc">{result.description.substr(0,240)} {result.description.length>240 ? <span>...</span> : ""}</p>
                                
                                <button type="button" className="btn btn-sm searchButton" onClick={(e) => handleView(e, result.id)}>View Record <i className="fas fa-long-arrow-alt-right" /></button>
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

export default GeoSearch;
