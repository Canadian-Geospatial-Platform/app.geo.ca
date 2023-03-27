import { FormControl, InputLabel, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const styles = {
    formControl: {
        width: 'auto',
        marginLeft: '5px',
        paddingLeft: '10px',
    },
    select: {
        fontFamily: 'Open Sans',
        fontSize: '0.875rem',
        color: '#54595f',
    },
    divcontrol: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: '10px',
    },
    label: {
        marginTop: '5px',
        display: 'flex',
        fontFamily: 'Open Sans',
        fontSize: '0.875rem',
    },
    icon: {
        fill: '#515aa9',
    },
    option: {
        fontFamily: 'Open Sans',
        fontSize: '0.875rem',
        color: '#54595f',
    },
    root: {
        color: 'white',
    },
};

const useStyles = makeStyles(styles);

interface SelectionProps {
    label: string;
    labelClassName: string;
    defaultValue: string;
    options: SelectOptionInfo[];
    selectClassName: string;
    optionClassName: string;
    iconClassName: string;
    onSelect: (value: string) => void;
}
export interface SelectOptionInfo {
    label: string;
    value: string;
}
export default function DropdownSelection(props: SelectionProps): JSX.Element {
    const { label, labelClassName, selectClassName, optionClassName, iconClassName, defaultValue, options, onSelect } = props;
    const { t } = useTranslation();

    const classes = useStyles();
    const onChange = (event) => {
        onSelect(event.target.value);
    };
    useEffect(() => {
        console.log(props);
    }, []);
    return (
        <>
            <div className={classes.divcontrol}>
                <InputLabel className={`${classes.label} ${labelClassName}`} htmlFor="sortby-select">
                    {t(label)}
                </InputLabel>
                <FormControl className={classes.formControl}>
                    <Select
                        native
                        value={defaultValue}
                        onChange={onChange}
                        className={`${classes.select} ${selectClassName}`}
                        inputProps={{
                            name: 'sortby',
                            id: 'sortby-select',
                            classes: {
                                icon: `${iconClassName}`,
                            },
                        }}
                    >
                        {options.map((op, index) =>
                            <option className={`${classes.option} ${optionClassName}`} key={index} value={op.value}>
                                {t(op.label)}
                            </option>
                        )}
                    </Select>
                </FormControl>
            </div>
        </>
    );
}
