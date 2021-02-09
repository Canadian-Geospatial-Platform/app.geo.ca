import { render } from 'react-dom';

import { useMap } from 'react-leaflet';
//import SearchIcon from '@material-ui/icons/Search';
import FilterIcon from '@material-ui/icons/Filter';

import FilterPanel from '../../searchfilter/filter-panel';
import ButtonApp from '../button';

export default function Filters(): JSX.Element {
    const map = useMap();
    
    function handleclick() {
        render(<FilterPanel />, map.getContainer().getElementsByClassName('cgp-apppanel')[0]);
    }

    return <ButtonApp tooltip="appbar.filters" icon={<FilterIcon />} onClickFunction={handleclick} />;
}
