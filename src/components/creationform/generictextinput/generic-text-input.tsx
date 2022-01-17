import React from 'react';
import { useTranslation } from 'react-i18next';

function GenericTextInput(props: any): JSX.Element {
    const { t } = useTranslation();
    const { keyName, keyValue, handleChange, formData } = props;

    return (
        <div className="form-group">
            <label htmlFor={keyName}>
                 {t('creationform.basicview.' + keyName)}:
                <input type="text" name={keyName} value={keyValue || ''} onChange={handleChange} />
            </label>
        </div>
    );
}

export default GenericTextInput;
