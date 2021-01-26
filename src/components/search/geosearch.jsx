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
import SearchIcon from '@material-ui/icons/Search';
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/core";

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
  const [selected, setSelected] = useState("search");
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [initKeyword, setKeyword] = useState(queryParams && queryParams["keyword"]?queryParams["keyword"].trim():"");
  const [language, setLang] = useState(queryParams && queryParams["lang"]?queryParams["lang"]:"en");
  const [theme, setTheme] = useState(queryParams && queryParams["theme"]?queryParams["theme"]:"");

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
    window.open("/#/result?id="+encodeURI(id.trim())+"&lang="+language, "View Record " + id.trim());
  }

  const handleKeyword = (evt, keyword) => {
    evt.stopPropagation();
    window.open("/#/?keyword="+encodeURI(keyword.trim())+"&lang="+language+"&theme="+theme, "Search " + keyword.trim() );
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
        keyword: keyword
    }
    //console.log(searchParams);
    axios.get("https://hqdatl0f6d.execute-api.ca-central-1.amazonaws.com/dev/geo", { params: searchParams})
    .then(response => response.data)
    .then((data) => {
        console.log(data);
        const results = data.Items;
        setResults(results);
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
  }, [language, theme]);
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
            />
            <button className="icon-button" disabled = {loading} type="button" onClick={!loading ? handleSubmit : null}><SearchIcon /></button>
        </div>
        <div className="container">
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
                    <div key={result.id} class={(selected === result.id && open === true) ? "col-sm-12 searchResult selected":"col-sm-12 searchResult"} onClick={() => handleSelect(result.id)}>
                        <p class="searchTitle">{result.title}</p>

                        {/*<div class="searchButtonGroupToolbar">
                            <div class="btn-toolbar searchButtonGroup" role="toolbar" aria-label="Toolbar with button groups">
                            {result.keywords.substring(0, result.keywords.length - 2).split(",").map((keyword, ki)=>{
                                return (<div class="btn-group searchButtonGroupBtn" role="group" key={ki} aria-label={ki + "group small"}>
                                            <button type="button" class="btn" onClick = {(e) => handleKeyword(e, keyword)}>{keyword}</button>
                                        </div>)
                            })}
                        </div>
                        </div>*/}

                        <div>
                            <p class="searchDesc">{result.description.substr(0,240)} {result.description.length>240 ? <span>...</span> : ""}</p>
                            <button type="button" class="btn btn-sm searchButton" onClick={(e) => handleView(e, result.id)}>View Record <i class="fas fa-long-arrow-alt-right"></i></button>
                        </div>



                    {/* <div className="col-lg-12 d-flex align-items-stretch">
                    <Card className="p-0 col-lg-12">
                    {(selected === result.id && open === true ?
                    <div>
                        <div onClick={() => handleSelect(result.id)}>
                            <h6 className="text-left font-weight-bold pt-2 pl-2">{result.title}</h6>
                            <p className="text-left pt-2 pl-2">{result.description.substr(0,240)} <span onClick={handleModal}>...show more</span></p>
                            <p className="text-left pt-1 pl-2"><strong>Organisation: </strong>{result.organisation}</p>
                            <p className="text-left pl-2"><strong>Published: </strong>{result.published}</p>
                            <p className="text-left pl-2"><strong>Keywords: </strong>{result.keywords.substring(0, result.keywords.length - 2)}</p>
                        </div>
                        <div className="pt-2 pl-2 pb-3"><Button color="primary" size="sm" className="on-top" onClick={handleModal}>Show Metadata</Button></div>
                        <Modal isOpen={modal} toggle={handleModal}>
                        <ModalHeader toggle={handleModal}>{result.title}</ModalHeader>
                        <ModalBody>
                            <p><strong>Description:</strong></p>
                            <p>{result.description}</p>
                            <p><strong>Organisation:</strong> {result.organisation}</p>
                            <p><strong>Published:</strong> {result.published}</p>
                            <p><strong>Keywords:</strong> {result.keywords.substring(0, result.keywords.length - 2)}</p>
                        </ModalBody>
                        <ModalFooter>
                            <a href={`https://cgp-meta-l1-geojson-dev.s3.ca-central-1.amazonaws.com/` + result.id + `.geojson`} target="_blank" ><Button color="primary">View Full Metadata</Button></a>{' '}
                            <Button color="secondary" onClick={handleModal}>Close</Button>
                        </ModalFooter>
                        </Modal>
                    </div>
                    :
                    <div onClick={() => handleSelect(result.id)}>
                        <h6 className="text-left font-weight-bold pt-2 pl-2">{result.title}</h6>
                        <p className="text-left pt-2 pl-2 text-truncate">{result.description}</p>
                    </div>
                    )}
                    <div className="p-1 text-center">
                        <small onClick={() => handleSelect(result.id)}>
                        {selected === result.id && open === true ? "Click to Close":"Click for More" }
                        </small>
                    </div>
                    </Card>
                </div> */}
                </div>
                ))}
                </div>
            )}
        </div>
        </div>
    );
}

GeoSearch.propTypes = {
    map: PropTypes.object
 };

 export default GeoSearch;
