/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/click-events-diffave-key-events */
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
    const cgroup = Math.ceil(current / ppg);
    const pagenumbers = [];
    // eslint-disable-next-line no-plusplus
    for (let i = (cgroup - 1) * ppg + 1; i <= Math.min(cgroup * ppg, pcnt); i++) {
        pagenumbers.push(i);
    }
    const max = Math.min(current * rpp, rcnt);
    return (
        <nav className="pagination-container" aria-label={t('page.ctrl.paginationlabel')}>
            <p className="pagination-total text-center" role="status">
                {t('page.ctrl.total', { index: `${(current - 1) * rpp + 1} - ${max}`, total: rcnt })}
            </p>
            {pcnt > 1 && (
                <ul className="pagination pagination-list justify-content-center">
                    {pgcnt > 1 && (
                        <li className={cgroup === 1 ? 'list-item first disabled' : 'list-item first'}>
                            <button
                                type="button"
                                className={cgroup > 1 ? 'page-link page-link-ico' : 'page-link page-link-ico disabled'}
                                onClick={cgroup > 1 ? () => selectPage((cgroup - 1) * ppg) : undefined}
                                aria-label={t('page.ctrl.previouspages')}
                                aria-disabled={cgroup === 1 ? 'true' : 'false'}
                            >
                                <ArrowFirst className="ico-pagination ico-pagination-first" />
                                {cgroup > 1 && <span className="sr-only">{t('page.ctrl.previouspages')}</span>}
                            </button>
                        </li>
                    )}
                    <li className={current === 1 ? 'list-item previous disabled' : 'list-item previous'}>
                        <button
                            type="button"
                            className={current > 1 ? 'page-link page-link-ico' : 'page-link page-link-ico disabled'}
                            onClick={current > 1 ? () => selectPage(current - 1) : undefined}
                            aria-label={t('page.ctrl.previouspage')}
                            aria-disabled={current === 1 ? 'true' : 'false'}
                        >
                            <ArrowPre className="ico-pagination ico-pagination-prev" />
                            {current > 1 && <span className="sr-only">{t('page.ctrl.previouspage')}</span>}
                        </button>
                    </li>

                    {pagenumbers.map((pn) => (
                        <li key={pn} className={pn !== current ? 'list-item' : 'list-item current disabled'}>
                            <button
                                type="button"
                                className="page-link"
                                aria-label={'Page ' + pn}
                                aria-disabled={pn === current ? true : false}
                                onClick={pn !== current ? () => selectPage(pn) : undefined}
                            >
                                {pn}
                                {pn === current && <span className="sr-only">({t('page.ctrl.currentpage')})</span>}
                            </button>
                        </li>
                    ))}

                    <li className={current === pcnt ? 'list-item next disabled' : 'list-item next'}>
                        <button
                            type="button"
                            className={current < pcnt ? 'page-link page-link-ico' : 'page-link page-link-ico disabled'}
                            onClick={current < pcnt ? () => selectPage(current + 1) : undefined}
                            aria-label={t('page.ctrl.nextpage')}
                            aria-disabled={current === pcnt ? 'true' : 'false'}
                        >
                            <ArrowNext className="ico-pagination ico-pagination-next" />
                            {current < pcnt && <span className="sr-only">{t('page.ctrl.nextpage')}</span>}
                        </button>
                    </li>
                    {pgcnt > 1 && (
                        <li className={cgroup === pgcnt ? 'list-item last disabled' : 'list-item last'}>
                            <button
                                type="button"
                                className={cgroup < pgcnt ? 'page-link page-link-ico' : 'page-link page-link-ico disabled'}
                                onClick={cgroup < pgcnt ? () => selectPage(cgroup * ppg + 1) : undefined}
                                aria-label={t('page.ctrl.nextpages')}
                                aria-disabled={cgroup === pgcnt ? 'true' : 'false'}
                            >
                                <ArrowLast className="ico-pagination ico-pagination-last" />
                                {cgroup < pgcnt && <span className="sr-only">{t('page.ctrl.nextpages')}</span>}
                            </button>
                        </li>
                    )}
                </ul>
            )}
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
