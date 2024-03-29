/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Grid, GridDirection } from '@material-ui/core';
import { LatLng, LatLngBounds } from 'leaflet';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../assets/i18n/i18n';
import { SpatialTemporalFilter } from '../../reducers/reducer';
import SpatialExtent from './spatial-extent';
import './spatial-temporalfilter.scss';
import TemporalExtent from './temporal-extent';

export default function SpatialTemporalSearchFilter(props: SpatialTemporalProps): JSX.Element {
    const {
        direction,
        gridWidth,
        temporalDirection,
        filtertitle,
        filtervalues,
        filterselected,
        selectFilters,
        onZoomChange,
        onCenterChange,
        onBoundboxChange,
        filtername,
        externalLabel,
        labelParams,
    } = props;
    const [fselected, setFselected] = useState<SpatialTemporalFilter>(filterselected);
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const language = t('app.language');

    const filterShowing = filtervalues
        .map((f: string, i: number) => {
            return { filter: f, findex: i };
        })
        .sort((a, b) => {
            return a.filter.toLowerCase().localeCompare(b.filter.toLowerCase(), language);
        });
    const onSelectFilter = (findex: number) => {
        const newselected = fselected.extents.map((fs) => fs);
        const selectedIndex = fselected.extents.findIndex((fs) => fs === findex);
        if (selectedIndex < 0) {
            newselected.push(findex);
        } else {
            newselected.splice(selectedIndex, 1);
        }
        selectFilters({ ...filterselected, extents: newselected });
        setFselected({ ...filterselected, extents: newselected });
    };
    const handleOpen = () => {
        if (open) {
            selectFilters(fselected);
        }
        setOpen(!open);
    };

    useEffect(() => {
        setFselected(filterselected);
    }, [filterselected]);

    const handleEndDateChange = (date) => {
        // console.log('end', date);
        try {
            setFselected({ ...filterselected, endDate: date.toISOString() });
            selectFilters({ ...filterselected, endDate: date.toISOString() });
        } catch (e) {
            //ignore
        }
    };

    const handleStartDateChange = (date) => {
        // console.log('start', date);
        try {
            setFselected({ ...filterselected, startDate: date.toISOString() });
            selectFilters({ ...filterselected, startDate: date.toISOString() });
        } catch (e) {
            //ignore
        }
    };

    const handleBBoxChange = (boundbox: LatLngBounds) => {
        console.log('bbox', boundbox);
        onBoundboxChange(boundbox);
    };

    const handleZoomChange = (zoom: number, bounds: LatLngBounds) => {
        console.log('zoom', zoom, bounds);
        onZoomChange(zoom, bounds);
    };

    const handleCenterChange = (center: LatLng, bounds: LatLngBounds) => {
        console.log('center', center, bounds);
        onCenterChange(center);
        onBoundboxChange(bounds);
    };

    return (
        <div className={open ? 'filter-wrap open' : 'filter-wrap'}>
            {filtertitle !== '' && (
                <button
                    type="button"
                    className="link-button filter-title"
                    aria-expanded={open ? 'true' : 'false'}
                    onClick={() => handleOpen()}
                >
                    {filtertitle}
                </button>
            )}
            <div className="filter-list-wrap">
                <Grid container direction={direction}>
                    {filterShowing.map((f: { filter: string; findex: number }) => {
                        const selected = fselected.extents.findIndex((fs) => fs === f.findex) > -1;
                        const inputID = `filter-${filtertitle.replace(/ /g, '-').toLowerCase()}-${f.findex}`; // create valid html ids for each label/input pair (lowercase is optional)
                        return (
                            <Grid container style={{ width: gridWidth }} direction="column" key={`filter-${f.findex}`}>
                                <div
                                    className={
                                        selected
                                            ? 'filterValue checked d-flex flex-row align-items-start list-item'
                                            : 'filterValue d-flex flex-row align-items-start list-item'
                                    }
                                >
                                    <label htmlFor={inputID} className="label">
                                        {externalLabel
                                            ? labelParams && labelParams.length > 0
                                                ? t(`filter.label.${filtername}.${f.filter}`, { param: labelParams[f.findex] })
                                                : t(`filter.label.${filtername}.${f.filter}`)
                                            : f.filter}
                                    </label>
                                    <input
                                        id={inputID}
                                        type="checkbox"
                                        className="checkbox"
                                        checked={selected}
                                        onChange={() => onSelectFilter(f.findex)}
                                    />
                                </div>
                                {f.findex === 0 && fselected.extents.findIndex((fs) => fs === f.findex) >= 0 ? (
                                    <div>
                                        <SpatialExtent
                                            language={i18n.language}
                                            onBBox={handleBBoxChange}
                                            onZoom={handleZoomChange}
                                            onCenter={handleCenterChange}
                                        />
                                    </div>
                                ) : null}
                                {f.findex === 1 && fselected.extents.findIndex((fs) => fs === f.findex) >= 0 ? (
                                    <div>
                                        <TemporalExtent
                                            direction={temporalDirection}
                                            initStartDate={new Date(fselected.startDate)}
                                            initEndDate={new Date(fselected.endDate)}
                                            onSelectStartDate={handleStartDateChange}
                                            onSelectEndDate={handleEndDateChange}
                                        />
                                    </div>
                                ) : null}
                            </Grid>
                        );
                    })}
                </Grid>
            </div>
        </div>
    );
}

interface SpatialTemporalProps {
    filtertitle: string;
    filtervalues: string[];
    filterselected: SpatialTemporalFilter;
    selectFilters: (arg: SpatialTemporalFilter) => void;
    onZoomChange: (zoom: number, bounds: LatLngBounds) => void;
    onCenterChange: (center: LatLng) => void;
    onBoundboxChange: (boundbox: LatLngBounds) => void;
    filtername?: string;
    externalLabel?: boolean;
    labelParams?: string[];
    direction?: GridDirection;
    temporalDirection?: GridDirection;
    gridWidth?: string;
}
