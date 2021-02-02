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

  const handleSubmit = (event) => {
    if (event) {
        event.preventDefault();
    }

    const keyword = inputRef.current.value;
    handleSearch(keyword);
  };

  const handleView = (id) => {
    window.open("/result?id="+encodeURI(id.trim())+"&lang="+language, "View Record " + id.trim());
  }

  const handleKeyword = (keyword) => {
    window.open("/search?keyword="+encodeURI(keyword.trim())+"&lang="+language+"&theme="+theme, "Search " + keyword.trim() );
  }

  useEffect(() => {
    if (initKeyword !== '') {
        handleSearch(initKeyword);
    }
  }, [language, theme]);

  return (
        <div className="pageContainer">
        <div className="searchInput">
            <input
                placeholder="Search ..."
                id="search-input"
                type="search"
                ref={inputRef}
                value={initKeyword}
                disabled = {loading}
                onChange={handleChange}
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
                return (
                <div key={result.id} class="searchResult container-fluid">
                    <div class="row rowDividerMd">
                        <div className="row resultRow">
                            <div class="col-md-1" />
                            <div class="col-md-10">
                                <p class="searchTitle">{result.title}</p>
                                <div class="searchButtonGroupToolbar">
                                    <div class="btn-toolbar searchButtonGroup" role="toolbar" aria-label="Toolbar with button groups">
                                    {result.keywords.substring(0, result.keywords.length - 2).split(",").map((keyword, ki)=>{
                                        return (<div class="btn-group searchButtonGroupBtn" role="group" key={ki} aria-label={ki + "group small"}>
                                                    <button type="button" class="btn" onClick = {() => handleKeyword(keyword)}>{keyword}</button>
                                                </div>)
                                    })}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-1 " />
                        </div>
                        <div className="row resultRow">
                            <div class="col-md-1" />
                            <div class="col-md-4">
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
                            <div class="col-md-6">
                                <p className="searchFields"><strong>Organisation:</strong> {result.organisation}</p>
                                <p className="searchFields"><strong>Published:</strong> {result.published}</p>
                                {/* <p className="searchFields"><strong>Keywords:</strong> {result.keywords.substring(0, result.keywords.length - 2)}</p> */}
                                <p class="searchDesc">{result.description.substr(0,240)} {result.description.length>240 ? <span>...</span> : ""}</p>
                                <button type="button" class="btn btn-block searchButton" onClick={() => handleView(result.id)}>View Record <i class="fas fa-long-arrow-alt-right"></i></button>
                            </div>
                            <div class="col-md-1 " />
                        </div>
                    </div>
                </div>
                )}))}
        </div>
        </div>
    );
}

export default KeywordSearch;
