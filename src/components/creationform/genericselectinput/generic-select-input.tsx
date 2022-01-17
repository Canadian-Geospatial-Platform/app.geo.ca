import React from 'react';
import { useTranslation } from 'react-i18next';

function GenericSelectInput(props: any): JSX.Element {
    const { t } = useTranslation();
    const { keyName, keyValue, handleChange, formData } = props;

    return (
        <div className="form-group">
            <label htmlFor={keyName}>
                 {t('creationform.basicview.' + keyName)}:
                <input type="select" name={keyName} value={keyValue || ''} onChange={handleChange} />
            </label>
        </div>
    );
}

export default GenericSelectInput;
