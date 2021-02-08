import ArrowNext from '@material-ui/icons/ArrowRight';
import ArrowLast from '@material-ui/icons/ArrowForward';
import ArrowPre from '@material-ui/icons/ArrowLeft';
import ArrowFirst from '@material-ui/icons/ArrowBack';
import './pagination.scss';

export default function Pagination(props:paginationProps): JSX.Element {
    const {rcnt, current, selectPage} = props;
    const pcnt = Math.ceil(rcnt/10);
    const pagenumbers = [];
    for (let i=1; i<=pcnt; i++) {
        pagenumbers.push(i);
    }
    return (
        <div className="paginationContainer">
            <div className={current===1?"buttonContainer  first disabled":"buttonContainer first"} onClick={current>1?() => selectPage(1):undefined}>
                <ArrowFirst className="searchButton" />
            </div>
            <div className={current===1?"buttonContainer previous disabled":"buttonContainer previous"} onClick={current>1?() => selectPage(current-1):undefined}>
                <ArrowPre className="searchButton" />
            </div>
            <div className="pageList">
            {pagenumbers.map(pn=>(
                    <div key={pn}
                        className = {pn!==current? "pageListItem" : "pageListItem current"}
                        onClick = {pn!==current?()=>selectPage(pn):undefined}
                    >
                        {pn}
                    </div>
                ))}
            </div>
            <div className={current===pcnt?"buttonContainer next disabled":"buttonContainer next"} onClick={current<(pcnt+1)?() => selectPage(current+1):undefined}>
                <ArrowNext className="searchButton" />
            </div>
            <div className={current===pcnt?"buttonContainer last disabled":"buttonContainer last"} onClick={current<(pcnt+1)?() => selectPage(pcnt):undefined}>
                <ArrowLast className="searchButton" />
            </div>
        </div>
    )
}

interface paginationProps {
    rcnt: number;
    current: number;
    selectPage: Function; 
}