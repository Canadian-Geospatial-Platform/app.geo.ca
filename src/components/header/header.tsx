import logo from '../../assests/img/GeoDotCaBanner.jpg';
import './header.scss';

export default function Header(): JSX.Element {
    return (
        <div className="header">
            <img src={logo} alt="" />
            {/* <h1>GEO CA</h1> */}
        </div>
    );
}