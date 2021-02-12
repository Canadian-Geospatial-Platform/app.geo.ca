import {useLocation, useHistory} from 'react-router';
import logo from '../../assests/img/GeoDotCaBanner.jpg';
import './header.scss';

export default function Header(): JSX.Element {
    const history = useHistory();
    const location = useLocation();
    
    return (
        <div className="header">
            <img src={logo} alt="" onClick={()=>history.push('/' + location.search)} />
            {/* <h1>GEO CA</h1> */}
        </div>
    );
}