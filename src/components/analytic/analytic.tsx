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
import { analyticGet } from '../../common/analytic';
import SearchFilter from '../searchfilter/searchfilter';
import organisations from '../search/organisations.json';

import './analytic.scss';

export default function Analytic(props: analyticProps): JSX.Element {
    const { analyticOrg, setAnalyticOrg } = props;
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
    const [raoLoading, setRAOLoading] = useState(orgSelected > -1 ? true : null);
    const [rankSL, setRANKSL] = useState([]);
    const [rankAL, setRANKAL] = useState([]);
    const [rankAA, setRANKAA] = useState([]);
    const [rankAO, setRANKAO] = useState([]);
    // const [errMsg, setErrMsg] = useState([]);
    // const [errLoading, setErrLoading] = useState(true);

    const { t } = useTranslation();
    const language = t('app.language');

    const getNST = () => {
        // setErrLoading(false);
        analyticGet(
            '2',
            {},
            (analyticRes) => {
                setNSTNUM(analyticRes.data.Items[0].searches);
                setNSTLoading(false);
            },
            (analyticErr) => {
                // console.log(analyticErr);
                // setErrMsg(errMsg.push(JSON.stringify(analyticErr)));
                setNSTNUM(-1);
                setNSTLoading(false);
                // setErrLoading(!nstLoading&&!nslLoading&&!nalLoading&&!natLoading&&!raaLoading&&!ralLoading&&!raoLoading&&!rslLoading);
            }
        );
    };

    const getNSL = () => {
        // setErrLoading(false);
        analyticGet(
            '6',
            {},
            (analyticRes) => {
                setNSLNUM(analyticRes.data.Items[0].searches);
                setNSLLoading(false);
            },
            (analyticErr) => {
                // console.log(analyticErr);
                // setErrMsg(errMsg.push(JSON.stringify(analyticErr)));
                setNSLNUM(-1);
                setNSLLoading(false);
            },
            ()=>{
                // setErrLoading(!nstLoading&&!nslLoading&&!nalLoading&&!natLoading&&!raaLoading&&!ralLoading&&!raoLoading&&!rslLoading);
            }
        );
    };

    const getNAT = () => {
        // setErrLoading(false);
        analyticGet(
            '3',
            {},
            (analyticRes) => {
                setNATNUM(analyticRes.data.Items[0].accesses);
                setNATLoading(false);
            },
            (analyticErr) => {
                // console.log(analyticErr);
                // setErrMsg(errMsg.push(JSON.stringify(analyticErr)));
                setNATNUM(-1);
                setNATLoading(false);
            },
            ()=>{
                // setErrLoading(!nstLoading&&!nslLoading&&!nalLoading&&!natLoading&&!raaLoading&&!ralLoading&&!raoLoading&&!rslLoading);
            }
        );
    };

    const getNAL = () => {
        // setErrLoading(false);
        analyticGet(
            '7',
            {},
            (analyticRes) => {
                setNALNUM(analyticRes.data.Items[0].accesses);
                setNALLoading(false);
            },
            (analyticErr) => {
                // console.log(analyticErr);
                // setErrMsg(errMsg.push(JSON.stringify(analyticErr)));
                setNALNUM(-1);
                setNALLoading(false);
            },
            ()=>{
                // setErrLoading(!nstLoading&&!nslLoading&&!nalLoading&&!natLoading&&!raaLoading&&!ralLoading&&!raoLoading&&!rslLoading);
            }
        );
    };

    const getRSL = () => {
        // setErrLoading(false);
        analyticGet(
            '1',
            {},
            (analyticRes) => {
                setRANKSL(Array.isArray(analyticRes.data.Items)?analyticRes.data.Items:[]);
                setRSLLoading(false);
            },
            (analyticErr) => {
                // console.log(analyticErr);
                // setErrMsg(errMsg.push(JSON.stringify(analyticErr)));
                setRANKSL(null);
                setRSLLoading(false);
            },
            ()=>{
                // setErrLoading(!nstLoading&&!nslLoading&&!nalLoading&&!natLoading&&!raaLoading&&!ralLoading&&!raoLoading&&!rslLoading);
            }
        );
    };
    const getRAL = () => {
        // setErrLoading(false);
        analyticGet(
            '4',
            { lang: language },
            (analyticRes) => {
                setRANKAL(Array.isArray(analyticRes.data)?analyticRes.data:[]);
                setRALLoading(false);
            },
            (analyticErr) => {
                // console.log(analyticErr);
                // setErrMsg(errMsg.push(JSON.stringify(analyticErr)));
                setRANKAL(null);
                setRALLoading(false);
            },
            ()=>{
                // setErrLoading(!nstLoading&&!nslLoading&&!nalLoading&&!natLoading&&!raaLoading&&!ralLoading&&!raoLoading&&!rslLoading);
            }
        );
    };
    const getRAA = () => {
        // setErrLoading(false);
        analyticGet(
            '5',
            { lang: language },
            (analyticRes) => {
                setRANKAA(Array.isArray(analyticRes.data)?analyticRes.data:[]);
                setRAALoading(false);
            },
            (analyticErr) => {
                // console.log(analyticErr);
                // setErrMsg(errMsg.push(JSON.stringify(analyticErr)));
                setRANKAA(null);
                setRAALoading(false);
            },
            ()=>{
                // setErrLoading(!nstLoading&&!nslLoading&&!nalLoading&&!natLoading&&!raaLoading&&!ralLoading&&!raoLoading&&!rslLoading);
            }
        );
    };
    const getRAO = () => {
        // setErrLoading(false);
        analyticGet(
            '9',
            {
                lang: language,
                // org: JSON.stringify(orgSelected.map((fs: number) => organisations[language][fs].toLowerCase().replace(/\'/g, "''"))),
                org: organisations[language][orgSelected].toLowerCase().replace(/\'/g, "''"),
            },
            (analyticRes) => {
                setRANKAO(Array.isArray(analyticRes.data)?analyticRes.data:[]);
                setRAOLoading(false);
            },
            (analyticErr) => {
                // console.log(analyticErr);
                // setErrMsg(errMsg.push(JSON.stringify(analyticErr)));
                setRANKAO(null);
                setRAOLoading(false);
            }
        );
    };

    const handleOrg = (filters: number[]): void => {
        // setFReset(true);
        setOrg(filters.length>0?filters[0]:-1);
    };
    const clearOrgFilter = (filter: number) => {
        // const newfilter = orgSelected.filter((fs: number) => fs !== filter);
        setOrg(-1);
        // setPageNumber(1);
    };

    const submitClick = () => {
        setFilterbyshown(false);
        setRAOLoading(true);
        setAnalyticOrg(orgSelected);
    };

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
        if (orgSelected.length > 0) {
            setRAOLoading(true);
        }
    }, [language]);

    return (
        <div className="analytics-container">
            <section className="sec-analytics-results sec-analytics-results-summary">
                <div className="sec-inner-wrap">
                    <h2 className="sec-title">{t('analytic.summary')}</h2>
                    <div className="card-wrap">
                        <div className="analytics-summary-card">
                            <h3 className="summary-card-title">{t('analytic.searchthismonth')}</h3>
                            <div className="summary-card-body">
                                {nstLoading ? (
                                    <BeatLoader color="#ffffff" />
                                ) : nstNum < 0 ? (
                                    <div className="loading-failed">
                                        {t('analytic.loadingfailed')},{' '}
                                        <button type="button" className="link-button" onClick={() => setNSTLoading(true)}>
                                            {t('analytic.tryagain')}
                                        </button>
                                    </div>
                                ) : (
                                    <p className="summary-card-num">{nstNum}</p>
                                )}
                            </div>
                        </div>
                        <div className="analytics-summary-card">
                            <h3 className="summary-card-title">{t('analytic.searchlastmonth')}</h3>
                            <div className="summary-card-body">
                                {nslLoading ? (
                                    <BeatLoader color="#ffffff" />
                                ) : nslNum < 0 ? (
                                    <div className="loading-failed">
                                        {t('analytic.loadingfailed')},{' '}
                                        <button type="button" className="link-button" onClick={() => setNSLLoading(true)}>
                                            {t('analytic.tryagain')}
                                        </button>
                                    </div>
                                ) : (
                                    <p className="summary-card-num">{nslNum}</p>
                                )}
                            </div>
                        </div>
                        <div className="analytics-summary-card">
                            <h3 className="summary-card-title">{t('analytic.accessthismonth')}</h3>
                            <div className="summary-card-body">
                                {natLoading ? (
                                    <BeatLoader color="#ffffff" />
                                ) : natNum < 0 ? (
                                    <div className="loading-failed">
                                        {t('analytic.loadingfailed')},{' '}
                                        <button type="button" className="link-button" onClick={() => setNATLoading(true)}>
                                            {t('analytic.tryagain')}
                                        </button>
                                    </div>
                                ) : (
                                    <p className="summary-card-num">{natNum}</p>
                                )}
                            </div>
                        </div>
                        <div className="analytics-summary-card">
                            <h3 className="summary-card-title">{t('analytic.accesslastmonth')}</h3>
                            <div className="summary-card-body">
                                {nalLoading ? (
                                    <BeatLoader color="#ffffff" />
                                ) : nalNum < 0 ? (
                                    <div className="loading-failed">
                                        {t('analytic.loadingfailed')},{' '}
                                        <button type="button" className="link-button" onClick={() => setNALLoading(true)}>
                                            {t('analytic.tryagain')}
                                        </button>
                                    </div>
                                ) : (
                                    <p className="summary-card-num">{nalNum}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="sec-analytics-results sec-analytics-results-tag-cloud">
                <div className="sec-inner-wrap">
                    <h2 className="sec-title">{t('analytic.topsearcheslastmonth')}</h2>
                    <div className="sec-buttons">
                        {rslLoading ? (
                            <BeatLoader color="#ffffff" />
                        ) : !Array.isArray(rankSL) ? (
                            <div className="loading-failed">
                                {t('analytic.loadingfailed')},{' '}
                                <button type="button" className="link-button" onClick={() => setRSLLoading(true)}>
                                    {t('analytic.tryagain')}
                                </button>
                            </div>
                        ) : rankSL.length === 0 ? (
                            <div className="no-record">
                                {t('analytic.norecord')},{' '}
                                <button type="button" className="link-button" onClick={() => setRSLLoading(true)}>
                                    {t('analytic.tryagain')}
                                </button>
                            </div>
                        ) : (
                            rankSL.map((rank, ri) => (
                                <button
                                    type="button"
                                    className="btn"
                                    key={ri}
                                    onClick={() => handleView(`/?keyword=${rank.search === undefined ? '' : rank.search}&lang=${language}`)}
                                >
                                    {rank.search}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </section>
            <section className="sec-analytics-results sec-analytics-results-table sec-analytics-results-search-last-month">
                <div className="sec-inner-wrap">
                    <h2 className="sec-title">{t('analytic.topaccesslastmonth')}</h2>

                    {ralLoading ? (
                        <BeatLoader color="#ffffff" />
                    ) : !Array.isArray(rankAL) ? (
                        <div className="loading-failed">
                            {t('analytic.loadingfailed')},{' '}
                            <button type="button" className="link-button" onClick={() => setRALLoading(true)}>
                                {t('analytic.tryagain')}
                            </button>
                        </div>
                    ) : (
                        <table className="anayltics-table table caption-top">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-cell-heading table-cell-heading-rank">{t('analytic.headerrank')}</th>
                                    <th className="table-cell-heading table-cell-heading-title">{t('analytic.headertitle')}</th>
                                    <th className="table-cell-heading table-cell-heading-total">{t('analytic.headertotal')}</th>
                                </tr>
                            </thead>
                            <tbody className="anayltics-table-body">
                                {rankAL.length === 0 ? (
                                    <tr className="table-row table-row-no-record">
                                        <td className="table-cell" colSpan={3}>
                                            {t('analytic.norecord')},{' '}
                                            <button type="button" className="link-button" onClick={() => setRALLoading(true)}>
                                                {t('analytic.tryagain')}
                                            </button>
                                        </td>
                                    </tr>
                                ) : (
                                    rankAL.map((rank, ri) => {
                                        return (
                                            <tr key={ri} className="table-row table-row-link">
                                                <td className="table-cell-data">{ri + 1}</td>
                                                <td className="table-cell-data">
                                                    <button
                                                        type="button"
                                                        className="btn link-button table-cell-link"
                                                        onClick={() => handleView(`/result?id=${rank.id}&lang=${language}`)}
                                                    >
                                                        {rank.title}
                                                    </button>
                                                </td>
                                                <td className="table-cell-data">{rank.accesses}</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>
            <section className="sec-analytics-results sec-analytics-results-table sec-analytics-results-top-access-all-time">
                <div className="sec-inner-wrap">
                    <h2 className="sec-title">{t('analytic.topaccessalltime')}</h2>
                    {raaLoading ? (
                        <BeatLoader color="#ffffff" />
                    ) : !Array.isArray(rankAA) ? (
                        <span>
                            {t('analytic.loadingfailed')},{' '}
                            <button type="button" className="link-button" onClick={() => setRAALoading(true)}>
                                {t('analytic.tryagain')}
                            </button>
                        </span>
                    ) : (
                        <table className="anayltics-table table caption-top">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-cell-heading table-cell-heading-rank">{t('analytic.headerrank')}</th>
                                    <th className="table-cell-heading table-cell-heading-title">{t('analytic.headertitle')}</th>
                                    <th className="table-cell-heading table-cell-heading-total">{t('analytic.headertotal')}</th>
                                </tr>
                            </thead>
                            <tbody className="anayltics-table-body">
                                {rankAA.length === 0 ? (
                                    <tr className="table-row table-row-no-record">
                                        <td className="table-cell" colSpan={3}>
                                            {t('analytic.norecord')},{' '}
                                            <button type="button" className="link-button" onClick={() => setRAALoading(true)}>
                                                {t('analytic.tryagain')}
                                            </button>
                                        </td>
                                    </tr>
                                ) : (
                                    rankAA.map((rank, ri) => {
                                        return (
                                            <tr key={ri} className="table-row table-row-link">
                                                <td className="table-cell-data">{ri + 1}</td>
                                                <td className="table-cell-data">
                                                    <button
                                                        type="button"
                                                        className="btn link-button table-cell-link"
                                                        onClick={() => handleView(`/result?id=${rank.id}&lang=${language}`)}
                                                    >
                                                        {rank.title}
                                                    </button>
                                                </td>
                                                <td className="table-cell-data">{rank.acceses}</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>
            <section className="sec-analytics-results sec-analytics-results-table sec-analytics-results-top-access-by-org">
                <div className="sec-inner-wrap">
                    <h2 className="sec-title">{t('analytic.topaccessbyorg')}</h2>

                    <div className={`analytic-filters-setting ${language}`}>
                        <div className="analytic-filters-wrap">
                            <div className="analytic-filters-list">
                                <button
                                    id="handle-filters-list"
                                    className={
                                        filterbyshown ? 'advanced-filters-button link-button open' : 'advanced-filters-button link-button'
                                    }
                                    disabled={raoLoading}
                                    type="button"
                                    onClick={!raoLoading ? () => setFilterbyshown(!filterbyshown) : undefined}
                                    aria-expanded={filterbyshown ? 'true' : 'false'}
                                />
                                {orgSelected === -1 ? (
                                    <span className="advanced-filters-button-label">{t('analytic.selectorg')}</span>
                                ) : (
                                    <button
                                        type="button"
                                        className="btn btn-filter advanced-filters-button-filter"
                                        disabled={raoLoading}
                                        onClick={!raoLoading ? () => clearOrgFilter(orgSelected) : undefined}
                                    >
                                        {organisations[language][orgSelected]} <i className="fas fa-times" />
                                    </button>
                                )}
                            </div>
                            <div className="analytic-filters-list-submit">
                                <button
                                    type="button"
                                    className="btn advanced-filters-button-submit"
                                    disabled={orgSelected === -1 || raoLoading}
                                    onClick={!raoLoading && orgSelected > -1 ? submitClick : undefined}
                                >
                                    {t('analytic.submit')}
                                </button>
                            </div>
                        </div>

                        {filterbyshown && (
                            <SearchFilter
                                filtertitle=""
                                filtervalues={organisations[language]}
                                filterselected={[orgSelected]}
                                selectFilters={handleOrg}
                                singleselect
                            />
                        )}
                    </div>
                    {raoLoading ? (
                        <BeatLoader color="#ffffff" />
                    ) : !Array.isArray(rankAO) ? (
                        <span>
                            {t('analytic.loadingfailed')},{' '}
                            <button type="button" className="link-button" onClick={() => setRAOLoading(true)}>
                                {t('analytic.tryagain')}
                            </button>
                        </span>
                    ) : (
                        raoLoading !== null &&
                        orgSelected > -1 && (
                            <table className="anayltics-table table caption-top">
                                <thead className="table-header">
                                    <tr className="table-row">
                                        <th className="table-cell-heading table-cell-heading-rank">{t('analytic.headerrank')}</th>
                                        <th className="table-cell-heading table-cell-heading-title">{t('analytic.headertitle')}</th>
                                        <th className="table-cell-heading table-cell-heading-total">{t('analytic.headertotal')}</th>
                                    </tr>
                                </thead>
                                <tbody className="anayltics-table-body">
                                    {rankAO.length === 0 ? (
                                        <tr className="table-row table-row-no-record">
                                            <td className="table-cell" colSpan={3}>
                                                {t('analytic.norecord')},{' '}
                                                <button type="button" className="link-button" onClick={() => setRAOLoading(true)}>
                                                    {t('analytic.tryagain')}
                                                </button>
                                            </td>
                                        </tr>
                                    ) : (
                                        rankAO.map((rank, ri) => {
                                            return (
                                                <tr key={ri} className="table-row table-row-link">
                                                    <td className="table-cell-data">{ri + 1}</td>
                                                    <td className="table-cell-data">
                                                        <button
                                                            type="button"
                                                            className="btn link-button table-cell-link"
                                                            onClick={() => handleView(`/result?id=${rank.id}&lang=${language}`)}
                                                        >
                                                            {rank.title}
                                                        </button>
                                                    </td>
                                                    <td className="table-cell-data">{rank.acceses}</td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        )
                    )}
                </div>
            </section>
            {/* {errLoading && 
            <section className="sec-analytic-errormsg error-debug">
                {Array.isArray(errMsg) && errMsg.map((err, ei)=>{
                    return <div key={ei}>{err}</div>
                })}
            </section>
            } */}
        </div>
    );
}

interface analyticProps {
    analyticOrg: number;
    setAnalyticOrg: (ao: number) => void;
}
