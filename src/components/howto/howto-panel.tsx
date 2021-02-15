import { Typography } from '@material-ui/core';
//import SearchIcon from '@material-ui/icons/Search';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import PanelApp, {PanelProps} from '../appbar/panel';

export default function HowtoPanel(props: PanelProps): JSX.Element {    
    
    return (
        <PanelApp
            title="appbar.howto"
            icon={<HelpOutlineIcon />}
            showing = {props.showing}
            closeFunction = {props.closeFunction}
            content={
                ((
                    <Typography variant="body2" color="textSecondary" component="div">
                        ///  How to contents here
                    </Typography>
                ) as unknown) as Element
            }
        />
    );
}
