import { FormControl, InputLabel, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const styles = {
    formControl: {
        width: 'auto',
        marginLeft: '5px',
    },
    select: {
        width: 'auto',
    },
    divcontrol: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        marginTop: '5px',
        display: 'flex',
    },
    icon: {
        fill: 'white',
    },
    root: {
        color: 'white',
    },
};

const useStyles = makeStyles(styles);

interface SortingProps {
    label: string;
    labelClassName: string;
    defaultValue: string;
    options: SortingOptionInfo[];
    selectClassName: string;
    optionClassName: string;
    iconClassName: string;
    onSorting: (value: string) => void;
}
export interface SortingOptionInfo {
    label: string;
    value: string;
}
export default function Sorting(props: SortingProps): JSX.Element {
    const { label, labelClassName, selectClassName, optionClassName, iconClassName, defaultValue, options, onSorting } = props;
    const { t } = useTranslation();

    const classes = useStyles();
    const onChange = (event) => {
        onSorting(event.target.value);
    };
    useEffect(() => {
        console.log(props);
    }, []);
    return (
        <>
            {/*
            <label htmlFor="sortingSelectId"> {t(label)}</label>
            <select id="sortingSelectId" onChange={onChange} className="selectpicker" value={defaultValue}>
                <option value="0" disabled>
                    {t('appbar.sortby.select')}
                </option>
                {options.map((op, index) => (
                    <option key={index} value={op.value}>
                        {t(op.label)}
                    </option>
                ))}
            </select>
                */}

            <div className={classes.divcontrol}>
                <InputLabel className={`${classes.label} ${labelClassName}`} htmlFor="sortby-select">
                    {t(label)}
                </InputLabel>
                <FormControl className={classes.formControl}>
                    <Select
                        native
                        value={defaultValue}
                        onChange={onChange}
                        className={`${selectClassName}`}
                        inputProps={{
                            name: 'sortby',
                            id: 'sortby-select',
                            classes: {
                                icon: `${iconClassName}`,
                            },
                        }}
                    >
                        <option value="0" disabled>
                            {t('appbar.sortby.select')}
                        </option>
                        {options.map((op, index) => (
                            <option className={`${optionClassName}`} key={index} value={op.value}>
                                {t(op.label)}
                            </option>
                        ))}
                    </Select>
                </FormControl>
            </div>
        </>
    );
}
