import { render } from 'react-dom';

import { useMap } from 'react-leaflet';
import SvgIcon from '@material-ui/core/SvgIcon';
import FilterIcon from '../../../assets/icons/filter.svg';

import FilterPanel from '../../searchfilter/filters-panel';
import ButtonApp from '../button';

export default function Filters(): JSX.Element {
    const map = useMap();

    function handleclick() {
        render(<FilterPanel />, map.getContainer().getElementsByClassName('cgp-apppanel')[0]);
    }

    return (
        <ButtonApp
            tooltip="appbar.filters"
            icon={
                <SvgIcon>
                    <FilterIcon />
                </SvgIcon>
            }
            onClickFunction={handleclick}
        />
    );
}
