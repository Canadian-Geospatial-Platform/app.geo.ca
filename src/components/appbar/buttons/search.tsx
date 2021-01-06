import { render } from 'react-dom';

import SearchIcon from '@material-ui/icons/Search';

import { useMap } from 'react-leaflet';

import SearchPanel from '../../search/search-panel';
import ButtonApp from '../button';

export default function Search(): JSX.Element {
    const map = useMap();
    const initBounds = map.getBounds();

    function handleclick() {
        render(<SearchPanel bounds={initBounds} />, map.getContainer().getElementsByClassName('cgp-apppanel')[0]);
    }

    return <ButtonApp tooltip="appbar.search" icon={<SearchIcon />} onClickFunction={handleclick} />;
}
