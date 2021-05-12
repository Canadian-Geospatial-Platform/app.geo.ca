/* eslint-disable prettier/prettier */
/* jshint esversion: 6 */
/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {useLocation, useHistory} from 'react-router';
// import {useParams} from 'react-router-dom';
import { useDispatch, useSelector} from "react-redux";
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
import { NavBar } from '../navbar/nav-bar';
import { loadState } from '../../reducers/localStorage';
import { getQueryParams } from '../../common/queryparams'; 
// import { css } from "@emotion/core";
import { setMapping } from "../../reducers/action";
import './metadatapage.scss';

const MetaDataPage = () => {
    const location = useLocation();
    const history = useHistory();
    const queryParams = getQueryParams(location.search);
    const {t} = useTranslation();
    
    const mapping = useSelector(state => state.mappingReducer.mapping);
    const dispatch = useDispatch(); 
    
    // console.log(mapping);
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState([]);
    const [openSection, setOpen] = useState([]);
    const rid = queryParams && queryParams.id?queryParams.id.trim():"";
    const inMapping = rid!=="" ? mapping.findIndex((mid)=>mid===rid)>-1 : false;
    const language = t("app.language");
    // const { rid } = useParams();

    const handleOpen = (section) => {
        const newOpen = openSection.map(o=>o);
        const hIndex = openSection.findIndex(os=>os===section);
        if ( hIndex < 0 ) {
            newOpen.push(section);
        } else {
            newOpen.splice(hIndex, 1);
        }
        setOpen(newOpen);
    };

    
    const handleRowClick = (url) => {
        window.open(url, "_blank");
    };

    const handleSearch = (id) => {
      setLoading(true);
  
      const searchParams = {
          id,
          lang: language,
      };
      // console.log(searchParams);
      axios.get("https://hqdatl0f6d.execute-api.ca-central-1.amazonaws.com/dev/id", { params: searchParams})
      .then(response => response.data)
      .then((data) => {
          // console.log(data);
          const res = data.Items;
          setResults(res);
          // setKeyword(keyword);
          setLoading(false);
      })
      .catch(error=>{
          // console.log(error);
          setResults([]);
          // setKeyword(keyword);
          setLoading(false);
      });
  
    };

    const showMapping = () => {
        const cmapping = loadState() !== undefined ? loadState().mappingReducer.mapping : [];
        const mcntButton = document.getElementById("mcntBtn");
        if (mcntButton) {
            mcntButton.innerText=cmapping.length.toString();
            mcntButton.className = cmapping.length>0 ? "show" : "hidden";
        }
    };
    
    const changeMapping = (resultid) => {
        const localmapping = loadState()!==undefined ? loadState().mappingReducer.mapping : [];
        // const changeId = resultid 
        const rIndex = localmapping.findIndex(mid => mid === resultid);
        const newMapping = localmapping.map(m => m);
        if (rIndex > -1) {
            newMapping.splice(rIndex, 1);
        } else {
            newMapping.push(resultid);
        }
        dispatch(setMapping(newMapping));
        showMapping();
    }; 
  
    const viewOnMap = (resultid) => {
        history.push({
            pathname: '/map',
            search: `rvKey=${resultid}`,
        });
    }; 
    const getInMapping = () => {
       const cinMapping = (loadState()!==undefined && rid!=="") ? loadState().mappingReducer.mapping.findIndex((mid)=>mid===rid)>-1 : false;
       const ammButton = document.getElementById("addMyMap");
        if (ammButton) {
            ammButton.className = cinMapping?"btn btn-search btn-added":"btn btn-search";
            ammButton.innerText = cinMapping ? t("page.addedtomymap"):t("page.addtomymap");
        }
    };

    useEffect(() => {
      if (rid !== '') {
          handleSearch(rid);
      }
      
      window.addEventListener('storage', getInMapping);
      return () => {
            window.removeEventListener('storage', getInMapping);
      }; 
    }, [language, rid]);
  
    return (
        <div className="pageContainer resultPage">
            <div className="resultContainer" aria-live="assertive" aria-busy={loading ? "true" : "false"} >
                {loading ?
                    <div className="d-flex justify-content-center status-indicator">
                        <BeatLoader color="#515AA9" />
                    </div>
                    :
                    (!Array.isArray(results) || results.length===0 || results[0].id===undefined ?
                    <p className="d-flex justify-content-center">
                        {t("page.noresult")}
                    </p> :
                    results.map((result) => {
                        const formattedOption = result.options.replace(/\\"/g, '"').replace(/["]+/g, '"').substring(1, result.options.replace(/\\"/g, '"').replace(/["]+/g, '"').length-1);
                        const formattedContact = result.contact.replace(/\\"/g, '"').replace(/["]+/g, '"').substring(1, result.contact.replace(/\\"/g, '"').replace(/["]+/g, '"').length-1);
                        // const formattedCoordinates = result.coordinates.replace(/\\"/g, '"').replace(/["]+/g, '"').substring(1, result.coordinates.replace(/\\"/g, '"').replace(/["]+/g, '"').length-1);      
                        const options = JSON.parse(formattedOption);
                        const contact =   JSON.parse(formattedContact);
                        const coordinates = JSON.parse(result.coordinates);

                        const langInd = (language === 'en')? 0 : 1;
                        const status = result.status.split(';')[langInd];
                        const maintenance = result.maintenance.split(';')[langInd];
                        const type = result.type.split(';')[langInd];
                        const spatialRepresentation = result.spatialRepresentation.split(';')[langInd];
                        const dist = Math.max(Math.abs(coordinates[0][2][1] - coordinates[0][0][1])/15, Math.abs(coordinates[0][1][0] - coordinates[0][0][0])/30);
                        const resolution = (40.7436654315252*dist*11132);
                        const zoom = Math.max(Math.log2(3600000/resolution), 1);
                        // console.log(contact, options);
                        return (
                        <div key={result.id} className="container-search-result container-search-result-two-col">
                        <div className="row no-gutters">
                        <main className="col col-12 col-xl-8 main">
                            {/* Header */}
                            <div className="search-result-page-title-wrap">
                                <h1 className="search-result-page-title">{result.title}</h1>
                            </div>
                            {/* About */}
                            <section id="search-result-about" className="sec-search-result sec-search-result-about">
                                <h2 className="sec-title">{t("page.aboutthisdataset")}</h2>
                                <div className="search-result-desc">
                                <p>{result.description}</p>
                                </div>
                                <div className="search-result-keywords">
                                    <p><strong>{t("page.keywords")}: </strong> {result.keywords.substring(0, result.keywords.length - 2)}</p>
                                </div>
                                <table className="table table-hover caption-top table-search-result table-meta">
                                <caption>
                                    {t("page.metadata")}
                                </caption>
                                <tbody id="tbody-meta">
                                    <tr>
                                    <th scope="row">{t("page.datecreated")}</th>
                                    <td>{result.created}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">{t("page.datepublished")}</th>
                                    <td>{result.published}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">{t("page.temporalcoverage")}</th>
                                    <td> { result.temporalExtent.substring(1, result.temporalExtent.length - 1).split(",").map((date, ki)=>(
                                                <span key={ki}>{date.substring(date.indexOf("=") + 1)} </span>
                                            ))}
                                    </td>
                                    </tr>
                                    <tr>
                                    <th scope="row">{t("page.source")}</th>
                                    <td>{contact[0].organisation[language]}</td>
                                    </tr>
                                </tbody>
                                </table>
                            </section>
                            {/* Data Resources */}
                            <section id="search-result-data-resources" className="sec-search-result sec-search-result-data-resources">
                                <table className="table table-hover caption-top table-search-result table-data-resources">
                                <caption>
                                        <button id="data-resources-id" type="button" className={openSection.findIndex(o=>o==='dataresources')<0?"table-data-toggle collapse":"table-data-toggle expand"} aria-expanded={openSection.findIndex(o=>o==='dataresources')<0?"false":"true"} aria-controls="tbody-data-resources" role="button" onClick={()=>handleOpen('dataresources')}>{t("page.dataresources")}</button>
                                </caption>
                                <tbody id="tbody-data-resources" className={openSection.findIndex(o=>o==='dataresources')<0?"collapse":"collapse show"} aria-labelledby="data-resources-id">
                                    <tr>
                                    <th scope="col">{t("page.name")}</th>
                                    <th scope="col">{t("page.type")}</th>
                                    <th scope="col">{t("page.format")}</th>
                                    <th scope="col">{t("page.languages")}</th>
                                    </tr>
                                    {options.map((option, oi) => {
                                        const desc = option.description[language].split(";");
                                        return (
                                            <tr className="table-row-link" key={oi} onClick={()=>handleRowClick(option.url)}>
                                            <td>
                                                <a className="table-cell-link" href={option.url} target="_blank">{option.name[language]}</a>
                                            </td>
                                            <td>{desc[0]}</td>
                                            <td>{desc[1]}</td>
                                            <td>{t("page.language")}</td>
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
                                    <button id="conatct-data-id" type="button" className={openSection.findIndex(o=>o==='contactdata')<0?"table-data-toggle collapse":"table-data-toggle expand"} role="button" aria-expanded={openSection.findIndex(o=>o==='contactdata')<0?"false":"true"} aria-controls="tbody-contact-data" onClick={()=>handleOpen('contactdata')}>{t("page.contactdata")}</button>
                                </caption>
                                <tbody id="tbody-contact-data" className={openSection.findIndex(o=>o==='contactdata')<0?"collapse":"collapse show"} aria-labelledby="conatct-data-id">
                                    <tr>
                                    <th scope="row">{t("page.organization")}</th>
                                    <td>{contact[0].organisation[language]}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">{t("page.address")}</th>
                                    <td>{contact[0].address[language]}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">{t("page.individualname")}</th>                                    
                                    <td>{contact[0].individual[language]}</td>                                    
                                    </tr>
                                    <tr>
                                    <th scope="row">{t("page.role")}</th>
                                    <td>{contact[0].role[language]}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">{t("page.telephone")}</th>
                                    <td>{contact[0].telephone[language]}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">{t("page.fax")}</th>
                                    <td>{contact[0].fax[language]}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">{t("page.email")}</th>
                                    <td>{contact[0].email[language]}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">{t("page.web")}</th>
                                    <td>{contact[0].onlineresource.onlineresource!=="null"? <a href={contact[0].onlineresource.onlineresource} className="table-cell-link">{contact[0].onlineresource.onlineresource}</a>: 'null'}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">{t("page.description")}</th>
                                    <td>{contact[0].onlineresource.onlineresource_description!=="null" && contact[0].onlineresource.onlineresource_description}</td>
                                    </tr>
                                </tbody>
                                </table>
                            </section>
                            {/* Advanced Metadata */}
                            <section id="search-result-adv-meta" className="sec-search-result sec-search-result-adv-meta">
                                <table className="table table-hover caption-top table-search-result table-adv-meta">
                                <caption>
                                    <button id="advanced-data-id" type="button" className={openSection.findIndex(o=>o==='advdata')<0?"table-data-toggle collapse":"table-data-toggle expand"} role="button" aria-expanded={openSection.findIndex(o=>o==='advdata')<0?"false":"true"} aria-controls="tbody-adv-meta" onClick={()=>handleOpen('advdata')}>{t("page.advancedmetadata")}</button>
                                </caption>
                                <tbody id="tbody-adv-meta" className={openSection.findIndex(o=>o==='advdata')<0?"collapse":"collapse show"} aria-labelledby="advanced-data-id">
                                    <tr>
                                    <th scope="row">{t("page.status")}</th>
                                    <td>{status}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">{t("page.maintenance")}</th>
                                    <td>{maintenance}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">ID</th>
                                    <td>{result.id}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">{t("page.topiccategory")}</th>
                                    <td>{result.topicCategory}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">{t("page.type")}</th>
                                    <td>{type}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">{t("page.north")}</th>
                                    <td>{coordinates[0][2][1].toString()}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">{t("page.east")}</th>
                                    <td>{coordinates[0][1][0].toString()}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">{t("page.west")}</th>
                                    <td>{coordinates[0][0][0].toString()}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">{t("page.south")}</th>
                                    <td>{coordinates[0][0][1].toString()}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">{t("page.spatialrepresentation")}</th>
                                    <td>{spatialRepresentation}</td>
                                    </tr>
                                </tbody>
                                </table>
                            </section>
                        </main>
                        <aside className="col col-12 col-xl-4 aside">
                            <section className="sec-search-result search-results-section search-results-map">
                                <div className="ratio ratio-16x9">
                                <MapContainer
                                        center={[(coordinates[0][2][1]+coordinates[0][0][1])/2, (coordinates[0][1][0]+coordinates[0][0][0])/2]}
                                        zoom={zoom}
                                        zoomControl={false}
                                    >
                                        <TileLayer url="https://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/CBMT_CBCT_GEOM_3857/MapServer/WMTS/tile/1.0.0/BaseMaps_CBMT_CBCT_GEOM_3857/default/default028mm/{z}/{y}/{x}.jpg" attribution={t("mapctrl.attribution")} />
                                        <NavBar />
                                        <GeoJSON key={result.id} data={{
                                                "type": "Feature",
                                                "properties": {"id": result.id, "tag": "geoViewGeoJSON"},
                                                "geometry": {"type": "Polygon", "coordinates": coordinates}
                                                }} />          
                                    </MapContainer>
                                </div>
                            </section>
                            <section className="sec-search-result search-results-section search-results-misc-data">
                                <h3 className="section-title">{t("page.addtomap")}</h3>
                                <p>{t("page.viewthedata")}</p>
                                <div className="btn-group">
                                    {/* <a href={`https://viewer-visualiseur-dev.services.geo.ca/fgpv-vpgf/index-${t("app.language")}.html?keys=${result.id}`} className="btn btn-search mr-2" rel="noreferrer" target="_blank">{t("page.viewonmap")}</a> */}
                                    <button type="button" className="btn btn-search mr-2" onClick={()=>viewOnMap(result.id)}>{t("page.viewonmap")}</button>
                                    <button id="addMyMap" type="button" className={inMapping?"btn btn-search btn-added":"btn btn-search"} onClick={()=>changeMapping(result.id)}>{inMapping?t("page.addedtomymap"):t("page.addtomymap")}</button>
                                </div>
                            </section>
                            <section className="sec-search-result search-results-section search-results-misc-data">
                                <h3 className="section-title">{t("page.metadata")}</h3>
                                <p>{t("page.ourmetadatais")}</p>
                                <div className="btn-group">
                                    <a href={`https://cgp-meta-l1-geojson-dev.s3.ca-central-1.amazonaws.com/${result.id}.geojson`} className="btn btn-search mr-2" rel="noreferrer" target="_blank">{t("page.downloadgeocore")}</a>
                                    <a href={`https://csw.open.canada.ca/geonetwork/srv/csw?service=CSW&version=2.0.2&request=GetRecordById&outputSchema=csw:IsoRecord&ElementSetName=full&id=${result.id}`} className="btn btn-search" rel="noreferrer" target="_blank">{t("page.viewhnaprecord")}</a>
                                </div>
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
