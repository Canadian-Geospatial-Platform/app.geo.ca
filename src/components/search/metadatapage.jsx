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
import Helmet from 'react-helmet';
import {useLocation, useHistory} from 'react-router';
// import {useParams} from 'react-router-dom';
import { useDispatch, useSelector} from "react-redux";
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, GeoJSON, AttributionControl } from 'react-leaflet';
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
import {
    EmailShareButton,
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    EmailIcon,
    FacebookIcon,
    LinkedinIcon,
    TwitterIcon
  } from "react-share";
import { NavBar } from '../navbar/nav-bar';
import { loadState } from '../../reducers/localStorage';
import { getQueryParams } from '../../common/queryparams';
import { envglobals } from '../../common/envglobals';
import {analyticPost, analyticGet} from '../../common/analytic';
// import { css } from "@emotion/core";
import { setMapping } from "../../reducers/action";
import './metadatapage.scss';

const EnvGlobals = envglobals();

const MetaDataPage = () => {
    const location = useLocation();
    const history = useHistory();
    const queryParams = getQueryParams(location.search);
    const {t} = useTranslation();

    const mapping = useSelector(state => state.mappingReducer.mapping);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [metaresult, setResult] = useState(null);
    const [analyticLoading, setAnalyticLoading] = useState(true);
    const [analyticRes, setAnalytic] = useState({'30': 1, 'all': 1});
    const [openSection, setOpen] = useState([]);
    const rid = queryParams && queryParams.id?queryParams.id.trim():"";
    const inMapping = rid!=="" ? mapping.findIndex((m)=>m.id===rid)>-1 : false;
    const language = t("app.language");
    const licenceOrgs =
        { "en": ["Alberta", "British Columbia", "Newfoundland and Labrador", "Nova Scotia", "Ontario", "Quebec", "Yukon", "Prince Edward Island", "New Brunswick"],
          "fr": ["Alberta", "Colombie-Britannique", "Terre-Neuve-et-Labrador", "Nouvelle-Écosse", "Ontario", "Québec", "Yukon", "Île-du-Prince-Édouard", "Nouveau-Brunswick"] };
    const viewParams = {
        uuid: rid,
        loc: '/result',
        lang: language,
        type: 'use'
    };

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

      axios.get(`${EnvGlobals.APP_API_DOMAIN_URL}${EnvGlobals.APP_API_ENDPOINTS.METADATA}`, { params: searchParams})
      .then(response => response.data)
      .then((data) => {
          const res = data.Items[0];
          res.title = language==='en' ? res.title_en : res.title_fr;
          res.mappingtitle = { en: res.title_en, fr: res.title_fr };
            setResult(res);
            setLoading(false);
      })
      .catch(error=>{
          // console.log(error);
          setResult(null);
          setLoading(false);
      });

    };

    const handleAnalytic = (id) => {
        setAnalyticLoading(true);

        analyticGet(
            '10',
            {uuid:id, lang: language},
            (res) => {
                setAnalytic(JSON.parse(res.data));
                setAnalyticLoading(false);
            },
            (analyticErr) => {
                setAnalytic({});
                setAnalyticLoading(false);            }
        );

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
        const rIndex = localmapping.findIndex(m => m.id === resultid);
        const newMapping = localmapping.map(m => m);
        if (rIndex > -1) {
            newMapping.splice(rIndex, 1);
        } else {
            newMapping.push({
                id: resultid,
                title: metaresult.mappingtitle
            });
            viewParams.event = 'map';
            analyticPost(viewParams);
        }
        dispatch(setMapping(newMapping));
        showMapping();
    };

    const viewOnMap = (resultid) => {
        viewParams.event = 'map';
        analyticPost(viewParams);
        history.push({
            pathname: '/map',
            search: `rvKey=${resultid}`,
        });
    };

    const backtoSearch = () => {
        const {stateKO, stateKeyword, statePn, stateBounds } = location.state;
        history.push({
            pathname: '/',
            search: `keyword=${encodeURI( stateKeyword.trim() )}${stateKO ? '&ksonly' : ''}`,
            state: {statePn, stateBounds}
        });
    }

    const handleMetaDataBtn = (mdEvent) => {
        viewParams.event = mdEvent;
        analyticPost(viewParams);
    };

    const resourceClick = (rname, rtype) => {
        viewParams.event = 'resource';
        viewParams.resource_name = rname;
        viewParams.resource_type = rtype;
        analyticPost(viewParams);
    }

    const getInMapping = () => {
       const cinMapping = (loadState()!==undefined && rid!=="") ? loadState().mappingReducer.mapping.findIndex((m)=>m.id===rid)>-1 : false;
       const ammButton = document.getElementById("addMyMap");
        if (ammButton) {
            ammButton.className = cinMapping?"btn btn-search btn-added":"btn btn-search";
            ammButton.innerText = cinMapping ? t("page.addedtomymap"):t("page.addtomymap");
        }
    };

    const textParagraphOutput = (paraText) => {
        const paraArray = paraText.split('\\n');
        return paraArray.map((pt, i) => pt.trim().length>0 ? <p key={`pt${i}`}>{pt}</p> : <br key={`pt${i}`} /> );
    }

    useEffect(() => {
      if (rid !== '') {
          handleSearch(rid);
          handleAnalytic(rid);
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
                (metaresult === null || metaresult.id===undefined ?
                <p className="d-flex justify-content-center">
                    {t("page.noresult")}
                </p> :
                [metaresult].map((result, rmIndex) => {
                    const formattedOption = result.options.replace(/\\"/g, '"').replace(/["]+/g, '"').substring(1, result.options.replace(/\\"/g, '"').replace(/["]+/g, '"').length-1);
                    const formattedContact = result.contact.replace(/\\"/g, '"').replace(/["]+/g, '"').substring(1, result.contact.replace(/\\"/g, '"').replace(/["]+/g, '"').length-1);
                    const formattedgraphicOverview = result.graphicOverview.replace(/\\"/g, '"').replace(/["]+/g, '"');
                    const graphicOverview = formattedgraphicOverview!==null && formattedgraphicOverview!=='' ? JSON.parse(formattedgraphicOverview) : {overviewFileName: ''};
                    const imageFile = graphicOverview.map(o=>o.overviewFileName).join(',');
                    const options = JSON.parse(formattedOption)
                                    .filter(o=>{return o.protocol!==null && o.url!==null && o.protocol!=='null' && o.url!=='null'})
                                    .map((option) => {
                                        const desc = option.description[language].split(";");
                                        return {name:option.name[language], type:desc[0], format: desc[1], language: t(`page.${desc[2].toLowerCase().replace(',', '')}`), url: option.url};
                                    });

                    const tcRange = ['N/A', 'N/A'];
                    result.temporalExtent.substring(1, result.temporalExtent.length - 1).split(",").forEach((date)=>{
                        const dateStr=date.trim().split("=");
                        if (dateStr[1]!==undefined && dateStr[1].toLowerCase()!=='null') {
                            if (dateStr[0].toLowerCase()==='begin') {
                                tcRange[0] = dateStr[1];
                            }
                            if (dateStr[0].toLowerCase()==='end') {
                                tcRange[1] = dateStr[1];
                            }

                        }
                    });

                    const activeMap = options.findIndex((o)=> o.type.toUpperCase() === 'WMS' || o.type.toUpperCase() === 'WEB SERVICE' || o.type.toUpperCase() === 'SERVICE WEB') > -1;
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
                    const useL = result.useLimits.match(/^(.+) [–|-] (.+)\((.+)\)$/);
                    const showDisclaimer=Array.isArray(useL) && licenceOrgs[language].findIndex(p => p.toLowerCase() === useL[2].trim().toLowerCase())>-1;
                    const showWHDisclaimer = result.source_system_name.includes('Canadian Geospatial Data Infrastructure Web Harvester');
                    // console.log(contact, options);

                    return (
                    <div key={`rm-${rmIndex}`} className="container-search-result container-search-result-two-col">
                    <Helmet>
                        <meta property="og:title" content={result.title} />
                        <meta property="og:description" content={result.description} />
                        <meta property="og:type" content="website" />
                        <meta property="og:image" content={imageFile} />
                        <meta property="og:site_name" content={EnvGlobals.SITE_NAME} />
                        <meta property="og:locale" content={`${language}-CA`} />
                        <meta property="og:url" content={window.location.href} />
                        <meta property="og:image:alt" content={`${window.location.origin}/assets/img/GeoDotCaBanner.jpg`} />
                        <meta name="twitter:card" content="summary" />
                        <meta name="twitter:title" content={result.title} />
                        <meta name="twitter:description" content={result.description} />
                        <meta name="twitter:site" content="" />
                        <meta name="twitter:image" content={imageFile} />
                    </Helmet>
                    <div className="row no-gutters">
                    <main className="col col-12 col-xl-8 main">
                        {/* Header */}
                        <div className="search-result-page-title-wrap">
                            <button
                                className="search-nav-button link-button"
                                type="button"
                                onClick={backtoSearch}
                            >
                                {t('page.gotogeosearchpage')}
                            </button>
                            <h1 className="search-result-page-title">{result.title}</h1>
                        </div>
                        {/* About */}
                        <section id="search-result-about" className="sec-search-result sec-search-result-about">
                            <h2 className="sec-title">{t("page.aboutthisdataset")}</h2>
                            <div className="search-result-desc">
                                {textParagraphOutput(result.description)}
                            </div>
                            <div className="search-result-keywords">
                                <p><strong>{t("page.keywords")}: </strong> {result.keywords}</p>
                            </div>
                            <table className="table table-hover caption-top table-search-result table-meta">
                            <caption>
                                {t("page.metadata")}
                            </caption>
                            <tbody id="tbody-meta">
                            {showWHDisclaimer ?
                              <span></span> :
                                <tr>
                                <th scope="row">{t("page.datecreated")}</th>
                                <td>{result.created}</td>
                                </tr> }
                            {showWHDisclaimer ?
                              <span></span> :
                                <tr>
                                <th scope="row">{t("page.datepublished")}</th>
                                <td>{result.published}</td>
                                </tr> }
                            {showWHDisclaimer ?
                              <span></span> :
                                <tr>
                                <th scope="row">{t("page.temporalcoverage")}</th>
                                <td> { tcRange.map((date, ki)=>(
                                            <span key={ki}>{date} </span>
                                        ))}
                                </td>
                                </tr> }
                                <tr>
                                <th scope="row">{t("page.source")}</th>
                                <td>{contact[0].organisation[language]}</td>
                                </tr>
                            {showWHDisclaimer ?
                              <span></span> :
                                <tr>
                                <th scope="row">{t("page.uselimits")}</th>
                                <td>{useL===null ? result.useLimits :
                                        [1].map((x)=>{
                                            return (
                                    <div key={x}>
                                        {useL[1]} - {useL[2]}<a className="table-cell-text-link" href={useL[3]} target="_blank">{useL[3]}</a>
                                    </div>)})}
                                </td>
                                </tr> }
                            {showDisclaimer &&
                                <tr>
                                <th scope="row">{t("page.disclaimer")}</th>
                                <td>
                                    <p>{t("page.dcheader")}{useL[2]}</p>
                                    <p>{t("page.dcp1")}</p>
                                    <p>{t("page.dcp2.text1")}<a className="table-cell-text-link" href={t("page.dcp2.link1.url")} target="_blank">{t("page.dcp2.link1.text")}</a>{t("page.dcp2.text2")}<a className="table-cell-text-link" href={t("page.dcp2.link2.url")} target="_blank">{t("page.dcp2.link2.text")}</a>{t("page.dcp2.text3")}</p>
                                </td>
                                </tr>}
                            {showWHDisclaimer &&
                                <tr>
                                <th scope="row">{t("page.disclaimer")}</th>
                                <td>
                                    <p>{t("page.dwhheader")}</p>
                                    <p>{t("page.dwh0")}</p>
                                    <p>{t("page.dwh1")}</p>
                                    <p>{t("page.dwh2.text1")}<a className="table-cell-text-link" href={t("page.dwh2.link1.url")} target="_blank">{t("page.dwh2.link1.text")}</a>{t("page.dwh2.text2")}<a className="table-cell-text-link" href={t("page.dwh2.link2.url")} target="_blank">{t("page.dwh2.link2.text")}</a>{t("page.dwh2.text3")}</p>
                                </td>
                                </tr>}
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
                                    // const desc = option.description[language].split(";");
                                    return (
                                        <tr className="table-row-link" key={oi} onClick={()=>handleRowClick(option.url)}>
                                        <td>
                                            <a className="table-cell-link" href={option.url} target="_blank" onClick={()=>resourceClick(option.name, option.type)}>{option.name}</a>
                                        </td>
                                        <td>{option.type}</td>
                                        <td>{option.format}</td>
                                        <td>{option.language}</td>
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
                                <td>{!!contact[0].organisation && !!contact[0].organisation[language] && contact[0].organisation[language] !== 'null' ? contact[0].organisation[language] : 'N/A'}</td>
                                </tr>
                                {showWHDisclaimer ?
                                  <span></span> :
                                <tr>
                                <th scope="row">{t("page.address")}</th>
                                <td>{!!contact[0].address && !!contact[0].address[language] && contact[0].address[language] !== 'null' ? contact[0].address[language] : 'N/A'}</td>
                                </tr> }
                                {showWHDisclaimer ?
                                  <span></span> :
                                <tr>
                                <th scope="row">{t("page.individualname")}</th>
                                <td>{!!contact[0].individual && !!contact[0].individual[language] && contact[0].individual[language] !== 'null' ? contact[0].individual[language] : 'N/A'}</td>
                                </tr> }
                                {showWHDisclaimer ?
                                  <span></span> :
                                <tr>
                                <th scope="row">{t("page.role")}</th>
                                <td>{!!contact[0].role!==null && !!contact[0].role[language] && contact[0].role[language] !== 'null' ? contact[0].role[language] : 'N/A'}</td>
                                </tr> }
                                {showWHDisclaimer ?
                                  <span></span> :
                                <tr>
                                <th scope="row">{t("page.telephone")}</th>
                                <td>{!!contact[0].telephone && !!contact[0].telephone[language] && contact[0].telephone[language] !== 'null' ? contact[0].telephone[language] : 'N/A'}</td>
                                </tr> }
                                {showWHDisclaimer ?
                                  <span></span> :
                                <tr>
                                <th scope="row">{t("page.fax")}</th>
                                <td>{!!contact[0].fax && !!contact[0].fax[language] && contact[0].fax[language] !== 'null' ? contact[0].fax[language] : 'N/A'}</td>
                                </tr> }
                                {showWHDisclaimer ?
                                  <span></span> :
                                <tr>
                                <th scope="row">{t("page.email")}</th>
                                <td>{!!contact[0].email && !!contact[0].email[language] && contact[0].email[language] !== 'null' ? contact[0].email[language] : 'N/A'}</td>
                                </tr> }
                                {showWHDisclaimer ?
                                  <span></span> :
                                <tr>
                                <th scope="row">{t("page.web")}</th>
                                <td>{!!contact[0].onlineresource && !!contact[0].onlineresource.onlineresource && contact[0].onlineresource.onlineresource!=='null' ? <a href={contact[0].onlineresource.onlineresource} className="table-cell-link" target="_blank">{contact[0].onlineresource.onlineresource}</a> : 'N/A'}</td>
                                </tr> }
                                {showWHDisclaimer ?
                                  <span></span> :
                                <tr>
                                <th scope="row">{t("page.description")}</th>
                                <td>{!!contact[0].onlineresource && !!contact[0].onlineresource.onlineresource_description && contact[0].onlineresource.onlineresource_description!=='null' ? contact[0].onlineresource.onlineresource_description : 'N/A'}</td>
                                </tr> }
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
                                {showWHDisclaimer ?
                                  <span></span> :
                                <tr>
                                <th scope="row">{t("page.maintenance")}</th>
                                <td>{maintenance}</td>
                                </tr> }
                                <tr>
                                <th scope="row">ID</th>
                                <td>{result.id}</td>
                                </tr>
                                {showWHDisclaimer ?
                                  <span></span> :
                                <tr>
                                <th scope="row">{t("page.topiccategory")}</th>
                                <td>{result.topicCategory}</td>
                                </tr> }
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
                                {showWHDisclaimer ?
                                  <span></span> :
                                <tr>
                                <th scope="row">{t("page.spatialrepresentation")}</th>
                                <td>{spatialRepresentation}</td>
                                </tr> }
                            </tbody>
                            </table>
                        </section>
                    </main>
                    <aside className="col col-12 col-xl-4 aside">
                        <div className="top-sections">
                            <section className="sec-search-result search-results-section search-results-map">
                                <div className="ratio ratio-16x9">
                                <MapContainer
                                        center={[(coordinates[0][2][1]+coordinates[0][0][1])/2, (coordinates[0][1][0]+coordinates[0][0][0])/2]}
                                        zoom={zoom}
                                        zoomControl={false}
                                        attributionControl={false}
                                    >
                                        <TileLayer url="https://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/CBMT_CBCT_GEOM_3857/MapServer/WMTS/tile/1.0.0/BaseMaps_CBMT_CBCT_GEOM_3857/default/default028mm/{z}/{y}/{x}.jpg" attribution={t("mapctrl.attribution")} />
                                        <AttributionControl position="bottomleft" prefix={false} />
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
                                    <button type="button" className="btn btn-search mr-2" disabled={!activeMap} onClick={activeMap?()=>viewOnMap(result.id):null}>{t("page.viewonmap")}</button>
                                    <button id="addMyMap" type="button"  disabled={!activeMap} className={inMapping?"btn btn-search btn-added":"btn btn-search"} onClick={activeMap?()=>changeMapping(result.id):null}>{inMapping?t("page.addedtomymap"):t("page.addtomymap")}</button>
                                </div>
                            </section>
                            <section className="sec-search-result search-results-section search-results-misc-data">
                                <h3 className="section-title">{t("page.metadata")}</h3>
                                <p>{t("page.ourmetadatais")}</p>
                                <div className="btn-group">
                                    <a href={`${EnvGlobals.APP_GEOCORE_URL}/${result.id}.geojson`} className="btn btn-search mr-2" rel="noreferrer" target="_blank" onClick={()=>handleMetaDataBtn('geocore')}>{t("page.downloadgeocore")}</a>
                                    {showWHDisclaimer ?
                                      <a href={`https://csw.open.canada.ca/geonetwork/srv/csw?service=CSW&version=2.0.2&request=GetRecordById&outputSchema=csw:IsoRecord&ElementSetName=full&id=${result.id}`} className="btn btn-search" disabled="true" rel="noreferrer" target="_blank" onClick={()=>handleMetaDataBtn('hnap')}>{t("page.viewhnaprecord")}</a>
                                    : <a href={`https://csw.open.canada.ca/geonetwork/srv/csw?service=CSW&version=2.0.2&request=GetRecordById&outputSchema=csw:IsoRecord&ElementSetName=full&id=${result.id}`} className="btn btn-search" rel="noreferrer" target="_blank" onClick={()=>handleMetaDataBtn('hnap')}>{t("page.viewhnaprecord")}</a> }
                                </div>
                            </section>
                            <section className="sec-search-result search-results-section search-results-analytics-data">
                                <h3 className="section-title">{t("page.numberofacesses")}</h3>
                                <div className="card-wrap">
                                    <div className="card">
                                        <h4 className="card-title">{t("page.last30")}</h4>
                                        <p className="card-count">{analyticLoading ?
                                            <BeatLoader color="#515AA9" />
                                            : ( isNaN(analyticRes["30"]) ?
                                                <span>{t("analytic.loadingfailed")}, <button type="button" className="link-button" onClick={()=>handleAnalytic(rid)}>{t("analytic.tryagain")}</button></span>
                                                :analyticRes["30"]
                                            )}
                                        </p>
                                    </div>
                                    <div className="card">
                                    <h4 className="card-title">{t("page.alltime")}</h4>
                                        <p className="card-count">{analyticLoading ?
                                            <BeatLoader color="#515AA9" />
                                            : ( isNaN(analyticRes.all) ?
                                                <span>{t("analytic.loadingfailed")}, <button type="button" className="link-button" onClick={()=>handleAnalytic(rid)}>{t("analytic.tryagain")}</button></span>
                                                :analyticRes.all
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>
                        <div className="bottom-sections">
                            <section className="sec-search-result search-results-section search-results-share-buttons">
                                <h3 className="section-title">{t("page.share")}</h3>
                                <div className="btn-group">
                                    <FacebookShareButton url={encodeURI(window.location.href)}><FacebookIcon size={50} round /></FacebookShareButton>
                                    <TwitterShareButton url={encodeURI(window.location.href)}><TwitterIcon size={50} round /></TwitterShareButton>
                                    <LinkedinShareButton url={encodeURI(window.location.href)}><LinkedinIcon size={50} round /></LinkedinShareButton>
                                    <EmailShareButton url={encodeURI(window.location.href)}><EmailIcon size={50} round /></EmailShareButton>
                                </div>
                            </section>
                        </div>
                    </aside>
                </div>
                </div>
                )} ))}
        </div>
    </div>
    );
}

export default MetaDataPage;
