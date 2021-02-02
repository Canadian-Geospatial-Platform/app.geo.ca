import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, ScaleControl, AttributionControl, GeoJSON } from 'react-leaflet';
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
    const [openSection, setOpen] = useState([]);
    const [rid, setID] = useState(queryParams && queryParams["id"]?queryParams["id"].trim():"");
    const [language, setLang] = useState(queryParams && queryParams["lang"]?queryParams["lang"]:"en");
    const [theme, setTheme] = useState(queryParams && queryParams["theme"]?queryParams["theme"]:"");

    const handleOpen = (section) => {
        const newOpen = openSection.map(o=>o);
        const hIndex = openSection.findIndex(os=>os===section);
        if ( hIndex < 0 ) {
            newOpen.push(section);
        } else {
            newOpen.splice(hIndex, 1);
        }
        setOpen(newOpen);
    }
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
          //console.log(data);
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
          <div className="pageContainer resultPage">
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
                      No result
                  </div> :
                  results.map((result) => {
                    const formattedOption = result.options.replace(/\\"/g, '"').replace(/["]+/g, '"').substring(1, result.options.replace(/\\"/g, '"').replace(/["]+/g, '"').length-1);
                    const formattedContact = result.contact.replace(/\\"/g, '"').replace(/["]+/g, '"').substring(1, result.contact.replace(/\\"/g, '"').replace(/["]+/g, '"').length-1);
                    //const formattedCoordinates = result.coordinates.replace(/\\"/g, '"').replace(/["]+/g, '"').substring(1, result.coordinates.replace(/\\"/g, '"').replace(/["]+/g, '"').length-1);      
                    const options = JSON.parse(formattedOption);
                    const contact =   JSON.parse(formattedContact);
                    const coordinates = JSON.parse(result.coordinates);

                    const langInd = (language == 'en')? 0 : 1;
                    const status = result.status.split(';')[langInd];
                    const maintenance = result.maintenance.split(';')[langInd];
                    const type = result.type.split(';')[langInd];
                    const spatialRepresentation = result.spatialRepresentation.split(';')[langInd];
                    //console.log(contact, options);
                    return (
                    <div key={result.id} className="container-fluid container-search-result container-search-result-two-col">
                    <div className="row g-0">
                      <main className="col col-lg-8 main">
                          {/* Header */}
                          <header className="header">
                              <h1 className="search-result-page-title">{result.title}</h1>
                          </header>
                          {/* About */}
                          <section id="search-result-about" className="sec-search-result sec-search-result-about">
                              <h2 className="sec-title">About this dataset</h2>
                              <div className="search-result-desc">
                              <p>{result.description}</p>
                              </div>
                              <div className="search-result-keywords">
                                  <p><strong>Keywords: </strong> {result.keywords.substring(0, result.keywords.length - 2)}</p>
                              </div>
                              <table className="table table-hover caption-top table-search-result table-meta">
                              <caption>
                                  Metadata
                              </caption>
                              <tbody id="tbody-meta">
                                  <tr>
                                  <th scope="row">Date Created</th>
                                  <td>{result.created}</td>
                                  </tr>
                                  <tr>
                                  <th scope="row">Date Published</th>
                                  <td>{result.published}</td>
                                  </tr>
                                  <tr>
                                  <th scope="row">Temporal Coverage</th>
                                  <td> { result.temporalExtent.substring(1, result.temporalExtent.length - 1).split(",").map((date, ki)=>(
                                              <span key={ki}>{date.substring(date.indexOf("=") + 1)} </span>
                                          ))}
                                  </td>
                                  </tr>
                                  <tr>
                                  <th scope="row">Source(s) <em className="visually-hidden">（Same as organization)</em></th>
                                  <td>{contact[0].organisation[language]}</td>
                                  </tr>
                              </tbody>
                              </table>
                          </section>
                          {/* Data Resources */}
                          <section id="search-result-data-resources" className="sec-search-result sec-search-result-data-resources">
                              <table className="table table-hover caption-top table-search-result table-data-resources">
                              <caption>
                                    <span className={openSection.findIndex(o=>o==='dataresources')<0?"collapse":"expand"} role="button" onClick={()=>handleOpen('dataresources')}>Data Resources</span>
                              </caption>
                              <tbody id="tbody-data-resources" className={openSection.findIndex(o=>o==='dataresources')<0?"collapse":"collapse show"}>
                                  <tr>
                                  <th scope="col">Name</th>
                                  <th scope="col">Type</th>
                                  <th scope="col">Format</th>
                                  <th scope="col">Languages</th>
                                  </tr>
                                  {options.map((option, oi) => {
                                      const desc = option.description[language].split(";");
                                      return (
                                        <tr key={oi}>
                                        <td>
                                            <a className="table-cell-link" href={option.url} target="_blank">{option.name[language]}</a>
                                        </td>
                                        <td>{desc[0]}</td>
                                        <td>{desc[1]}</td>
                                        <td>{language==="en"?"English" : "French"}</td>
                                        </tr>
                                      );
                                  })}
                              </tbody>
                              </table>
                          </section>
                          {/* Contact Data */}
                          <section id="search-result-contact-data" className="sec-search-result sec-search-result-contact-data">
                              <table className="table table-hover caption-top table-search-result table-contact-data">
                              <caption>
                                  <span className={openSection.findIndex(o=>o==='contactdata')<0?"collapse":"expand"} role="button" onClick={()=>handleOpen('contactdata')}>Contact Data</span>
                              </caption>
                              <tbody id="tbody-contact-data" className={openSection.findIndex(o=>o==='contactdata')<0?"collapse":"collapse show"}>
                                  <tr>
                                  <th scope="row">Organization</th>
                                  <td>{contact[0].organisation[language]}</td>
                                  </tr>
                                  <tr>
                                  <th scope="row">Address</th>
                                  <td>{contact[0].address[language]}</td>
                                  </tr>
                                  <tr>
                                  <th scope="row">Individual Name</th>                                    
                                  <td>{contact[0].individual[language]}</td>                                    
                                  </tr>
                                  <tr>
                                  <th scope="row">Role</th>
                                  <td>{contact[0].role[language]}</td>
                                  </tr>
                                  <tr>
                                  <th scope="row">Telephone</th>
                                  {/* <td><a href="tel:1-250-298-2411" className="table-cell-link">1-250-298-2411</a></td> */}
                                  <td>{contact[0].telephone[language]}</td>
                                  </tr>
                                  <tr>
                                  <th scope="row">Fax</th>
                                  <td>{contact[0].fax[language]}</td>
                                  </tr>
                                  <tr>
                                  <th scope="row">Email</th>
                                  <td>{contact[0].email[language]}</td>
                                  </tr>
                                  <tr>
                                  <th scope="row">Web</th>
                                  <td>{contact[0].onlineresource.onlineresource!=="null"? <a href={contact[0].onlineresource.onlineresource} className="table-cell-link">{contact[0].onlineresource.onlineresource}</a>: 'null'}</td>
                                  </tr>
                                  <tr>
                                  <th scope="row">Description</th>
                                  <td>DataBC encourages and enables the strategic management and sharing of data across the government enterprise and with the public.</td>
                                  </tr>
                              </tbody>
                              </table>
                          </section>
                          {/* Advanced Metadata */}
                          <section id="search-result-adv-meta" className="sec-search-result sec-search-result-adv-meta">
                              <table className="table table-hover caption-top table-search-result table-adv-meta">
                              <caption>
                                  <span className={openSection.findIndex(o=>o==='advdata')<0?"collapse":"expand"} role="button" onClick={()=>handleOpen('advdata')}>Advanced Metadata</span>
                              </caption>
                              <tbody id="tbody-adv-meta" className={openSection.findIndex(o=>o==='advdata')<0?"collapse":"collapse show"}>
                                  <tr>
                                  <th scope="row">Status</th>                                   
                                  <td>{status}</td>
                                  </tr>
                                  <tr>
                                  <th scope="row">Maintenance</th>
                                  <td>{maintenance}</td>
                                  </tr>
                                  <tr>
                                  <th scope="row">ID</th>
                                  <td>{result.id}</td>
                                  </tr>
                                  <tr>
                                  <th scope="row">Topic Category</th>
                                  <td>{result.topicCategory}</td>
                                  </tr>
                                  <tr>
                                  <th scope="row">Type</th>
                                  <td>{type}</td>
                                  </tr>
                                  <tr>
                                  <th scope="row">North</th>
                                  <td>{coordinates[0][2][1].toString()}</td>
                                  </tr>
                                  <tr>
                                  <th scope="row">East</th>
                                  <td>{coordinates[0][1][0].toString()}</td>
                                  </tr>
                                  <tr>
                                  <th scope="row">West</th>
                                  <td>{coordinates[0][0][0].toString()}</td>
                                  </tr>
                                  <tr>
                                  <th scope="row">South</th>
                                  <td>{coordinates[0][0][1].toString()}</td>
                                  </tr>
                                  <tr>
                                  <th scope="row">Spatial Representation</th>
                                  <td>{spatialRepresentation}</td>
                                  </tr>
                              </tbody>
                              </table>
                          </section>
                      </main>
                      <aside className="col col-lg-4 aside">
                          <section className="sec-search-result search-results-section search-results-map">
                              <div className="ratio ratio-16x9">
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
                          </section>
                          <section className="sec-search-result search-results-section search-results-misc-data">
                              <h3 className="section-title">Lorem Ipsum</h3>
                              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nunc est, sagittis vitae aliquam vitae, pretium id orci. Fusce eget imperdiet odio, non vehicula sapien.</p>
                              <p className="text-end"><a href="#" className="btn btn-sm">Open Map</a></p>
                          </section>
                          <section className="sec-search-result search-results-section search-results-misc-data">
                              <h3 className="section-title">Lorem Ipsum</h3>
                              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nunc est, sagittis vitae aliquam vitae, pretium id orci. Fusce eget imperdiet odio, non vehicula sapien.</p>
                              <p className="text-end"><a href="#" className="btn btn-sm">All Metadata</a></p>
                          </section>
                          <section className="sec-search-result search-results-section search-results-misc-data">
                              <h3 className="section-title">Lorem Ipsum</h3>
                              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nunc est, sagittis vitae aliquam vitae, pretium id orci. Fusce eget imperdiet odio, non vehicula sapien.</p>
                          </section>
                      </aside>
                  </div>
                </div> 
                  )} ))}
          </div>
          </div>
      );
}
  
export default MetaDataPage;
