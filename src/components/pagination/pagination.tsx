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

export default function Pagination(props: paginationProps): JSX.Element {
    const { t } = useTranslation();
    const { rpp, ppg, rcnt, current, selectPage } = props;
    const pcnt = Math.ceil(rcnt / rpp);
    const pgcnt = Math.ceil(pcnt / ppg);
    const cgroup = Math.ceil(current / rpp);
    const pagenumbers = [];
    // eslint-disable-next-line no-plusplus
    for (let i = (cgroup - 1) * ppg + 1; i <= Math.min(cgroup * ppg, pcnt); i++) {
        pagenumbers.push(i);
    }
    const max = Math.min(current * rpp, rcnt);
    return (
        <nav className="pagination-container" aria-label="Page navigation pages">
            <p className="pagination-total text-center">
                {t('page.ctrl.total', { index: `${(current - 1) * rpp + 1} - ${max}`, total: rcnt })}
            </p>
            <ul className="pagination pagination-list justify-content-center">
                {pgcnt > 1 && (
                    <li
                        className={current === 1 ? 'list-item  first disabled' : 'list-item first'}
                        onClick={cgroup > 1 ? () => selectPage((cgroup - 1) * rpp) : undefined}
                    >
                        <a className="page-link" href="#" aria-label="First page">
                            <i className="fas fa-angle-double-left" aria-hidden="true" title="First page" />
                            <span className="sr-only">First page</span>
                        </a>
                    </li>
                )}
                <li
                    className={current === 1 ? 'list-item previous disabled' : 'list-item previous'}
                    onClick={current > 1 ? () => selectPage(current - 1) : undefined}
                >
                    <a className="page-link" href="#" aria-label="Previous page">
                        <i className="fas fa-angle-left" aria-hidden="true" title="Previous page" />
                        <span className="sr-only">Previous page</span>
                    </a>
                </li>
                {pagenumbers.map((pn) => (
                    <li
                        key={pn}
                        className={pn !== current ? 'list-item' : 'list-item current'}
                        onClick={pn !== current ? () => selectPage(pn) : undefined}
                    >
                        <a className="page-link" href="#">
                            {pn !== current ? (
                                pn
                            ) : (
                                <span>
                                    {pn} <span className="sr-only">current</span>
                                </span>
                            )}
                        </a>
                    </li>
                ))}

                <li
                    className={current === pcnt ? 'list-item next disabled' : 'list-item next'}
                    onClick={current < pcnt + 1 ? () => selectPage(current + 1) : undefined}
                >
                    <a className="page-link" href="#" aria-label="Next page">
                        <i className="fas fa-angle-right" aria-hidden="true" title="Next page" />
                        <span className="sr-only">Next page</span>
                    </a>
                </li>
                {pgcnt > 1 && (
                    <li
                        className={current === pcnt ? 'list-item last disabled' : 'list-item last'}
                        onClick={cgroup < pgcnt + 1 ? () => selectPage(cgroup * rpp + 1) : undefined}
                    >
                        <a className="page-link" href="#" aria-label="Last page">
                            <i className="fas fa-angle-double-right" aria-hidden="true" title="Last page" />
                            <span className="sr-only">Last page</span>
                        </a>
                    </li>
                )}
            </ul>
        </nav>
    );
}

interface paginationProps {
    rpp: number;
    ppg: number;
    rcnt: number;
    current: number;
    selectPage(pn: number): unknown;
}
