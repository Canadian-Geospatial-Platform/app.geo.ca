import ZoomOutIcon from '@material-ui/icons/Remove';

import { useMap } from 'react-leaflet';

import { ButtonMapNav, OtherProps } from '../button';

export default function ZoomOut(props: OtherProps): JSX.Element {
    const { ...otherProps } = props;

    // get map to use in zoom function
    const map = useMap();

    function zoomOut() {
        map.zoomOut();
    }

    return <ButtonMapNav tooltip="Zoom out" icon={<ZoomOutIcon />} onClickFunction={zoomOut} parentClass={otherProps.className} />;
}
