import React, { useState, useEffect } from "react";
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/core";

const MetaDataPage = (props) => {
    const queryParams = {};
    if (props.location.search.trim()!=='') {
      props.location.search.trim().substr(1).split('&').forEach( q=>{
          let item = q.split("=");
          queryParams[item[0]] = decodeURI(item[1]);
      });
    }
  
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState([]);
    const [rid, setID] = useState(queryParams && queryParams["id"]?queryParams["id"].trim():"");
    const [language, setLang] = useState(queryParams && queryParams["lang"]?queryParams["lang"]:"en");
    const [theme, setTheme] = useState(queryParams && queryParams["theme"]?queryParams["theme"]:"");

    const handleSearch = (id) => {
      setLoading(true);
  
      const searchParams = {
          id: id,
          lang: language,
      };
      //console.log(searchParams);
      axios.get("https://hqdatl0f6d.execute-api.ca-central-1.amazonaws.com/dev/id", { params: searchParams})
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
  
    const handleKeyword = (keyword) => {
      window.open("/#/search?keyword="+encodeURI(keyword.trim())+"&lang="+language+"&theme="+theme, "Search " + keyword.trim() );
    }
  
    useEffect(() => {
      if (rid !== '') {
          handleSearch(rid);
      }
    }, [language, rid]);
  
    return (
          <div className="pageContainer">
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
                                  <div>
                                      <p class="searchDesc">{result.description}</p>
                                      <p><strong>Published:</strong> {result.published}</p>
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
  
export default MetaDataPage;
