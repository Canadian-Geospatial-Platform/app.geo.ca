import { render } from 'react-dom';

import SearchIcon from '@material-ui/icons/Search';

import { useMap } from 'react-leaflet';
import SearchPanel from '../../search/search-panel';
import ButtonApp from '../button';

export default function Search(): JSX.Element {
    const map = useMap();
    const initBounds = map.getBounds();

    function selectResult(result) {
        map.eachLayer((layer) => {
            //console.log(layer);
            const feature = layer.feature; 
            if ( !!feature && feature.type && feature.type==="Feature" && feature.properties && feature.properties.tag && feature.properties.tag === "geoViewGeoJSON") {
              map.removeLayer(layer);
            }
        });

        if (result!==null) {
            const data = {
                    "type": "Feature",
                    "properties": {"id": result.id, "tag": "geoViewGeoJSON"},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": JSON.parse(result.coordinates)
                    } };
            L.geoJSON(data).addTo(map);
        }
    }

    function handleclick() {
        render(<SearchPanel bounds={initBounds} selectResult={selectResult} />, map.getContainer().getElementsByClassName('cgp-apppanel')[0]);
    }

    return <ButtonApp tooltip="appbar.search" icon={<SearchIcon />} onClickFunction={handleclick} />;
}
