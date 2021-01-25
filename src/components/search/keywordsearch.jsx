import React, { useState, createRef } from "react";
// reactstrap components
import {
  Button,
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import SearchIcon from '@material-ui/icons/Search';
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/core";

const KeywordSearch = () => {
  const inputRef = createRef();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState("search");
  const [open, setOpen] = useState(false);
  //const [initKeyword, setKeyword] = useState("");
  const [modal, setModal] = useState(false);  
   
  const handleSelect = (event) => {
    //const {selectResult} = this.props;  
    const cardOpen = selected === event ? !open : true;
    const result = Array.isArray(results) && results.length>0 && cardOpen ? results.find(r=>r.id===event): null;
    
    setSelected(event);
    setOpen(cardOpen);
  };

  const handleModal = () => {
    setModal(!modal);
  };

  const handleSearch = (keyword) => {
    setLoading(true);  
    
    const searchParams = {
        keyword: keyword,
        keyword_only: 'true',
        lang: 'en'
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

  const handleSubmit = (event) => {
    if (event) {
        event.preventDefault();
    }
  
    const keyword = inputRef.current.value; 
    handleSearch(keyword);
  };

  const handleView = (id) => {
    window.open("/#/result?id="+id, "View Record");
  }

  const handleKeyword = (keyword) => {
    window.open("/#/search?keyword="+keyword, "New Search page");
  }

  return (
        <div className="pageContainer">
        <h1>NRCan GEO Keyword Search</h1>
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
                results.map((result) => (  
                <div key={result.id} class="searchResult container-fluid">
                    <div class="row rowDividerMd">
                        <div class="col-md-1" />
                        <div class="col-md-4 searchImage">
                            <p>Image height: 300px</p>
                            {/* <img src="img/CensusDivision2016.png" alt="Census Subdivisions in 2016 in Canada" height="100%" loading="lazy" /> */}
                        </div>
                        <div class="col-md-6">
                            <p class="searchTitle">{result.title}</p>
                            <div class="searchButtonGroupToolbar">
                                <div class="btn-toolbar searchButtonGroup" role="toolbar" aria-label="Toolbar with button groups">
                                {result.keywords.substring(0, result.keywords.length - 2).split(",").map((keyword, ki)=>{
                                    return (<div class="btn-group searchButtonGroupBtn" role="group" key={ki} aria-label={ki + "group small"}>
                                                <button type="button" class="btn" onClick = {() => handleKeyword(keyword)}>{keyword}</button>
                                            </div>)
                                })}
                                </div>
                                <div>
                                    <p class="searchDesc">{result.description.substr(0,240)} {result.description.length>240 ? <span onClick={handleModal}>...</span> : ""}</p>
                                    <button type="button" class="btn btn-block searchButton" onClick={() => handleView(result.id)}>View Record <i class="fas fa-long-arrow-alt-right"></i></button>
                                </div>
                            </div>    
                        </div>
                        <div class="col-md-1 " />
                    </div>
                </div> 
                )))}
        </div>
        </div>
    );
}

export default KeywordSearch;
