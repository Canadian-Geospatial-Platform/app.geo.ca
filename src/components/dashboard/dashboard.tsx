/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { DeleteOutlined } from '@material-ui/icons';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import BeatLoader from 'react-spinners/BeatLoader';
import { DASHBOARD_CALLS, Get, Post } from '../../common/dashboard';

import '../analytic/analytic.scss';
import './dashboard.scss';

const Dashboard = () => {

    //#region Component state
    const { t } = useTranslation();
    const language = t('app.language');
    const [userID, setUserID] = useState("cf9bfa6f-5837-42f9-9eeb-c15035c3c752");

    //#region accouncements
    const [announcementLoading, setAnnouncementLoading] = useState(true);
    const [announcement, setAnnouncement] = useState("");
    //#endregion

    //#region mycommunity/accouncements
    const [communityAnnouncementLoading, setCommunityAnnouncementLoading] = useState(true);
    const [communityAnnouncement, setCommunityAnnouncement] = useState({});
    //#endregion


    //#region mycommunity/data
    const [communityDataLoading, setcommunityDataLoading] = useState(true);
    const [communityData, setCommunityData] = useState({});
    //#endregion


    //#region mycommunity/resources
    const [communityResourcesLoading, setCommunityResourcesLoading] = useState(true);
    const [communityResources, setCommunityResources] = useState({});
    //#endregion


    //#region Saved_records/get
    const [savedRecordsLoading, setSavedRecordsLoading] = useState(true);
    const [savedRecords, setSavedRecords] = useState([]);
    //#endregion

    //#region Saved_search/get
    const [savedSearchesLoading, setSavedSearchesLoading] = useState(true);
    const [savedSearches, setSavedSearches] = useState([]);
    //#endregion

    //#endregion

    //#region  Api Calls
    const getAnnouncement = () => {
        Get(DASHBOARD_CALLS.ANNOUNCEMENT,
            //announcementGetTemp(
            '',
            { lang: language, userId: userID },
            (responseData) => {
                let item = responseData.data.Items ? responseData.data.Items[0] : {};
                let announcement = "";
                if (item)
                    announcement = language === "fr" ? item.announcement_fr : item.announcement_en;
                setAnnouncement(announcement);
                setAnnouncementLoading(false);
            },
            (analyticErr) => {
                // setErrMsg(errMsg.push(JSON.stringify(analyticErr)));
                setAnnouncement("");
                setAnnouncementLoading(false);
            },
            () => {
                // setErrLoading(!nstLoading&&!nslLoading&&!nalLoading&&!natLoading&&!raaLoading&&!ralLoading&&!raoLoading&&!rslLoading);
            }
        );
    };

    const getCommunityAndSavedRecords = (dc: DASHBOARD_CALLS, url, loading, setData, isCallForArray = false) => {
        Get(dc,
            //announcementGetTemp(
            url,
            { lang: language, userId: userID },
            (responseData) => {
                let item = responseData.data.Items;
                if (!isCallForArray) {
                    item = responseData.data.Items ? responseData.data.Items[0] : {};
                }
                setData(item);
                loading(false);
            },
            (analyticErr) => {
                setData({});
                loading(false);
            },
            () => {
                // setErrLoading(!nstLoading&&!nslLoading&&!nalLoading&&!natLoading&&!raaLoading&&!ralLoading&&!raoLoading&&!rslLoading);
            }
        );
    };

    const deleteRecord = (dc: DASHBOARD_CALLS, url, key, loading) => {
        loading(true);
        Post(dc,
            //announcementGetTemp(
            url,
            { key: key, userId: userID },
            (responseData) => {
                loading(false);
                removeLocally(key, dc);
                // Remove item from local array
            },
            (analyticErr) => {
                loading(false);
            },
            () => {
                // setErrLoading(!nstLoading&&!nslLoading&&!nalLoading&&!natLoading&&!raaLoading&&!ralLoading&&!raoLoading&&!rslLoading);
            }
        );
    };

    const deleteSavedSearchItem = (key, dc) => {
        deleteRecord(dc, 'delete', key, dc === DASHBOARD_CALLS.SAVED_SEARCHES ? setSavedSearchesLoading : setSavedRecordsLoading);
    }

    const removeLocally = (key, dc) => {
        if (dc === DASHBOARD_CALLS.SAVED_SEARCHES)
            setSavedSearches(savedSearches.filter(item => item.key !== key));
        else
            setSavedRecords(savedRecords.filter(item => item.key !== key));
    }

    //#endregion

    //#region  Life Cycle Event
    useEffect(() => {
        if (announcementLoading)
            getAnnouncement();
    }, [announcementLoading]);

    useEffect(() => {
        if (savedRecordsLoading)
            getCommunityAndSavedRecords(DASHBOARD_CALLS.SAVED_RECORDS, 'get',
                setSavedRecordsLoading, setSavedRecords, true);
    }, [savedRecordsLoading]);

    useEffect(() => {
        if (communityAnnouncementLoading)
            getCommunityAndSavedRecords(DASHBOARD_CALLS.COMMUNITY, 'announcements',
                setCommunityAnnouncementLoading, setCommunityAnnouncement, false);
    }, [communityAnnouncementLoading]);

    useEffect(() => {
        if (communityDataLoading)
            getCommunityAndSavedRecords(DASHBOARD_CALLS.COMMUNITY, 'data',
                setcommunityDataLoading, setCommunityData, false);
    }, [communityDataLoading]);

    useEffect(() => {
        if (communityResourcesLoading)
            getCommunityAndSavedRecords(DASHBOARD_CALLS.COMMUNITY, 'resources',
                setCommunityResourcesLoading, setCommunityResources, false);
    }, [communityResourcesLoading]);

    useEffect(() => {
        if (savedSearchesLoading)
            getCommunityAndSavedRecords(DASHBOARD_CALLS.SAVED_SEARCHES, 'get',
                setSavedSearchesLoading, setSavedSearches, true);
    }, [communityResourcesLoading]);

    useEffect(() => {
        setAnnouncementLoading(true);
        setSavedRecordsLoading(true);
        setSavedSearchesLoading(true);
        setCommunityAnnouncementLoading(true);
        setcommunityDataLoading(true);
        setCommunityResourcesLoading(true);
    }, [language]);

    //#endregion

    return (
        <div className="analytics-container">
            <section className="sec-analytics-results sec-analytics-results-summary">
                <div className="sec-inner-wrap">
                    <h2 className="sec-title no-margin"> {t('dashboard.announcements')}
                    </h2>
                    <div className="sec-inner-wrap no-margin" >
                        <div className="card-wrap">
                            <h4 className="summary-card-title">
                                {t('dashboard.announcementTitle')}
                            </h4>
                        </div>
                        <div className="card-wrap">
                            {announcementLoading ? (
                                <BeatLoader color="#ffffff" />
                            ) : announcement === "" ? (
                                <div className="loading-failed">
                                    {t('dashboard.loadingfailed')},{' '}
                                    <button type="button" className="link-button" onClick={() => setAnnouncementLoading(true)}>
                                        {t('analytic.tryagain')}
                                    </button>
                                </div>
                            ) : (
                                <div >

                                    {announcement}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <section className="sec-analytics-results sec-analytics-results-summary">
                <div className="sec-inner-wrap">
                    <h2 className="sec-title no-margin"> {t('dashboard.latestCommunityAnnouncement')}
                    </h2>
                    <div className="sec-inner-wrap no-margin" >
                        <div className="card-wrap">
                            <h4 className="summary-card-title">
                            </h4>
                        </div>
                        <div className="card-wrap">
                            {communityAnnouncementLoading ? (
                                <BeatLoader color="#ffffff" />
                            ) : !communityAnnouncement ? (
                                <div className="loading-failed">
                                    {t('dashboard.loadingfailed')},{' '}
                                    <button type="button" className="link-button" onClick={() => setCommunityAnnouncementLoading(true)}>
                                        {t('analytic.tryagain')}
                                    </button>
                                </div>
                            ) : (
                                <div >

                                    {communityAnnouncement["announcement_" + language]}
                                </div>
                            )}
                        </div>

                        <div className="card-wrap">
                            <div className="width-50-per text-left">
                                {t('dashboard.communityTitle')}: {communityAnnouncement["community_" + language]}
                            </div>
                            <div className="width-50-per text-right">
                                <a href='#' className='color-light'>Go to Community</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="sec-analytics-results sec-analytics-results-summary">
                <div className="sec-inner-wrap">
                    <h2 className="sec-title no-margin"> {t('dashboard.latestCommunityData')}
                    </h2>
                    <div className="sec-inner-wrap no-margin" >
                        <div className="card-wrap">
                            <h4 className="summary-card-title">
                                {communityData ? communityData["title_" + language] : ""}
                            </h4>
                        </div>
                        <div className="card-wrap">
                            {communityDataLoading ? (
                                <BeatLoader color="#ffffff" />
                            ) : !communityData ? (
                                <div className="loading-failed">
                                    {t('dashboard.loadingfailed')},{' '}
                                    <button type="button" className="link-button" onClick={() => setcommunityDataLoading(true)}>
                                        {t('analytic.tryagain')}
                                    </button>
                                </div>
                            ) : (
                                <div >

                                    {communityData ? communityData["description_" + language] : ""}
                                </div>
                            )}
                        </div>


                        <div className="card-wrap">
                            <div className="width-50-per text-left">
                                {t('dashboard.communityTitle')}: {t('dashboard.communityName')}
                            </div>
                            <div className="width-50-per text-right">
                                <a href={communityData.uuid !== undefined ? "/result?id=" + communityData.uuid + "&lang=" + language : "#"} className='color-light'>Go to Record</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="sec-analytics-results sec-analytics-results-summary">
                <div className="sec-inner-wrap">
                    <h2 className="sec-title no-margin"> {t('dashboard.latestCommunityResources')}
                    </h2>
                    <div className="sec-inner-wrap no-margin" >
                        <div className="card-wrap">
                            <h4 className="summary-card-title">
                                {communityResources ? communityResources["resource_title"] : ""}
                            </h4>
                        </div>
                        <div className="card-wrap">
                            {communityResourcesLoading ? (
                                <BeatLoader color="#ffffff" />
                            ) : !communityResources ? (
                                <div className="loading-failed">
                                    {t('dashboard.loadingfailed')},{' '}
                                    <button type="button" className="link-button" onClick={() => setCommunityResourcesLoading(true)}>
                                        {t('analytic.tryagain')}
                                    </button>
                                </div>
                            ) : (
                                <div >

                                    {communityResources ? communityResources["resource_description"] : ""}
                                </div>
                            )}
                        </div>

                        <div className="card-wrap">
                            <div className="width-50-per text-left">
                                {t('dashboard.communityTitle')}: {communityResources ? communityResources["community_" + language] : ""}
                            </div>
                            <div className="width-50-per text-right">
                                <a href='#' className='color-light'>Go to Resource</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="sec-analytics-results sec-analytics-results-summary">
                <div className="sec-inner-wrap">
                    <div className="sec-inner-wrap no-margin no-border">
                        <div className="card-wrap">
                            <div className="width-50-per">
                                <div className="sec-inner-wrap no-margin" >
                                    <div className="card-wrap">
                                        <h4 className="summary-card-title">
                                            {t('dashboard.savedSearches')}
                                        </h4>
                                    </div>
                                    <div className="card-wrap">
                                        {savedSearchesLoading ? (
                                            <BeatLoader color="#ffffff" />
                                        ) : !savedSearches ? (
                                            <div className="loading-failed">
                                                {t('dashboard.loadingfailed')},{' '}
                                                <button type="button" className="link-button" onClick={() => setSavedSearchesLoading(true)}>
                                                    {t('analytic.tryagain')}
                                                </button>
                                            </div>
                                        ) : (
                                            <div >
                                                <table className="anayltics-table table caption-top">
                                                    <tbody>
                                                        {
                                                            savedSearches.map(q => {
                                                                return <tr key={q.key} className="table-row table-row-no-record" style={{ textAlign: 'left' }}>
                                                                    <td className="table-cell">{q.search}</td>
                                                                    <td className="table-cell" style={{ cursor: 'pointer' }} onClick={() => { deleteSavedSearchItem(q.key, DASHBOARD_CALLS.SAVED_SEARCHES) }} >{<DeleteOutlined />}</td>
                                                                </tr>
                                                                //return <li > {q.search} </li>
                                                            })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="width-50-per">
                                <div className="sec-inner-wrap no-margin" >
                                    <div className="card-wrap">
                                        <h4 className="summary-card-title">
                                            {t('dashboard.savedRecords')}
                                        </h4>
                                    </div>
                                    <div className="card-wrap">
                                        {savedRecordsLoading ? (
                                            <BeatLoader color="#ffffff" />
                                        ) : !savedRecords ? (
                                            <div className="loading-failed">
                                                {t('dashboard.loadingfailed')},{' '}
                                                <button type="button" className="link-button" onClick={() => setsavedRecordsLoading(true)}>
                                                    {t('analytic.tryagain')}
                                                </button>
                                            </div>
                                        ) : (
                                            <div >
                                                <table className="anayltics-table table caption-top">
                                                    <tbody>
                                                        {
                                                            savedRecords.map(q => {
                                                                return <tr key={q.key} className="table-row table-row-no-record" style={{ textAlign: 'left' }}>
                                                                    <td className="table-cell">{q["title_" + language]}</td>
                                                                    <td className="table-cell" style={{ cursor: 'pointer' }} onClick={() => { deleteSavedSearchItem(q.key, DASHBOARD_CALLS.SAVED_RECORDS) }} >{<DeleteOutlined />}</td>
                                                                </tr>
                                                                //return <li > {q.search} </li>
                                                            })}
                                                    </tbody>
                                                </table>
                                            </div>

                                        )}



                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Dashboard;
