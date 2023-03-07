import DateFnsUtils from '@date-io/date-fns';
import { FormControl, Grid, GridDirection } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import { useTranslation } from 'react-i18next';
import './temporal-extent.scss';

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
}

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
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
                                    disableToolbar
                                    variant="inline"
                                    format="MM/dd/yyyy"
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
            </MuiPickersUtilsProvider >
        </div>
    );
}
