import DateFnsUtils from '@date-io/date-fns';
import { FormControl, Grid, GridDirection } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import { useTranslation } from 'react-i18next';
import format from 'date-fns/format';
import frLocale from 'date-fns/locale/fr';
import enLocale from 'date-fns/locale/en-US';
import './temporal-extent.scss';
import { useState } from 'react';
const localeMap = {
    en: enLocale,
    fr: frLocale,
};
class FrLocalizedUtils extends DateFnsUtils {
    getDatePickerHeaderText(date) {
        return format(date, 'd MMM yyyy', { locale: this.locale });
    }
}
const localeUtilsMap = {
    en: DateFnsUtils,
    fr: FrLocalizedUtils,
};
const localeFormatMap = {
    en: 'MM/dd/yyyy',
    fr: 'MM/dd/yyyy',
};
const styles = {
    formControl: {
        width: '150px',
        marginLeft: '10px',
        color: '#54595f',
    },
    divcontrol: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
};

const useStyles = makeStyles(styles);

export interface TemporalProps {
    initStartDate: Date;
    initEndDate: Date;
    onSelectStartDate: (date) => void;
    onSelectEndDate: (date) => void;
    direction?: GridDirection;
}
export default function TemporalExtent(props: TemporalProps): JSX.Element {
    const { initStartDate, initEndDate, direction, onSelectStartDate, onSelectEndDate } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const language = t('app.language');
    const [locale, setLocale] = useState(language);
    const handleStartDateChange = (date) => {
        onSelectStartDate(date);
    };

    const handleEndDateChange = (date) => {
        onSelectEndDate(date);
    };
    /*
        useEffect(() => {
            onSelectStartDate(initStartDate);
            onSelectEndDate(initEndDate);
        }, []);
    */
    return (
        <div className="temporal-extent">
            <MuiPickersUtilsProvider utils={localeUtilsMap[locale]} locale={localeMap[locale]}>
                <Grid container direction="column">
                    <div className={classes.divcontrol}>
                        <Grid container direction={direction}>
                            <FormControl className={classes.formControl}>
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant="inline"
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    id="date-picker-inline"
                                    label={t('filter.spatemp.startdate')}
                                    value={initStartDate}
                                    onChange={handleStartDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change start date',
                                    }}
                                />
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <KeyboardDatePicker
                                    views={['year', 'month', 'date']}
                                    disableToolbar
                                    variant="inline"
                                    format={localeFormatMap[locale]}
                                    margin="normal"
                                    id="date-picker-inline"
                                    label={t('filter.spatemp.enddate')}
                                    value={initEndDate}
                                    onChange={handleEndDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change end date',
                                    }}
                                />
                            </FormControl>
                        </Grid>
                    </div>
                    <div style={{ paddingTop: '15px', paddingLeft: '10px' }}>{t('filter.spatemp.temporal')}</div>
                </Grid>
            </MuiPickersUtilsProvider>
        </div>
    );
}
