import { render } from 'react-dom';

import AccountIcon from '@material-ui/icons/AccountBox';

import { useMap } from 'react-leaflet';

import LayersPanel from '../../layers/layers-panel';
import ButtonApp from '../button';

export default function Account(): JSX.Element {
    const map = useMap();
    
    function handleclick() {
        render(<LayersPanel />, map.getContainer().getElementsByClassName('cgp-apppanel')[0]);
    }

    return <ButtonApp tooltip="appbar.layers" icon={<AccountIcon />} onClickFunction={handleclick} />;
}
