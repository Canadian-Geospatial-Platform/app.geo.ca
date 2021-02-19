/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable-next-line no-plusplus */
import { useTranslation } from 'react-i18next';
import ArrowNext from '@material-ui/icons/ArrowRight';
import ArrowLast from '@material-ui/icons/ArrowForward';
import ArrowPre from '@material-ui/icons/ArrowLeft';
import ArrowFirst from '@material-ui/icons/ArrowBack';
import './pagination.scss';

export default function Pagination(props:paginationProps): JSX.Element {
    const { t } = useTranslation();
    const {rpp, ppg, rcnt, current, selectPage} = props;
    const pcnt = Math.ceil(rcnt/rpp);
    const pgcnt = Math.ceil(pcnt/ppg);
    const cgroup = Math.ceil(current/rpp); 
    const pagenumbers = [];
    // eslint-disable-next-line no-plusplus
    for (let i=(cgroup-1)*ppg+1; i<=Math.min(cgroup*ppg, pcnt); i++) {
        pagenumbers.push(i);
    }
    const max = Math.min(current*rpp, rcnt);
    return (
        <div className="paginationContainer">
            <div className="total">{t("pagectrl.total", { index: `${(current-1)*rpp+1} - ${max}`, total: rcnt })}</div>
            {rcnt > rpp && 
            <div className="pages">
            {pgcnt>1 && 
                <div className={current===1?"buttonContainer  first disabled":"buttonContainer first"} onClick={cgroup>1?() => selectPage((cgroup-1)*rpp):undefined}>
                    <ArrowFirst className="searchButton" />
                </div>
            }
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
            {pgcnt>1 &&    
                <div className={current===pcnt?"buttonContainer last disabled":"buttonContainer last"} onClick={cgroup<(pgcnt+1)?() => selectPage(cgroup*rpp+1):undefined}>
                    <ArrowLast className="searchButton" />
                </div>
            }    
            </div> }    
        </div>
    )
}

interface paginationProps {
    rpp: number;
    ppg: number;
    rcnt: number;
    current: number;
    selectPage(pn:number): unknown; 
}