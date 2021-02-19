import React, { useState, createRef, useEffect } from "react";
import {useLocation, useHistory} from 'react-router';
import { useMap } from 'react-leaflet';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
// reactstrap components
/*import {
  Button,
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";*/
//import SearchFilter from '../searchfilter/searchfilter';
import { useStateContext } from "../../globalstate/state";
import Pagination from '../pagination/pagination';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';


import { setOrgFilter, setTypeFilter, setThemeFilter, setFoundational } from "../../globalstate/action";


import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
//import organisations from "./organisations.json";
//import types from "./types.json";
//import { css } from "@emotion/core";
import './geosearch.scss';
//import { ConfigurationServicePlaceholders } from "aws-sdk/lib/config_service_placeholders";

const GeoSearch = ({showing}) => {    

    const { state, dispatch } = useStateContext(); 
    const [orgfilters, setOrg] = useState(state.orgfilter);
    const [typefilters, setType] = useState(state.typefilter);
    const [themefilters, setTheme] = useState(state.themefilter);
    const [foundational, setFound] = useState(state.foundational);

  const queryParams = {};
  const location = useLocation();
  const {t} = useTranslation();
  //const history = useHistory();
  //console.log(location, history);
  if (location.search && location.search!=='') {
      location.search.substr(1).split('&').forEach( (q)=>{
          const item = q.split("=");
          queryParams[item[0]] = decodeURI(item[1]);
      });
  }
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
  //const [typefilters, setType] = useState(state.typefilter);

  const [open, setOpen] = useState(false);
  //const [modal, setModal] = useState(false);
  const [initKeyword, setKeyword] = useState(queryParams && queryParams["keyword"]?queryParams["keyword"].trim():"");
  //const {state, dispatch} = useStateContext();
  //const [typefilters, setType] = useState(state.typefilter);
  const orgfilters_local = state.orgfilter;
  const typefilters_local = state.typefilter;
  const themefilters_local = state.themefilter;
  const foundational_local = state.foundational;
  const language = t("app.language");
  //console.log(showing);

  const handleSelect = (event) => {
    //const {selectResult} = this.props;
    const cardOpen = selected === event ? !open : true;
    const result = Array.isArray(results) && results.length>0 && cardOpen ? results.find(r=>r.id===event): null;

    setSelected(event);
    setOpen(cardOpen);
    selectResult(result);
  };

  const selectResult = (result) => {
    map.eachLayer((layer) => {
        //console.log(layer);
        const feature = layer.feature;
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
    window.open("/#/result?id="+encodeURI(id.trim()), "View Record " + id.trim());
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
        keyword: keyword,
        lang: language,
        min: (pn-1)*rpp + 1,
        max: cnt>0?Math.min(pn*rpp, cnt-1):pn*rpp
    }
    if (themefilters_local.length > 0) {
        searchParams.theme = themefilters_local.map(fs=>fs).join(",");
    }
    if (orgfilters_local.length > 0) {
        searchParams.org = orgfilters_local.map(fs=>"^"+fs+"$").join("|");
    }
    if (typefilters_local.length > 0) {
        searchParams.type = typefilters_local.map(fs=>"^"+fs+"$").join("|");
    }
    if (foundational_local) {
        searchParams.foundational = "true";
    }
    console.log(searchParams);
    axios.get("https://hqdatl0f6d.execute-api.ca-central-1.amazonaws.com/dev/geo", { params: searchParams})
    .then(response => response.data)
    .then((data) => {
        //console.log(data);
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

  const handleClearTypeFilterFromDisplay = (event) =>{
    let abc ='';
    if (event) {
        event.preventDefault();
        console.log('Check what is in event');
        console.log(event);
        console.log('Check what is in target');
        console.log(event.target);
        console.log('Check what is in innerText');
        console.log(event.target.innerText);
        abc= event.target.innerText;

    }
    //const keyword = inputRef.current.value;
    //setPageNumber(1);

    //let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    let filtered = typefilters_local.filter(function(value, index, arr){ 
        return value !==  abc.trim(); // 'API';
    });

    console.log('Test Handleresearch:');
    // dispatch(setTypeFilter([]));
    dispatch(setTypeFilter(filtered));
    //setType(filtered);
       
  };

  const handleClearOrgFilterFromDisplay = (event) =>{
    let localInnerTextHolder ='';
    if (event) {
        event.preventDefault();
        console.log('Check what is in event');
        console.log(event);
        console.log('Check what is in target');
        console.log(event.target);
        console.log('Check what is in innerText');
        console.log(event.target.innerText);
        localInnerTextHolder= event.target.innerText;
    }
    //const keyword = inputRef.current.value;
    //setPageNumber(1);
    
    let filtered = orgfilters_local.filter(function(value, index, arr){ 
        return value !==  localInnerTextHolder.trim(); 
    });

    console.log('Test handleClearOrgFilterFromDisplay:');
    dispatch(setOrgFilter(filtered));
    //setType(filtered);       
  };

  const handleClearThemeFilterFromDisplay = (event) =>{
    let localInnerTextHolder ='';
    if (event) {
        event.preventDefault();
        console.log('Check what is in event');
        console.log(event);
        console.log('Check what is in target');
        console.log(event.target);
        console.log('Check what is in innerText');
        console.log(event.target.innerText);
        localInnerTextHolder= event.target.innerText;
    }
    //const keyword = inputRef.current.value;
    //setPageNumber(1);
    
    let filtered = themefilters_local.filter(function(value, index, arr){ 
        return value !==  localInnerTextHolder.trim(); 
    });

    console.log('Test handleClearOrgFilterFromDisplay:');
    dispatch(setThemeFilter(filtered));
    //setType(filtered);       
  };

  const eventHandler = (event, keyword, bounds) => {
    const mbounds = event.target.getBounds();
    //console.log(mbounds,bounds);
    map.off('moveend', eventHandler);
    //console.log('status:', loading, 'keyword', keyword,initKeyword);
    if (!loading && mapCount === 0 && !Object.is(mbounds, bounds)) {
        //console.log('research:', loading, keyword, mapCount);
        mapCount++;
        setLoadingStatus(true);
        //setBounds(mbounds);
        setPageNumber(1);
        handleSearch(keyword, mbounds);
    }
  }

  useEffect(() => {
    const filteractive = (themefilters_local.length>0 || orgfilters_local.length > 0 || typefilters_local.length > 0);  
    if (showing) {
        if ((initKeyword !== '') || (initKeyword === '' && !filteractive)) {
            handleSearch(initKeyword, initBounds);
        } 
        if (initKeyword === '' && filteractive ) {
            setResults([]);
            setCount(0);
            setPageNumber(1);
        }
    } 
  }, [showing, language, pn, themefilters_local, orgfilters_local, typefilters_local, foundational]);
  //map.on('moveend', event=>eventHandler(event,initKeyword, initBounds));

  //console.log(loading, results);
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
            {/* <h2>Filters:</h2> */}
            
            {/* <button type="button" className="btn btn-sm searchButton" ></button> */}

            <div className="row rowDivider">
            {typefilters_local.map((typefilter) => (
                <button type="button" className="btn btn-medium btn-button" disabled = {loading} onClick={!loading ? handleClearTypeFilterFromDisplay: null}>  
                    {/* <h6>                   
                        {typefilter}
                    </h6>                         */}
                    
                    <span class = "glyphicon glyphicon-remove">  {typefilter} <ClearIcon size='small'/>  </span>
                    {/* <span class = "glyphicon glyphicon-remove">   {typefilter} X  </span> */}
                    {/* <span> <ClearIcon size='small'/>  </span> */}
                    {/* <ClearIcon size='small'/>  */}
                </button>
            ))
            }
            {orgfilters_local.map((orgfilter) => (
                <button type="button" className="btn btn-medium btn-button" disabled = {loading} onClick={!loading ? handleClearOrgFilterFromDisplay: null}>  
                    
                                           
                    {/* <span class = "glyphicon glyphicon-remove"> <ClearIcon size='small'/>  </span>                     */}
                    <span class = "glyphicon glyphicon-remove"> {orgfilter}  <ClearIcon size='small'/>   </span>                    
                   
                </button>
            ))
            }
            {themefilters_local.map((themefilter) => (
                <button type="button" className="btn btn-medium btn-button" disabled = {loading} onClick={!loading ? handleClearThemeFilterFromDisplay: null}>  
                  
                    {/* <span class = "glyphicon glyphicon-remove"> <ClearIcon size='small'/>  </span>                     */}
                    <span class = "glyphicon glyphicon-remove">   {themefilter}   <ClearIcon size='small'/>   </span>                                        
                </button>
            ))
            }



            </div>
            

        </div>
        <div className="container">
            {cnt>0 && <Pagination rpp={rpp} ppg={10} rcnt={cnt} current={pn} selectPage={setPageNumber} />}
            {loading ?
                <div className="d-flex justify-content-center">
                <BeatLoader
                color={'#515AA9'}
                />
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
                            
                            <button type="button" className="btn btn-sm searchButton" onClick={(e) => handleView(e, result.id)}>View Record <i className="fas fa-long-arrow-alt-right"></i></button>
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
