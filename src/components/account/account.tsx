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

import '../analytic/analytic.scss';
import './account.scss';

const Account = () => {
    const { t } = useTranslation();
    return (
        <div className="analytics-container">
            <section className="sec-analytics-results sec-analytics-results-summary">
                <div className="sec-inner-wrap">
                    <h2 className="sec-title no-margin"> {t('account.announcements')}
                    </h2>
                    <div className="sec-inner-wrap no-margin" >
                        <div className="card-wrap">
                            <h4 className="summary-card-title">
                                {t('account.announcementTitle')}
                            </h4>
                        </div>
                        <div className="card-wrap">
                            {/* {nstLoading ? (
                                    <BeatLoader color="#ffffff" />
                                ) : nstNum < 0 ? (
                                    <div className="loading-failed">
                                        {t('analytic.loadingfailed')},{' '}
                                        <button type="button" className="link-button" onClick={() => setNSTLoading(true)}>
                                            {t('analytic.tryagain')}
                                        </button>
                                    </div>
                                ) : ( */}
                            <div >
                                {/* {nstNum} */}
                                {t('account.announcementDesc')}
                            </div>
                            {/* )} */}
                        </div>
                    </div>
                </div>
            </section>
            <section className="sec-analytics-results sec-analytics-results-summary">
                <div className="sec-inner-wrap">
                    <h2 className="sec-title no-margin"> {t('account.latestCommunityAnnouncement')}
                    </h2>
                    <div className="sec-inner-wrap no-margin" >
                        <div className="card-wrap">
                            <h4 className="summary-card-title">
                                {t('account.latestCommunityAnnouncementTitle')}
                            </h4>
                        </div>
                        <div className="card-wrap">
                            {/* {nstLoading ? (
                                    <BeatLoader color="#ffffff" />
                                ) : nstNum < 0 ? (
                                    <div className="loading-failed">
                                        {t('analytic.loadingfailed')},{' '}
                                        <button type="button" className="link-button" onClick={() => setNSTLoading(true)}>
                                            {t('analytic.tryagain')}
                                        </button>
                                    </div>
                                ) : ( */}
                            <div >
                                {/* {nstNum} */}
                                {t('account.latestCommunityAnnouncementDesc')}
                            </div>
                            {/* )} */}
                        </div>

                        <div className="card-wrap">
                            <div className="width-50-per text-left padding-left-15">
                                {t('account.communityTitle')}: {t('account.communityName')}
                            </div>
                            <div className="width-50-per text-right padding-right-15">
                                <a href='#' className='color-light'>Go to Community</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="sec-analytics-results sec-analytics-results-summary">
                <div className="sec-inner-wrap">
                    <h2 className="sec-title no-margin"> {t('account.latestCommunityData')}
                    </h2>
                    <div className="sec-inner-wrap no-margin" >
                        <div className="card-wrap">
                            <h4 className="summary-card-title">
                                {t('account.dataTitle')}
                            </h4>
                        </div>
                        <div className="card-wrap">
                            {/* {nstLoading ? (
                                    <BeatLoader color="#ffffff" />
                                ) : nstNum < 0 ? (
                                    <div className="loading-failed">
                                        {t('analytic.loadingfailed')},{' '}
                                        <button type="button" className="link-button" onClick={() => setNSTLoading(true)}>
                                            {t('analytic.tryagain')}
                                        </button>
                                    </div>
                                ) : ( */}
                            <div >
                                {/* {nstNum} */}
                                {t('account.dataDescription')}
                            </div>
                            {/* )} */}
                        </div>

                        <div className="card-wrap">
                            <div className="width-50-per text-left padding-left-15">
                                {t('account.communityTitle')}: {t('account.communityName')}
                            </div>
                            <div className="width-50-per text-right padding-right-15">
                                <a href='#' className='color-light'>Go to Record</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="sec-analytics-results sec-analytics-results-summary">
                <div className="sec-inner-wrap">
                    <h2 className="sec-title no-margin"> {t('account.latestCommunityResources')}
                    </h2>
                    <div className="sec-inner-wrap no-margin" >
                        <div className="card-wrap">
                            <h4 className="summary-card-title">
                                {t('account.dataTitle')}
                            </h4>
                        </div>
                        <div className="card-wrap">
                            {/* {nstLoading ? (
                                    <BeatLoader color="#ffffff" />
                                ) : nstNum < 0 ? (
                                    <div className="loading-failed">
                                        {t('analytic.loadingfailed')},{' '}
                                        <button type="button" className="link-button" onClick={() => setNSTLoading(true)}>
                                            {t('analytic.tryagain')}
                                        </button>
                                    </div>
                                ) : ( */}
                            <div >
                                {/* {nstNum} */}
                                {t('account.dataDescription')}
                            </div>
                            {/* )} */}
                        </div>

                        <div className="card-wrap">
                            <div className="width-50-per text-left padding-left-15">
                                {t('account.communityTitle')}: {t('account.communityName')}
                            </div>
                            <div className="width-50-per text-right padding-right-15">
                                <a href='#' className='color-light'>Go to Record</a>
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
                                            {t('account.savedSearches')}
                                        </h4>
                                    </div>
                                    <div className="card-wrap">
                                        <div >
                                            {/* {nstNum} */}
                                            {t('account.resourceDescription')}
                                        </div>
                                        {/* )} */}
                                    </div>
                                </div>
                            </div>
                            <div className="width-50-per">
                                <div className="sec-inner-wrap no-margin" >
                                    <div className="card-wrap">
                                        <h4 className="summary-card-title">
                                            {t('account.savedRecords')}
                                        </h4>
                                    </div>
                                    <div className="card-wrap">
                                        <div >
                                            {/* {nstNum} */}
                                            {t('account.resourceDescription')}
                                        </div>
                                        {/* )} */}
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

export default Account;
