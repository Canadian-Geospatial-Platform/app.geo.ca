/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Grid, GridDirection } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MetadataSourceFilter } from '../../reducers/reducer';
import './metadata-sourcefilter.scss';
import EoSearchFilter from './eo-filter';

export default function MetadataSourceSearchFilter(props: MetadataSourceProps): JSX.Element {
    const {
        filtertitle,
        filtervalues,
        filterselected,
        selectFilters,
        filtername,
        externalLabel,
        labelParams,        
        direction,
        gridWidth
    } = props;
    const [fselected, setFselected] = useState<MetadataSourceFilter>(filterselected);
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
        const newselected = fselected.sources.map((fs) => fs);
        const selectedIndex = fselected.sources.findIndex((fs) => fs === findex);
        if (selectedIndex < 0) {
            newselected.push(findex);
        } else {
            newselected.splice(selectedIndex, 1);
        }
        selectFilters({ ...filterselected, sources: newselected });
        setFselected({ ...filterselected, sources: newselected });
    };
    const onDataCollectionChange = (value: string) =>{
        console.log(value);
        selectFilters({...filterselected, dataCollection: value});
        setFselected({...filterselected, dataCollection: value});
    }
    const onPolarizationChange = (value: string) =>{
        console.log(value);
        selectFilters({...filterselected, polarization: value});
        setFselected({...filterselected, polarization: value});
    }
    const onOrbitChange = (value: string) =>{
        console.log(value);
        selectFilters({...filterselected, orbitDirection: value});
        setFselected({...filterselected, orbitDirection: value});
    }
    const handleOpen = () => {
        if (open) {
            selectFilters(fselected);
        }
        setOpen(!open);
    };

    useEffect(() => {
        setFselected(filterselected);
    }, [filterselected]);    
    
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
                        const selected = fselected.sources.findIndex((fs) => fs === f.findex) > -1;
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
                                {f.findex === 2 && fselected.sources.findIndex((fs) => fs === f.findex) >= 0 ? (
                                    <div>
                                        <EoSearchFilter 
                                            defaultDataCollection={fselected.dataCollection}
                                            defaultPolarization={fselected.polarization}
                                            defaultOrbit={fselected.orbitDirection}
                                            onDataCollectionChange={onDataCollectionChange}
                                            onOrbitChange={onOrbitChange}
                                            onPolarizationChange={onPolarizationChange}
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

interface MetadataSourceProps {
    filtertitle: string;
    filtervalues: string[];
    filterselected: MetadataSourceFilter;
    selectFilters: (arg: MetadataSourceFilter) => void;
    filtername?: string;
    externalLabel?: boolean;
    labelParams?: string[];
    direction?: GridDirection;    
    gridWidth?: string;
}
