/* eslint-disable prettier/prettier */
import { useTranslation } from 'react-i18next';
import { Typography, SvgIcon } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import SearchIcon from '@material-ui/icons/Search';
// import KeywordSearchIcon from '@material-ui/icons/Search';
import FilterIcon from '../../assets/icons/filter.svg';


import PanelApp, { PanelProps } from '../appbar/panel';

export default function HowtoPanel(props: PanelProps): JSX.Element {
    const { showing, closeFunction } = props;
    const { t } = useTranslation();

    return (
        <PanelApp
            title="appbar.howto"
            icon={<HelpOutlineIcon />}
            showing={showing}
            closeFunction={closeFunction}
            content={
                ((
                    <Typography variant="body2" color="textSecondary" component="div">
                        <h3 className="section-title">
                            <SearchIcon /> {t('appbar.search')}{' '}
                        </h3>
                        <p>{t('howto.geosearchdescription')}</p>
                        {/* <h3 className="section-title">
                            <KeywordSearchIcon /> {t('appbar.keywordsearch')}{' '}
                        </h3>
                        <p>{t('howto.keywordsearchdescription')}</p> */}
                        <h3 className="section-title">
                            <SvgIcon><FilterIcon /></SvgIcon> {t('appbar.filters')}{' '}
                        </h3>
                        <p>{t('howto.filtersdescription')}</p>
                        <h3 className="section-title">{t('appbar.searchoperators')}
                        </h3>
                        <p>{t('howto.searchoperators')}</p>
                    </Typography>
                ) as unknown) as Element
            }
        />
    );
}
