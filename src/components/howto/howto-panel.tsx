import { Typography } from '@material-ui/core';
//import SearchIcon from '@material-ui/icons/Search';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import PanelApp from '../appbar/panel';

export default function HowtoPanel(props: HowtoProps): JSX.Element {    
    const {map} = props;
    
    return (
        <PanelApp
            title="appbar.howto"
            icon={<HelpOutlineIcon />}
            // content={
            //     ((
            //         <Typography variant="body2" color="textSecondary" component="div">
            //             ///  Add more contents here
            //         </Typography>
            //     ) as unknown) as Element
            // }
        />
    );
}
interface HowtoProps {
    map: React.ReactNode
}
