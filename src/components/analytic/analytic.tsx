/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import BeatLoader from 'react-spinners/BeatLoader';
import {analyticGet} from '../../common/analytic';

import './analytic.scss';

export default function Analytic(props: analyticProps): JSX.Element {
    const [nstLoading, setNSTLoading] = useState(true);
    const [nslLoading, setNSLLoading] = useState(true);
    const [natLoading, setNATLoading] = useState(true);
    const [nalLoading, setNALLoading] = useState(true);
    const [nstNum, setNSTNUM] = useState(0);
    const [nslNum, setNSLNUM] = useState(0);
    const [natNum, setNATNUM] = useState(0);
    const [nalNum, setNALNUM] = useState(0);
    const [rsLoading, setRSLoading] = useState(false);
    const [raLoading, setRALoading] = useState(false);

    const { t } = useTranslation();
    
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

    useEffect(() => {
        if (nstLoading) {
            getNST();
        } 
        if (natLoading) {
            getNSL();
        }
        if (nslLoading) {
            getNAT();
        }
        if (nalLoading) {
            getNAL();
        }   
    }, [nstLoading, nslLoading, natLoading, nalLoading,]); 

    return (
        <div className="analytic-container">
            <section className="sec-analytic-result analytic-results-section analytic-results-data">
                <div>
                    <h5>{t("analytic.searchthismonth")}</h5>
                    <p>{nstLoading ? 
                        <BeatLoader color="#515AA9" />
                        : (nstNum<0 ? 
                            <span>{t("analytic.loadingfailed")}, <button className="link-button" onClick={()=>setNSTLoading(true)}>{t("analytic.tryagain")}</button></span> 
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
                            <span>{t("analytic.loadingfailed")}, <button className="link-button" onClick={()=>setNSLLoading(true)}>{t("analytic.tryagain")}</button></span> 
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
                            <span>{t("analytic.loadingfailed")}, <button className="link-button" onClick={()=>setNATLoading(true)}>{t("analytic.tryagain")}</button></span> 
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
                            <span>{t("analytic.loadingfailed")}, <button className="link-button" onClick={()=>setNALLoading(true)}>{t("analytic.tryagain")}</button></span> 
                            :nalNum
                          )
                        }
                    </p>
                </div>
            </section>
        </div>
    );
}

interface analyticProps {

}
