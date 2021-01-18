import React, { useState, useEffect, createRef } from "react";
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
  //const map = useMap();
  const inputRef = createRef();
  let mapCount = 0;
  const [map, setMap] = useState(geoMap);
  const [initBounds, setBounds] = useState(geoMap.getBounds());
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState("search");
  const [open, setOpen] = useState(false);
  const [initKeyword, setKeyword] = useState("");
  const [modal, setModal] = useState(false);  
   
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

  const handleModal = () => {
    setModal(!modal);
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

  const handleSearch = (keyword) => {
    !loading && setLoadingStatus(true);  
    
    const searchParams = {
        north: initBounds._northEast.lat,
        east: initBounds._northEast.lng,
        south: initBounds._southWest.lat,
        west: initBounds._southWest.lng,
        keyword: keyword 
    }
    //console.log(searchParams);
    axios.get("https://hqdatl0f6d.execute-api.ca-central-1.amazonaws.com/dev/geo", { params: searchParams})
    .then(response => response.data)
    .then((data) => {
        console.log(data);
        const results = data.Items;
        setResults(results);
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
    handleSearch(keyword);
  };

  useEffect(() => {
    /*if (window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition( async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          map.panTo(new L.LatLng(lat, lng));
        });
    } else {
    console.log("navigator not supported");
    } */
    //if (keyword!=='')
    //  handleSearch(keyword);
   });
  const eventHandler = (event, keyword, bounds) => {
    const mbounds = event.target.getBounds();
    //console.log(mbounds,bounds);
    map.off('moveend', eventHandler);
    //console.log('status:', loading, 'keyword', keyword,initKeyword);
    if (!loading && keyword!=="" && mapCount === 0 && !Object.is(mbounds, bounds)) {
        //console.log('research:', loading, keyword, mapCount);
        mapCount++;
        setLoadingStatus(true);
        setBounds(mbounds);
        handleSearch(keyword);
    }
  }

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
                //onChange={this.handleChange}
            />
            <button className="icon-button" disabled = {loading} type="button" onClick={!loading ? handleSubmit : null}><SearchIcon /></button>
        </div>
        <div className="container">
            {loading ?
                <div className="d-flex justify-content-center">
                <BeatLoader
                color={'#0074d9'}
                />
                </div>
                :
                (!Array.isArray(results) || results.length===0 || results[0].id===undefined ? 
                (Array.isArray(results) && results.length===0 ? 'Input keyword to search' : 'No result') : 
                results.map((result) => (  
                <div className="row" key={result.id}>
                    <div className="col-lg-12 d-flex align-items-stretch">
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
                </div>
                </div>
                )))
            }
        </div>
        </div>
    );
}

GeoSearch.propTypes = {
   map: PropTypes.object
};
  
export default GeoSearch;
