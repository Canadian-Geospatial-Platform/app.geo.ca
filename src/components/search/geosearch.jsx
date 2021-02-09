import React, { useState, createRef, useEffect } from "react";
import PropTypes from 'prop-types';
// reactstrap components
import {
  Button,
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
//import { useMap } from 'react-leaflet';
import SearchFilter from '../searchfilter/searchfilter';
import Pagination from '../pagination/pagination';
import SearchIcon from '@material-ui/icons/Search';
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
import organisations from "./organisations.json";
import types from "./types.json";
import { css } from "@emotion/core";
import './geosearch.scss';

const GeoSearch = ({geoMap}) => {
  const queryParams = {};
  const querySearch = window.location.href.split('?')[1];
  if (querySearch && querySearch.trim()!=='') {
    querySearch.trim().split('&').forEach( q=>{
        let item = q.split("=");
        queryParams[item[0]] = decodeURI(item[1]);
    });
  }
  const inputRef = createRef();
  let mapCount = 0;
  const [map, setMap] = useState(geoMap);
  const [initBounds, setBounds] = useState(geoMap.getBounds());
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [pn, setPageNumber] = useState(1);
  const [cnt, setCount] = useState(0);
  const [selected, setSelected] = useState("search");
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [initKeyword, setKeyword] = useState(queryParams && queryParams["keyword"]?queryParams["keyword"].trim():"");
  const [language, setLang] = useState(queryParams && queryParams["lang"]?queryParams["lang"]:"en");
  const [theme, setTheme] = useState(queryParams && queryParams["theme"]?queryParams["theme"]:"");
  const [orgfilters, setOrg] = useState("");
  const [typefilters, setType] = useState("");

  const handleModal = () => {
    setModal(!modal);
  };

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
    /*flag &&
    map._controls.forEach(control => {
        control.disable();
    });
    */
    setLoading(flag);

    !flag &&
    map._handlers.forEach(handler => {
        handler.enable();
    });
    //!flag && map.on('moveend', event=>eventHandler(event, initKeyword, initBounds));
    /*!flag &&
    map._controls.forEach(control => {
        control.enable();
    });*/
  }

  const handleView = (evt, id) => {
    evt.stopPropagation();
    window.open("/result?id="+encodeURI(id.trim())+"&lang="+language, "View Record " + id.trim());
  }

  const handleKeyword = (evt, keyword) => {
    evt.stopPropagation();
    window.open("/?keyword="+encodeURI(keyword.trim())+"&lang="+language+"&theme="+theme, "Search " + keyword.trim() );
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
        min: (pn-1)*10,
        max: pn*10
    }
    if (theme!=='') {
        searchParams.theme = theme;
    }
    if (orgfilters!=='') {
        searchParams.org = orgfilters;
    }
    //console.log(searchParams);
    axios.get("https://hqdatl0f6d.execute-api.ca-central-1.amazonaws.com/dev/geo", { params: searchParams})
    .then(response => response.data)
    .then((data) => {
        console.log(data);
        const results = data.Items;
        setResults(results);
        setCount(100);
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
    handleSearch(keyword, initBounds);
  };

  const eventHandler = (event, keyword, bounds) => {
    const mbounds = event.target.getBounds();
    //console.log(mbounds,bounds);
    map.off('moveend', eventHandler);
    //console.log('status:', loading, 'keyword', keyword,initKeyword);
    if (!loading && keyword!=="" && mapCount === 0 && !Object.is(mbounds, bounds)) {
        //console.log('research:', loading, keyword, mapCount);
        mapCount++;
        setLoadingStatus(true);
        //setBounds(mbounds);
        handleSearch(keyword, mbounds);
    }
  }

  useEffect(() => {
    if (initKeyword !== '') {
        handleSearch(initKeyword, initBounds);
    }
  }, [language, theme, pn, orgfilters]);
 // map.on('moveend', event=>eventHandler(event,initKeyword, initBounds));

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
            <h2>Filters:</h2>
            <SearchFilter filtertitle="Organisitions" filtervalues={organisations} filterselected={orgfilters} selectFilters={setOrg} />
            <SearchFilter filtertitle="Types" filtervalues={types} filterselected={typefilters} selectFilters={setType} />
        </div>
        <div className="container">
            {cnt>10 && <Pagination rcnt={cnt} current={pn} selectPage={setPageNumber} />}
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
            {cnt>10 && <Pagination rcnt={cnt} current={pn} selectPage={setPageNumber} />}
        </div>
        </div>
    );
}

GeoSearch.propTypes = {
    map: PropTypes.object
 };

 export default GeoSearch;
