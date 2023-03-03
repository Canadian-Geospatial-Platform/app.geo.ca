/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { StoreEnhancer } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';
import FilterIcon from '../../assets/icons/filter.svg';
import { loadState } from '../../reducers/localStorage';
import PanelApp, { PanelProps } from '../appbar/panel';
import SearchFilter from './searchfilter';
import organisations from '../search/organisations.json';
import types from '../search/types.json';
import themes from '../search/themes.json';
import spatials from '../search/spatials.json';
import { setFilters } from '../../reducers/action';
import { SpatialData, StacData } from '../../app';
import stacs from '../search/stac.json';
import spatemps from '../search/spatial-temporal.json';
import { INITSPATIALTEMPORALFILTER, SpatialTemporalFilter } from '../../reducers/reducer';
import SpatialTemporalSearchFilter from './spatial-temporalfilter';

export default function FilterPanel(props: PanelProps): JSX.Element {
    const { showing, closeFunction } = props;
    const { t } = useTranslation();
    const storeorgfilters = useSelector((state) => state.mappingReducer.orgfilter);
    const storetypefilters = useSelector((state) => state.mappingReducer.typefilter);
    const storethemefilters = useSelector((state) => state.mappingReducer.themefilter);
    const storefoundational = useSelector((state) => state.mappingReducer.foundational);
    const storespatialfilters = useSelector((state) => (state.mappingReducer.spatialfilter ? state.mappingReducer.spatialfilter : []));
    const storestacfilters = useSelector((state) => (state.mappingReducer.stacfilter ? state.mappingReducer.stacfilter : []));
    const storespatempfilters = useSelector((state) => (state.mappingReducer.spatempfilter ? state.mappingReducer.spatempfilter : INITSPATIALTEMPORALFILTER));
    const dispatch = useDispatch();
    const language = t('app.language');
    const [orgfilters, setOrg] = useState(storeorgfilters);
    const [typefilters, setType] = useState(storetypefilters);
    const [themefilters, setTheme] = useState(storethemefilters);
    const [spatialfilters, setSpatial] = useState(storespatialfilters);
    const [spatempfilters, setSpatemp] = useState<SpatialTemporalFilter>(storespatempfilters);
    const [foundational, setFound] = useState(storefoundational);
    const [fReset, setFReset] = useState(false);
    const [ofOpen, setOfOpen] = useState(false);
    const [spatialData] = useState<SpatialData>(useSelector((state) => state.mappingReducer.spatialData));
    const spatialLabelParams = [];
    const [stacfilters, setStac] = useState(storestacfilters);
    const [stacData] = useState<StacData>(useSelector((state) => state.mappingReducer.stacData));
    const stacLabelParams = [];
    // console.log(state, dispatch);
    const applyFilters = () => {
        dispatch(
            setFilters({
                orgfilter: orgfilters,
                typefilter: typefilters,
                themefilter: themefilters,
                spatialfilter: spatialfilters,
                foundational,
                stacfilter: stacfilters,
                spatempfilter: spatempfilters
            })
        );
        setFReset(false);
        closeFunction(' search');
    };
    const clearAll = () => {
        setOrg([]);
        setType([]);
        setTheme([]);
        setSpatial([]);
        setStac([]);
        setSpatemp(INITSPATIALTEMPORALFILTER);
        setFound(false);
        dispatch(setFilters({ orgfilter: [], typefilter: [], themefilter: [], spatialfilter: [], foundational: false, stacfilter: [], spatempfilter: INITSPATIALTEMPORALFILTER }));
        setFReset(false);
        closeFunction(' search');
    };

    const handleOrg = (filters: unknown): void => {
        setFReset(true);
        setOrg(filters);
    };

    const handleType = (filters: unknown): void => {
        setFReset(true);
        setType(filters);
    };

    const handleTheme = (filters: unknown): void => {
        setFReset(true);
        setTheme(filters);
    };

    const handleSpatial = (filters: unknown): void => {
        setFReset(true);
        setSpatial(filters);
    };
    const handleSpatemp = (filters: SpatialTemporalFilter): void => {
        setFReset(true);
        setSpatemp(filters);
    };
    const handleStac = (filters: unknown): void => {
        setFReset(true);
        setStac(filters);
    };
    const handleFound = (found: unknown): void => {
        setFReset(true);
        setFound(found);
    };

    useEffect(() => {
        // const filteractive = (themefilters.length>0 || orgfilters.length > 0 || typefilters.length > 0);
        if (showing) {
            const localState: StoreEnhancer<unknown, unknown> | undefined = loadState();
            const ofilters = localState !== undefined ? localState.mappingReducer.orgfilter : [];
            const tfilters = localState !== undefined ? localState.mappingReducer.typefilter : [];
            const thfilters = localState !== undefined ? localState.mappingReducer.themefilter : [];
            const spafilters = localState !== undefined ? localState.mappingReducer.spatialfilter : [];
            const spatfilters = localState !== undefined ? localState.mappingReducer.spatempfilter : INITSPATIALTEMPORALFILTER;
            const found = localState !== undefined ? localState.mappingReducer.foundational : false;
            const stfilters =
                localState !== undefined ? (localState.mappingReducer.stacfilter ? localState.mappingReducer.stacfilter : []) : [];
            setOrg(ofilters);
            setType(tfilters);
            setTheme(thfilters);
            setSpatial(spafilters);
            setStac(stfilters);
            setSpatemp(spatfilters);
            setFound(found);
            setFReset(true);
        }
    }, [showing, language]);
    spatialLabelParams.splice(0);
    spatialLabelParams.push(spatialData?.viewableOnTheMap);
    spatialLabelParams.push(spatialData?.notViewableOnTheMap);
    stacLabelParams.splice(0);
    stacLabelParams.push(stacData?.hnap);
    stacLabelParams.push(stacData?.stac);
    //console.log(spatialLabelParams);
    return (
        <PanelApp
            title="appbar.filters"
            icon={
                <SvgIcon>
                    <FilterIcon />
                </SvgIcon>
            }
            showing={showing}
            closeFunction={closeFunction}
            content={
                ((
                    <Typography variant="body2" color="textSecondary" component="div">
                        <div className="container-fluid container-filter-selection small-panel">
                            <div className="row row-filters">
                                <h3 className="filters-title">{t('filter.filterby')}:</h3>
                                <div className="filters-wrap">
                                    <SpatialTemporalSearchFilter
                                        filtertitle={t('filter.spatemp.title')}
                                        filtervalues={spatemps[language]}
                                        filterselected={spatempfilters}
                                        selectFilters={handleSpatemp}
                                        filtername="spatemp"
                                        externalLabel
                                    />
                                    <SearchFilter
                                        filtertitle={t('filter.organisations')}
                                        filtervalues={organisations[language]}
                                        filterselected={orgfilters}
                                        selectFilters={handleOrg}
                                    />
                                    <SearchFilter
                                        filtertitle={t('filter.types')}
                                        filtervalues={types[language]}
                                        filterselected={typefilters}
                                        selectFilters={handleType}
                                    />

                                    <SearchFilter
                                        filtertitle={t('filter.spatial')}
                                        filtervalues={spatials[language]}
                                        filterselected={spatialfilters}
                                        selectFilters={handleSpatial}
                                        filtername="spatial"
                                        externalLabel
                                        labelParams={spatialLabelParams}
                                    />

                                    <SearchFilter
                                        filtertitle={t('filter.stac')}
                                        filtervalues={stacs[language]}
                                        filterselected={stacfilters}
                                        selectFilters={handleStac}
                                        filtername="stac"
                                        externalLabel
                                        labelParams={stacLabelParams}
                                    />
                                    <SearchFilter
                                        filtertitle={t('filter.themes')}
                                        filtervalues={themes[language]}
                                        filterselected={themefilters}
                                        selectFilters={handleTheme}
                                    />

                                    <div className={ofOpen ? 'filter-wrap open' : 'filter-wrap'}>
                                        <button
                                            type="button"
                                            className="link-button filter-title"
                                            aria-expanded={ofOpen ? 'true' : 'false'}
                                            onClick={() => setOfOpen(!ofOpen)}
                                        >
                                            {t('filter.otherfilters')}
                                        </button>
                                        <SearchFilter
                                            filtertitle={t('filter.foundational')}
                                            filtervalues={[]}
                                            filterselected={foundational ? [1] : []}
                                            selectFilters={handleFound}
                                        />
                                    </div>
                                    <div className="filter-actions d-flex justify-content-end">
                                        <button
                                            type="button"
                                            className={fReset ? 'btn search-btn submit' : 'btn search-btn submit disabled'}
                                            onClick={fReset ? applyFilters : undefined}
                                        >
                                            {t('filter.applyfilters')}
                                        </button>
                                        <button type="button" className="btn search-btn clear" onClick={clearAll}>
                                            {t('filter.clearall')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Typography>
                ) as unknown) as Element
            }
        />
    );
}
