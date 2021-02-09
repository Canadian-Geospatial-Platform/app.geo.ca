import logo from '../../assests/img/GeoDotCaBanner.jpg';
import './header.scss';

export default function Header(): JSX.Element {
    //const location = useLocation();
    //console.log(location);
    return (
        <div className="header">
            <img src={logo} alt="" onClick={()=>window.open('/','_self')} />
            {/* <h1>GEO CA</h1> */}
        </div>
    );
}