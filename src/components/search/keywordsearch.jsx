import React, { useState, createRef, useEffect } from "react";

import { MapContainer, TileLayer, ScaleControl, AttributionControl, GeoJSON } from 'react-leaflet';
// reactstrap components
// import {
//   Button,
//   Card,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter
// } from "reactstrap";
import Header from '../../common/header';
import SearchIcon from '@material-ui/icons/Search';
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/core";

function KeywordSearch(props)  {
  const queryParams = {};
  if (props.location.search.trim()!=='') {
    props.location.search.trim().substr(1).split('&').forEach( q=>{
        let item = q.split("=");
        queryParams[item[0]] = decodeURI(item[1]);
    });
  }

  const [loading, setLoading] = useState(false);
  const [allkw, setKWShowing] = useState([]);
  const [results, setResults] = useState([]);
  const [initKeyword, setKeyword] = useState(queryParams && queryParams["keyword"]?queryParams["keyword"].trim():"");
  const [language, setLang] = useState(queryParams && queryParams["lang"]?queryParams["lang"]:"en");
  const [theme, setTheme] = useState(queryParams && queryParams["theme"]?queryParams["theme"]:"");
  const inputRef = createRef();

  const handleSearch = (keyword) => {
    setLoading(true);

    const searchParams = {
        keyword: keyword,
        keyword_only: 'true',
        lang: language,
    }
    if (theme!=='') {
        searchParams.theme = theme;
    }
    //console.log(searchParams);
    axios.get("https://hqdatl0f6d.execute-api.ca-central-1.amazonaws.com/dev/geo", { params: searchParams})
    .then(response => response.data)
    .then((data) => {
        console.log(data);
        const results = data.Items;
        setResults(results);
        //setKeyword(keyword);
        setLoading(false);
    })
    .catch(error=>{
        console.log(error);
        setResults([]);
        //setKeyword(keyword);
        setLoading(false);
    });

  };

  const handleChange = (e) => {
      e.preventDefault();
      setKeyword(e.target.value);
  }

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
    handleSearch(keyword);
  };

  const handleView = (id) => {
    window.open("/#/result?id="+encodeURI(id.trim())+"&lang="+language, "View Record " + id.trim());
  }

  const handleKeyword = (keyword) => {
    window.open("/#/search?keyword="+encodeURI(keyword.trim())+"&lang="+language+"&theme="+theme, "Search " + keyword.trim() );
  }

  const handleKwshowing = (rid) => {
    const newOpen = allkw.map(o=>o);
    const hIndex = allkw.findIndex(os=>os===rid);
    if ( hIndex < 0 ) {
        newOpen.push(rid);
    } else {
        newOpen.splice(hIndex, 1);
    }
    setKWShowing(newOpen);
}

  useEffect(() => {
    if (initKeyword !== '') {
        handleSearch(initKeyword);
    }
  }, [language, theme]);

  return (
        <div className="pageContainer">
        <Header />    
        <div className="searchInput">
            <input
                placeholder="Search ..."
                id="search-input"
                type="search"
                ref={inputRef}
                value={initKeyword}
                disabled = {loading}
                onChange={handleChange}
                onKeyUp={e=>handleKeyUp(e)}
            />
            <button className="icon-button" disabled = {loading} type="button" onClick={!loading ? handleSubmit : null}><SearchIcon /></button>
        </div>
        <div className="resultContainer">
            {loading ?
                <div className="d-flex justify-content-center">
                <BeatLoader
                color={'#0074d9'}
                />
                </div>
                :
                (!Array.isArray(results) || results.length===0 || results[0].id===undefined ?
                <div className="d-flex justify-content-center">
                    {Array.isArray(results) && results.length===0 ? 'Input keyword to search' : 'No result'}
                </div> :
                results.map((result) => {
                const coordinates = JSON.parse(result.coordinates);   
                const keywords = result.keywords.substring(0, result.keywords.length - 2).split(","); 
                const allkwshowing = (allkw.findIndex(ak=>ak===result.id) > -1); 
                return (
                <div key={result.id} className="searchResult container-fluid">
                    <div className="row rowDividerMd">
                        <div className="row resultRow">
                            <div className="col-md-1" />
                            <div className="col-md-10">
                                <p className="searchTitle">{result.title}</p>
                                <div className="searchButtonGroupToolbar">
                                    <div className={allkwshowing?"btn-toolbar searchButtonGroup":"btn-toolbar searchButtonGroup less"} role="toolbar" aria-label="Toolbar with button groups">
                                    {keywords.map((keyword, ki)=>{
                                        return (<div className={ki<5?"btn-group searchButtonGroupBtn":"btn-group searchButtonGroupBtn more"} key={ki}>
                                                    <button type="button" className="btn" onClick = {() => handleKeyword(keyword)}>{keyword}</button>
                                                </div>)
                                    })}
                                    {keywords.length>5 && <div className="btn-group searchButtonGroupBtn searchButtonGroupBtnMore"><button type="button" className="btn" onClick={()=>handleKwshowing(result.id)}>{allkwshowing?"Show Less":"View More"}</button></div>}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-1 " />
                        </div>
                        <div className="row resultRow">
                            <div className="col-md-1" />
                            <div className="col-md-4">
                                <div className="searchImage">
                                <MapContainer
                                    center={[(coordinates[0][2][1]+coordinates[0][0][1])/2, (coordinates[0][1][0]+coordinates[0][0][0])/2]}
                                    zoom={7}
                                >
                                    <TileLayer url="https://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/CBMT_CBCT_GEOM_3857/MapServer/WMTS/tile/1.0.0/BaseMaps_CBMT_CBCT_GEOM_3857/default/default028mm/{z}/{y}/{x}.jpg" attribution="© Her Majesty the Queen in Right of Canada, as represented by the Minister of Natural Resources" />
                                    <GeoJSON key={result.id} data={{
                                            "type": "Feature",
                                            "properties": {"id": result.id, "tag": "geoViewGeoJSON"},
                                            "geometry": {"type": "Polygon", "coordinates": coordinates}
                                            }} />          
                                </MapContainer>
                                </div>
                            </div>    
                            <div className="col-md-6">
                                <p className="searchFields"><strong>Organisation:</strong> {result.organisation}</p>
                                <p className="searchFields"><strong>Published:</strong> {result.published}</p>
                                {/* <p className="searchFields"><strong>Keywords:</strong> {result.keywords.substring(0, result.keywords.length - 2)}</p> */}
                                <p className="searchDesc">{result.description.substr(0,240)} {result.description.length>240 ? <span>...</span> : ""}</p>
                                <button type="button" className="btn btn-block searchButton" onClick={() => handleView(result.id)}>View Record <i className="fas fa-long-arrow-alt-right"></i></button>
                            </div>
                            <div className="col-md-1 " />
                        </div>
                    </div>
                </div>
                )}))}
        </div>
        </div>
    );
}

export default KeywordSearch;
