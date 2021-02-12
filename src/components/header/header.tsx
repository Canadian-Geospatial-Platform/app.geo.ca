import logo from '../../assests/img/GeoDotCaBanner.jpg';
import './header.scss';

export default function Header(): JSX.Element {
    //const location = useLocation();
    //console.log(location);
    return (
        <header className="header">
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-3 header-logo-col">
                        <a href="#" onClick={() => window.open('/', '_self')}>
                            <img src={logo} alt="" />
                        </a>
                        {/* <h1>GEO CA</h1> */}
                    </div>
                    <div className="col-9 header-nav-col">
                        <nav className="header-nav">
                            <ul className="list-group flex-row justify-content-end align-items-center menu-list">
                                <li className="list-group-item">
                                    <a href="#">Home</a>
                                </li>

                                <li className="list-group-item">
                                    <a href="#">Français</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}
