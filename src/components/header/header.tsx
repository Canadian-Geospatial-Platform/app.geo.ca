import logo from '../../../public/img/GeoDotCaBanner.jpg';

export default function Header(): JSX.Element {
    return (
        <div className="header">
            <img src={logo} alt="" />
            <h1>GEO CA</h1>
        </div>
    );
}