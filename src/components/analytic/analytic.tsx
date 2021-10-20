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
    const [raoLoading, setRAOLoading] = useState(orgSelected.length>0);
    const [rankSL, setRANKSL] = useState([]);
    const [rankAL, setRANKAL] = useState([]);
    const [rankAA, setRANKAA] = useState([]);
    const [rankAO, setRANKAO] = useState([]);
    
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
              setRANKSL(null);
              setRSLLoading(false);
           }
        );
    }
    const getRAL = () => {
        analyticGet(
            '4', 
            {},
            (analyticRes) => {
                setRANKAL(analyticRes.data);
                setRALLoading(false);
            },
            (analyticErr) => {
              // console.log(analyticErr); 
              setRANKAL(null);
              setRALLoading(false);
           }
        );
    }
    const getRAA = () => {
        analyticGet(
            '5', 
            {},
            (analyticRes) => {
                setRANKAA(analyticRes.data);
                setRAALoading(false);
            },
            (analyticErr) => {
              // console.log(analyticErr); 
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
                        : (rankSL===null ? 
                            <span>{t("analytic.loadingfailed")}, <button type="button" className="link-button" onClick={()=>setRSLLoading(true)}>{t("analytic.tryagain")}</button></span> 
                            :rankSL.map((rank, ri) => <button type="button" key={ri}>{ri+1}</button>)
                          )
                    }
                </div>        
            </section>
            <section className="sec-analytic-result analytic-results-section analytic-rank-data">
                <h5>{t("analytic.topaccesslastmonth")}</h5>
                <div className="analytic-rank-list">
                {ralLoading ? 
                    <BeatLoader color="#515AA9" />
                    : (rankAL === null ? 
                        <span>{t("analytic.loadingfailed")}, <button type="button" className="link-button" onClick={()=>setRALLoading(true)}>{t("analytic.tryagain")}</button></span> 
                        :<div className="rank-list-box">
                            <div className="rank-list-header">
                                <div>{t("analytic.headerrank")}</div>
                                <div>{t("analytic.headertitle")}</div>
                                <div>{t("analytic.headertotal")}</div>
                            </div>
                            {Array.isArray(rankAL) && rankAL.map((rank, ri) => {
                            return (
                                <div key={ri} className="rank-list-data">
                                    <div>{ri+1}</div>
                                    <div>{rank.title}</div>
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
                        : (rankAA === null ? 
                            <span>{t("analytic.loadingfailed")}, <button type="button" className="link-button" onClick={()=>setRAALoading(true)}>{t("analytic.tryagain")}</button></span> 
                           :<div className="rank-list-box">
                                <div className="rank-list-header">
                                    <div>{t("analytic.headerrank")}</div>
                                    <div>{t("analytic.headertitle")}</div>
                                    <div>{t("analytic.headertotal")}</div>
                                </div>
                                {Array.isArray(rankAA) && rankAA.map((rank, ri) => {
                                return (
                                    <div key={ri} className="rank-list-data">
                                        <div>{ri+1}</div>
                                        <div>{rank.title}</div>
                                        <div>{rank.accesses}</div>
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
                    <div className="analytic-filters-setting">
                        <div className="analytic-filters-list">    
                            {orgSelected.map((orgfilter: number) => (
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
                            <button
                                className={filterbyshown ? 'advanced-filters-button link-button open' : 'advanced-filters-button link-button'}
                                disabled={raoLoading}
                                type="button"
                                onClick={!raoLoading ? () => setFilterbyshown(!filterbyshown) : undefined}
                                aria-expanded={filterbyshown ? 'true' : 'false'}
                            />
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
                        />}
                    </div>    
                {raoLoading ? 
                        <BeatLoader color="#515AA9" />
                        : (rankAO === null ? 
                            <span>{t("analytic.loadingfailed")}, <button type="button" className="link-button" onClick={()=>setRAOLoading(true)}>{t("analytic.tryagain")}</button></span> 
                           :<div className="rank-list-box">
                                <div className="rank-list-header">
                                    <div>{t("analytic.headerrank")}</div>
                                    <div>{t("analytic.headertitle")}</div>
                                    <div>{t("analytic.headertotal")}</div>
                                </div>
                                {Array.isArray(rankAO) && rankAO.map((rank, ri) => {
                                return (
                                    <div key={ri} className="rank-list-data">
                                        <div>{ri+1}</div>
                                        <div>{rank.title}</div>
                                        <div>{rank.acceses}</div>
                                    </div>    
                                    )    
                                })}
                            </div>    
                          )
                    }
                </div>
            </section>
        </div>
    );
}

interface analyticProps {
    analyticOrg: number[];
    setAnalyticOrg: (ao: number[]) => void;
}
