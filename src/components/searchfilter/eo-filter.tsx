import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import dataCollectionOptions from '../search/data-collection-option.json';
import orbitOptions from '../search/orbit-direction-option.json';
import polarizationOptions from '../search/polarization-option.json';
import DropdownSelection from './dropdown-selection';
import './eo-filter.scss';

interface EoSearchProps {
    language?: string;
    defaultDataCollection: string;
    defaultPolarization: string;
    defaultOrbit: string;
    onDataCollectionChange: (value: string) => void;
    onPolarizationChange: (value: string) => void;
    onOrbitChange: (value: string) => void;
}
export default function EoSearchFilter(props: EoSearchProps): JSX.Element {
    const {language, defaultDataCollection, defaultPolarization, defaultOrbit, onDataCollectionChange, onPolarizationChange, onOrbitChange} = props;
    const { t } = useTranslation();
    const [dataCollection, setDataCollection] = useState(defaultDataCollection);
    const [orbit, setOrbit] = useState(defaultOrbit);
    const [polarization, setPolarization] = useState(defaultPolarization);
    const handleDataCollectionChange = (value: string) =>{ 
        setDataCollection(value);
        onDataCollectionChange(value); };
    const handleOrbitChange = (value: string) => { 
        setOrbit(value);
        onOrbitChange(value)};
    const handlePolarizationChange = (value: string) => {
        setPolarization(value);
        onPolarizationChange(value)};
    return (
        <div className="eo-filter">
            <DropdownSelection
                label="filter.label.eofilter.data-collection"
                options={dataCollectionOptions}
                labelClassName="dropdown-select-label"
                selectClassName="dropdown-select"
                optionClassName="dropdown-select-option"
                iconClassName="dropdown-select-icon"
                defaultValue={dataCollection}
                tooltip={dataCollection===''?undefined:true}
                tooltipTitle={`filter.label.eofilter.${dataCollection}-tooltip`}
                onSelect={handleDataCollectionChange}
            />
           { dataCollection === 'sentinel-1' && (<div className="sentinel-1">
            <DropdownSelection  
                label="filter.label.eofilter.polarization"
                options={polarizationOptions}
                labelClassName="dropdown-select-label"
                selectClassName="dropdown-select"
                optionClassName="dropdown-select-option"
                iconClassName="dropdown-select-icon"
                defaultValue={polarization}
                onSelect={handlePolarizationChange}
                tooltip
                tooltipTitle='filter.label.eofilter.polarization-tooltip'
            />  
            <DropdownSelection
                label="filter.label.eofilter.orbit"
                options={orbitOptions}
                labelClassName="dropdown-select-label"
                selectClassName="dropdown-select"
                optionClassName="dropdown-select-option"
                iconClassName="dropdown-select-icon"
                defaultValue={orbit}
                onSelect={handleOrbitChange}
                tooltip
                tooltipTitle='filter.label.eofilter.orbit-tooltip'
            />  
            </div>
           ) }
            </div>
    );
}
