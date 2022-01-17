import React from 'react';
import { useTranslation } from 'react-i18next';

function GenericSelectInput(props: any): JSX.Element {
    const { t } = useTranslation();
    const { keyName, handleChange, formData, values } = props;

    return (
        <div className="form-group">
            <label htmlFor={keyName}>
                {t(`creationform.basicview.${keyName}`)}:
                <select name={keyName} onChange={handleChange}>
                    {values.map(v => (<option value={v}>{v}</option>))}
                </select>
            </label>
        </div>
    );
}

export default GenericSelectInput;
