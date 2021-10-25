/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import BeatLoader from 'react-spinners/BeatLoader';
import {analyticGet} from '../../common/analytic';
import SearchFilter from '../searchfilter/searchfilter';
import organisations from '../search/organisations.json';

import './analytic.scss';

export default function Analytic(props: analyticProps): JSX.Element {
    const {analyticOrg, setAnalyticOrg} = props;
    const [orgSelected, setOrg] = useState(analyticOrg);
    const [filterbyshown, setFilterbyshown] = useState(false);
    const [nstLoading, setNSTLoading] = useState(true);
    const [nslLoading, setNSLLoading] = useState(true);
    const [natLoading, setNATLoading] = useState(true);
    const [nalLoading, setNALLoading] = useState(true);
    const [nstNum, setNSTNUM] = useState(0);
    const [nslNum, setNSLNUM] = useState(0);
    const [natNum, setNATNUM] = useState(0);
    const [nalNum, setNALNUM] = useState(0);
    const [rslLoading, setRSLLoading] = useState(true);
    const [ralLoading, setRALLoading] = useState(true);
    const [raaLoading, setRAALoading] = useState(true);
    const [raoLoading, setRAOLoading] = useState(orgSelected.length>0 ? true : null);
    const [rankSL, setRANKSL] = useState([]);
    const [rankAL, setRANKAL] = useState([]);
    const [rankAA, setRANKAA] = useState([]);
    const [rankAO, setRANKAO] = useState([]);
    const [errMsg, setErrMsg] = useState([]);
    
    const { t } = useTranslation();
    const language = t("app.language");

    const getNST = () => {
        analyticGet(
            '2', 
            {},
            (analyticRes) => {
                setNSTNUM(analyticRes.data.Items[0].searches);
                setNSTLoading(false);
            },
            (analyticErr) => {
              // console.log(analyticErr); 
              setErrMsg(errMsg.push(JSON.stringify(analyticErr)));
              setNSTNUM(-1);
              setNSTLoading(false);
           }
        );
    }

    const getNSL = () => {
        analyticGet(
            '6', 
            {},
            (analyticRes) => {
                setNSLNUM(analyticRes.data.Items[0].searches);
                setNSLLoading(false);
            },
            (analyticErr) => {
              // console.log(analyticErr); 
              setErrMsg(errMsg.push(JSON.stringify(analyticErr)));
              setNSLNUM(-1);
              setNSLLoading(false);
           }
        );
    }

    const getNAT = () => {
        analyticGet(
            '3', 
            {},
            (analyticRes) => {
                setNATNUM(analyticRes.data.Items[0].accesses);
                setNATLoading(false);
            },
            (analyticErr) => {
              // console.log(analyticErr); 
              setErrMsg(errMsg.push(JSON.stringify(analyticErr)));
              setNATNUM(-1);
              setNATLoading(false);
           }
        );
    }

    const getNAL = () => {
        analyticGet(
            '7', 
            {},
            (analyticRes) => {
                setNALNUM(analyticRes.data.Items[0].accesses);
                setNALLoading(false);
            },
            (analyticErr) => {
              // console.log(analyticErr); 
              setErrMsg(errMsg.push(JSON.stringify(analyticErr)));
              setNALNUM(-1);
              setNALLoading(false);
           }
        );
    }

    const getRSL = () => {
        analyticGet(
            '1', 
            {},
            (analyticRes) => {
                setRANKSL(analyticRes.data.Items);
                setRSLLoading(false);
            },
            (analyticErr) => {
              // console.log(analyticErr); 
              setErrMsg(errMsg.push(JSON.stringify(analyticErr)));
              setRANKSL(null);
              setRSLLoading(false);
           }
        );
    }
    const getRAL = () => {
        analyticGet(
            '4', 
            { lang: language },
            (analyticRes) => {
                setRANKAL(analyticRes.data);
                setRALLoading(false);
            },
            (analyticErr) => {
              // console.log(analyticErr); 
              setErrMsg(errMsg.push(JSON.stringify(analyticErr)));
              setRANKAL(null);
              setRALLoading(false);
           }
        );
    }
    const getRAA = () => {
        analyticGet(
            '5', 
            { lang: language },
            (analyticRes) => {
                setRANKAA(analyticRes.data);
                setRAALoading(false);
            },
            (analyticErr) => {
              // console.log(analyticErr); 
              setErrMsg(errMsg.push(JSON.stringify(analyticErr)));
              setRANKAA(null);
              setRAALoading(false);
           }
        );
    }
    const getRAO = () => {
        analyticGet(
            '9', 
            { lang: language, org: JSON.stringify(orgSelected.map((fs: number) => organisations[language][fs].toLowerCase().replace(/\'/g,"\'\'")))},
            (analyticRes) => {
                setRANKAO(analyticRes.data);
                setRAOLoading(false);
            },
            (analyticErr) => {
              // console.log(analyticErr); 
              setErrMsg(errMsg.push(JSON.stringify(analyticErr)));
              setRANKAO(null);
              setRAOLoading(false);
           }
        );
    }

    const handleOrg = (filters: unknown): void => {
        // setFReset(true);
        setOrg(filters);
    };
    const clearOrgFilter = (filter: number) => {
        const newfilter = orgSelected.filter((fs: number) => fs !== filter);
        setOrg(newfilter);
        // setPageNumber(1);
    };

    const submitClick = () => {
        setFilterbyshown(false)
        setRAOLoading(true); 
        setAnalyticOrg(orgSelected); 
    }

    const handleView = (url: string) => {
        window.open(encodeURI(url.trim()), `_blank`);
    };
    
    useEffect(() => {
        if (nstLoading) {
            getNST();
        } 
    }, [nstLoading]);

    useEffect(() => {
        if (nslLoading) {
            getNSL();
        } 
    }, [nslLoading]);

    useEffect(() => {
        if (natLoading) {
            getNAT();
        } 
    }, [natLoading]);

    useEffect(() => {
        if (nalLoading) {
            getNAL();
        } 
    }, [nalLoading]);

    useEffect(() => {
        if (rslLoading) {
            getRSL();
        } 
    }, [rslLoading]);

    useEffect(() => {
        if (ralLoading) {
            getRAL();
        } 
    }, [ralLoading]);

    useEffect(() => {
        if (raaLoading) {
            getRAA();
        } 
    }, [raaLoading]); 

    useEffect(() => {
        if (raoLoading) {
            getRAO();
        } 
    }, [raoLoading]);

    useEffect(() => {
        // setRSLLoading(true);
        setRALLoading(true);
        setRAALoading(true);
        if (orgSelected.length>0) {
            setRAOLoading(true);
        } 
    }, [language]);

    return (
        <div className="analytic-container">
            <section className="sec-analytic-result analytic-results-section analytic-results-data">
                <div>
                    <h5>{t("analytic.searchthismonth")}</h5>
                    <p>{nstLoading ? 
                        <BeatLoader color="#515AA9" />
                        : (nstNum<0 ? 
                            <span>{t("analytic.loadingfailed")}, <button type="button" className="link-button" onClick={()=>setNSTLoading(true)}>{t("analytic.tryagain")}</button></span> 
                            :nstNum
                          )
                        }
                    </p>
                </div>
                <div>
                    <h5>{t("analytic.searchlastmonth")}</h5>
                    <p>{nslLoading ? 
                        <BeatLoader color="#515AA9" />
                        : (nslNum<0 ? 
                            <span>{t("analytic.loadingfailed")}, <button type="button" className="link-button" onClick={()=>setNSLLoading(true)}>{t("analytic.tryagain")}</button></span> 
                            :nslNum
                          )
                        }
                    </p>
                </div>
                <div>
                    <h5>{t("analytic.accessthismonth")}</h5>
                    <p>{natLoading ? 
                        <BeatLoader color="#515AA9" />
                        : (natNum<0 ? 
                            <span>{t("analytic.loadingfailed")}, <button type="button" className="link-button" onClick={()=>setNATLoading(true)}>{t("analytic.tryagain")}</button></span> 
                            :natNum
                          )
                        }
                    </p>
                </div>
                <div>
                    <h5>{t("analytic.accesslastmonth")}</h5>
                    <p>{nalLoading ? 
                        <BeatLoader color="#515AA9" />
                        : (nalNum<0 ? 
                            <span>{t("analytic.loadingfailed")}, <button type="button" className="link-button" onClick={()=>setNALLoading(true)}>{t("analytic.tryagain")}</button></span> 
                            :nalNum
                          )
                        }
                    </p>
                </div>
            </section>
            <section className="sec-analytic-result analytic-results-section analytic-rank-data">
                <h5>{t("analytic.topsearcheslastmonth")}</h5>
                <div className="analytic-rank-buttons">
                    {rslLoading ? 
                        <BeatLoader color="#515AA9" />
                        : (!Array.isArray(rankSL) ? 
                            <span>{t("analytic.loadingfailed")}, <button type="button" className="link-button" onClick={()=>setRSLLoading(true)}>{t("analytic.tryagain")}</button></span> 
                            :(rankSL.length===0?
                                <span>{t("analytic.norecord")}, <button type="button" className="link-button" onClick={()=>setRSLLoading(true)}>{t("analytic.tryagain")}</button></span> 
                                :rankSL.map((rank, ri) => <button type="button" key={ri} onClick={()=>handleView(`/?keyword=${rank.search===undefined?'':rank.search}&lang=${language}`)}>{ri+1}: {rank.search}</button>))
                          )
                    }
                </div>        
            </section>
            <section className="sec-analytic-result analytic-results-section analytic-rank-data">
                <h5>{t("analytic.topaccesslastmonth")}</h5>
                <div className="analytic-rank-list">
                {ralLoading ? 
                    <BeatLoader color="#515AA9" />
                    : (!Array.isArray(rankAL)? 
                        <span>{t("analytic.loadingfailed")}, <button type="button" className="link-button" onClick={()=>setRALLoading(true)}>{t("analytic.tryagain")}</button></span> 
                        :<div className="rank-list-box">
                            <div className="rank-list-header">
                                <div>{t("analytic.headerrank")}</div>
                                <div>{t("analytic.headertitle")}</div>
                                <div>{t("analytic.headertotal")}</div>
                            </div>
                        {rankAL.length===0?
                            <div><span>{t("analytic.norecord")}, <button type="button" className="link-button" onClick={()=>setRALLoading(true)}>{t("analytic.tryagain")}</button></span></div> 
                            :rankAL.map((rank, ri) => {
                                return (
                                <div key={ri} className="rank-list-data">
                                    <div>{ri+1}</div>
                                    <div><button type="button" className="btn link-button" onClick={()=>handleView(`/result?id=${rank.id}&lang=${language}`)}>{rank.title}</button></div>
                                    <div>{rank.acceses}</div>
                                </div>    
                                )    
                            })}
                        </div>    
                        )
                }
                </div> 
            </section>
            <section className="sec-analytic-result analytic-results-section analytic-rank-data">
                <h5>{t("analytic.topaccessalltime")}</h5>
                <div className="analytic-rank-list">
                {raaLoading ? 
                        <BeatLoader color="#515AA9" />
                        : (!Array.isArray(rankAA) ? 
                            <span>{t("analytic.loadingfailed")}, <button type="button" className="link-button" onClick={()=>setRAALoading(true)}>{t("analytic.tryagain")}</button></span> 
                           :<div className="rank-list-box">
                                <div className="rank-list-header">
                                    <div>{t("analytic.headerrank")}</div>
                                    <div>{t("analytic.headertitle")}</div>
                                    <div>{t("analytic.headertotal")}</div>
                                </div>
                           {rankAA.length===0?
                            <div><span>{t("analytic.norecord")}, <button type="button" className="link-button" onClick={()=>setRAALoading(true)}>{t("analytic.tryagain")}</button></span></div> 
                            :rankAA.map((rank, ri) => {
                                return (
                                    <div key={ri} className="rank-list-data">
                                        <div>{ri+1}</div>
                                        <div><button type="button" className="btn link-button"onClick={()=>handleView(`/result?id=${rank.id}&lang=${language}`)}>{rank.title}</button></div>
                                        <div>{rank.acceses}</div>
                                    </div>    
                                    )    
                                })}
                            </div>    
                          )
                    }
                </div> 
            </section>
            <section className="sec-analytic-result analytic-results-section analytic-rank-data">
                <h5>{t("analytic.topaccessbyorg")}</h5>
                <div className="analytic-rank-list">
                    <div className={`analytic-filters-setting ${language}`}>
                        <div className="analytic-filters-list">    
                            <button
                                className={filterbyshown ? 'advanced-filters-button link-button open' : 'advanced-filters-button link-button'}
                                disabled={raoLoading}
                                type="button"
                                onClick={!raoLoading ? () => setFilterbyshown(!filterbyshown) : undefined}
                                aria-expanded={filterbyshown ? 'true' : 'false'}
                            />
                            {orgSelected.length === 0 ?
                            <span>{t("analytic.selectorg")}</span>
                            :orgSelected.map((orgfilter: number) => (
                                <button
                                    key={`of-${orgfilter}`}
                                    type="button"
                                    className="btn btn-filter"
                                    disabled={raoLoading}
                                    onClick={!raoLoading?() => clearOrgFilter(orgfilter):undefined}
                                >
                                    {organisations[language][orgfilter]} <i className="fas fa-times" />
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            className="btn btn-button"
                            disabled={raoLoading}
                            onClick={!raoLoading?submitClick:undefined}
                        >
                            {t('analytic.submit')}
                        </button>
                        {filterbyshown && <SearchFilter
                            filtertitle=""
                            filtervalues={organisations[language]}
                            filterselected={orgSelected}
                            selectFilters={handleOrg}
                            singleselect={true}
                        />}
                    </div>    
                {raoLoading ? 
                        <BeatLoader color="#515AA9" />
                        : (!Array.isArray(rankAO) ? 
                            <span>{t("analytic.loadingfailed")}, <button type="button" className="link-button" onClick={()=>setRAOLoading(true)}>{t("analytic.tryagain")}</button></span> 
                           : raoLoading!==null && orgSelected.length > 0 &&
                            <div className="rank-list-box">
                                <div className="rank-list-header">
                                    <div>{t("analytic.headerrank")}</div>
                                    <div>{t("analytic.headertitle")}</div>
                                    <div>{t("analytic.headertotal")}</div>
                                </div>
                            {rankAO.length===0?
                                <div><span>{t("analytic.norecord")}, <button type="button" className="link-button" onClick={()=>setRAOLoading(true)}>{t("analytic.tryagain")}</button></span></div> 
                                :rankAO.map((rank, ri) => {
                                return (
                                    <div key={ri} className="rank-list-data">
                                        <div>{ri+1}</div>
                                        <div><button type="button" className="btn link-button"onClick={()=>handleView(`/result?id=${rank.id}&lang=${language}`)}>{rank.title}</button></div>
                                        <div>{rank.acceses}</div>
                                    </div>    
                                    )    
                                })}
                            </div>    
                          )
                    } 
                </div>
            </section>
            <section className="sec-analytic-errormsg  error-debug">
                    {Array.isArray(errMsg) && errMsg.map((err, ei)=>{
                        return <div key={ei}>{err}</div>
                    })}
            </section>
        </div>
    );
}

interface analyticProps {
    analyticOrg: number[];
    setAnalyticOrg: (ao: number[]) => void;
}
