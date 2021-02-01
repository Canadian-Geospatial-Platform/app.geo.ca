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
    const [options, setOptions] = useState(queryParams && queryParams["options"]?queryParams["options"]:"");
    const [contact, setContact] = useState(queryParams && queryParams["contact"]?queryParams["contact"]:"");
    const [coordinates, setCoordinates] = useState(queryParams && queryParams["coordinates"]?queryParams["coordinates"]:"");
    const [individual, setIndividual] = useState("");
    const [organisation, setOrganisation] = useState("");
    const [role, setRole] = useState("");
    const [telephone, setTelephone] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [fax, setFax] = useState("");


    // const [individual, setIndividual] = useState(
    //     {contact: {
    //           individual: "",
    //           fieldTwo: {
    //              fieldTwoOne: "b",
    //              fieldTwoTwo: "c"
    //              }
    //           }
    //      })
    

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
          const result1 = results[0];
          console.log(result1);
        //   let formattedOption = result1.options.replace(/\\"/g, '"').replace(/["]+/g, '"').substring(1, result1.options.replace(/\\"/g, '"').replace(/["]+/g, '"').length-1);
        //   let formattedContact = result1.contact.replace(/\\"/g, '"').replace(/["]+/g, '"').substring(1, result1.contact.replace(/\\"/g, '"').replace(/["]+/g, '"').length-1);
        //   let formattedCoordinates = result1.coordinates.replace(/\\"/g, '"').replace(/["]+/g, '"').substring(1, result1.coordinates.replace(/\\"/g, '"').replace(/["]+/g, '"').length-1);          

             let formattedOption = result1.options.replace(/\\"/g, '"').replace(/["]+/g, '"').substring(1, result1.options.replace(/\\"/g, '"').replace(/["]+/g, '"').length-1);
             let formattedContact = result1.contact.replace(/\\"/g, '"').replace(/["]+/g, '"').substring(1, result1.contact.replace(/\\"/g, '"').replace(/["]+/g, '"').length-1);
             let formattedCoordinates = result1.coordinates.replace(/\\"/g, '"').replace(/["]+/g, '"').substring(1, result1.coordinates.replace(/\\"/g, '"').replace(/["]+/g, '"').length-1);      

          setResults(results);
          setOptions(formattedOption);
          setContact((formattedContact));
          setCoordinates(formattedCoordinates);

          console.log("-----Check Language----------------------------------------");
          console.log(language);
          console.log("-----------------------------------------------------");

          let contact1 =   JSON.parse(formattedContact);
          //let contact1 =   JSON.parse(contact);
          //let contact1 =   contact;
          //let contat11 = contact1[0]("individual");
          
          //console.log(console.log(data));
          console.log(formattedContact);

          
          console.log("--------------------------------------------------");
          console.log(contact1[0].individual);
          setIndividual(contact1[0].individual);
          console.log("--------------------------------------------------");
          console.log(contact1[0].organisation);
          //setOrganisation((language == 'en')?contact1[0].organisation.en:contact1[0].organisation.fr);
          setOrganisation((language == 'en')? contact1[0].organisation.en: contact1[0].organisation.fr);

          console.log("--------------------------------------------------");
          console.log(contact1[0].role);
          setRole(contact1[0].role);

          console.log("--------------------------------------------------");  
          console.log(contact1[0].telephone);
          //setOrganisation((language == 'en')?contact1[0].organisation.en:contact1[0].organisation.fr);
          setTelephone((language == 'en')? contact1[0].telephone.en: contact1[0].telephone.fr);

          console.log("--------------------------------------------------");  
          console.log(contact1[0].address);
          //setOrganisation((language == 'en')?contact1[0].organisation.en:contact1[0].organisation.fr);
          setAddress((language == 'en')? contact1[0].address.en: contact1[0].address.fr);

          console.log("--------------------------------------------------");
          console.log(contact1[0].fax);
          setFax(contact1[0].fax);

          console.log("--------------------------------------------------");  
          console.log(contact1[0].email);
          //setOrganisation((language == 'en')?contact1[0].organisation.en:contact1[0].organisation.fr);
          setEmail((language == 'en')? contact1[0].email.en: contact1[0].email.fr);

          



          console.log("--------------------------------------------------");
          console.log(contact1);

          console.log("--------------------------------------------------");  

          console.log(result1);

          //console.log(contact1[0].individual);
          console.log("--------------------------------------------------");  

          console.log(result1.contact);


          //setIndividual(JSON.stringify(result1.contact[0].individual));


          console.log(individual);

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
                   
                  <div key={result.id} class="container-fluid container-search-result container-search-result-two-col">
     
                      <div class="row g-0">
                        <main class="col col-lg-8 main">
                            {/* Header */}
                            <header class="header">
                                <h1 class="search-result-page-title">{result.title}</h1>
                            </header>
                            {/* About */}
                            <section id="search-result-about" class="sec-search-result sec-search-result-about">
                                <h2 class="sec-title">About this dataset</h2>
                                <div class="search-result-desc">
                                <p>{result.description}</p>
                                </div>
                                <div class="search-result-keywords">
                                    <p><strong>Keywords: </strong> {result.keywords}</p>
                                </div>
                                <table class="table table-hover caption-top table-search-result table-meta">
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
                                    <td> { result.temporalExtent.substring(1, result.temporalExtent.length - 1).split(",").map((date, ki)=>{
                                            let str = date.substring(date.indexOf("=") + 1);
                                        
                                            return (
                                                <span>{str}</span>
                                            )
                                            }
                                        
                                        )}
                                    </td>
                                    </tr>
                                    <tr>
                                    <th scope="row">Source(s) <em class="visually-hidden">（Same as organization)</em></th>
                                    <td>{organisation}</td>
                                    </tr>
                                </tbody>
                                </table>
                            </section>
                            {/* Data Resources */}
                            <section id="search-result-data-resources" class="sec-search-result sec-search-result-data-resources">
                                <table class="table table-hover caption-top table-search-result table-data-resources">
                                <caption>
                                    <a data-bs-toggle="collapse" href="#tbody-data-resources" role="button" aria-expanded="true" aria-controls="tbody-data-resources">Data Resources</a>
                                </caption>
                                <tbody id="tbody-data-resources" class="collapse show">
                                    <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Format</th>
                                    <th scope="col">Languages</th>
                                    </tr>
                                    <tr>
                                    <td>
                                        <a class="table-cell-link" href="https://nfi.nfis.org/downloads/nfi_knn2011.zip" target="_blank">Forest Attribute Maps of Canada</a>
                                    </td>
                                    <td>Dataset</td>
                                    <td>GeoTIF</td>
                                    <td>English</td>
                                    </tr>
                                    <tr>
                                    <td><a class="table-cell-link" href="http://www.nrcresearchpress.com/doi/abs/10.1139/cjfr-2013-0401#.VzX_A9L2Y-U" target="_blank">Mapping attributes of Canada's forests</a></td>
                                    <td>Supporting Document</td>
                                    <td>HTML</td>
                                    <td>English</td>
                                    </tr>
                                    <tr>
                                    <td><a class="table-cell-link" href="https://nfi.nfis.org/mapserver/cgi-bin/nfis-kNN_2011.cgi?layers=kNN_SpeciesDominant_broadleaf_250m_2011&request=getcapabilities&service=wms&caption_format=image/png&feature_info_type=text/plain" target="_blank">Broad-leaved species in Canada 2011</a></td>
                                    <td>Web Service</td>
                                    <td>WMS</td>
                                    <td>English</td>
                                    </tr>
                                    <tr>
                                    <td><a class="table-cell-link" href="https://nfi.nfis.org/en/maps" target="_blank">Canada's National Forest Inventory (NFI) (English)</a></td>
                                    <td>Application</td>
                                    <td>HTML</td>
                                    <td>English</td>
                                    </tr>
                                </tbody>
                                </table>
                            </section>
                            {/* Contact Data */}
                            <section id="search-result-contact-data" class="sec-search-result sec-search-result-contact-data">
                                <table class="table table-hover caption-top table-search-result table-contact-data">
                                <caption>
                                    <a data-bs-toggle="collapse" href="#tbody-contact-data" role="button" aria-expanded="false" aria-controls="tbody-contact-data">Contact Data</a>
                                </caption>
                                <tbody id="tbody-contact-data">
                                    <tr>
                                    <th scope="row">Organization</th>
                                    <td>{organisation}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">Address</th>
                                    <td>{address}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">Individual Name</th>                                    
                                    <td>{individual}</td>                                    
                                    </tr>
                                    <tr>
                                    <th scope="row">Role</th>
                                    <td>{role}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">Telephone</th>
                                    {/* <td><a href="tel:1-250-298-2411" class="table-cell-link">1-250-298-2411</a></td> */}
                                    <td>{telephone}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">Fax</th>
                                    <td>{fax}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">Email</th>
                                    <td>{email}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">Web</th>
                                    <td><a href="http://nfis.org/" class="table-cell-link">http://nfis.org/</a></td>
                                    </tr>
                                    <tr>
                                    <th scope="row">Description</th>
                                    <td>DataBC encourages and enables the strategic management and sharing of data across the government enterprise and with the public.</td>
                                    </tr>
                                </tbody>
                                </table>
                            </section>
                            {/* Advanced Metadata */}
                            <section id="search-result-adv-meta" class="sec-search-result sec-search-result-adv-meta">
                                <table class="table table-hover caption-top table-search-result table-adv-meta">
                                <caption>
                                    <a data-toggle="collapse" href="#tbody-adv-meta" role="button" aria-expanded="false" aria-controls="tbody-adv-meta">Advanced Metadata</a>
                                </caption>
                                <tbody id="tbody-adv-meta" class="collapses">
                                    <tr>
                                    <th scope="row">Status</th>
                                    <td>{result.status}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">Maintenance</th>
                                    <td>{result.maintenance}</td>
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
                                    <td>{result.type}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">North</th>
                                    <td>{result.coordinates}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">East</th>
                                    <td>{result.coordinates}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">West</th>
                                    <td>{result.coordinates}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">South</th>
                                    <td>{result.coordinates}</td>
                                    </tr>
                                    <tr>
                                    <th scope="row">Spatial Representation</th>
                                    <td>{result.spatialRepresentation}</td>
                                    </tr>
                                </tbody>
                                </table>
                            </section>
                        </main>
                        <aside class="col col-lg-4 aside">
                            <section class="sec-search-result search-results-section search-results-map">
                                <div class="ratio ratio-16x9">
                                  <p>This is where a map could go</p>
                                </div>
                            </section>
                            <section class="sec-search-result search-results-section search-results-misc-data">
                                <h3 class="section-title">Lorem Ipsum</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nunc est, sagittis vitae aliquam vitae, pretium id orci. Fusce eget imperdiet odio, non vehicula sapien.</p>
                                <p class="text-end"><a href="#" class="btn btn-sm">Open Map</a></p>
                            </section>
                            <section class="sec-search-result search-results-section search-results-misc-data">
                                <h3 class="section-title">Lorem Ipsum</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nunc est, sagittis vitae aliquam vitae, pretium id orci. Fusce eget imperdiet odio, non vehicula sapien.</p>
                                <p class="text-end"><a href="#" class="btn btn-sm">All Metadata</a></p>
                            </section>
                            <section class="sec-search-result search-results-section search-results-misc-data">
                                <h3 class="section-title">Lorem Ipsum</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nunc est, sagittis vitae aliquam vitae, pretium id orci. Fusce eget imperdiet odio, non vehicula sapien.</p>
                            </section>
                        </aside>
                    </div>
                  </div>
                 



                
                
              

                  )))}
          </div>
          </div>
      );
}
  
export default MetaDataPage;
