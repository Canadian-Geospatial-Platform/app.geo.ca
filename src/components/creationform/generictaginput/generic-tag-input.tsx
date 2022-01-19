import React from 'react';
import { useTranslation } from 'react-i18next';

function GenericTagInput(props: any): JSX.Element {
    const { t } = useTranslation();
    const { keyName, handleChange, formData } = props;

    return (
        <div className="form-group">
            <label htmlFor={keyName}>
                {t(`creationform.basicview.${keyName}`)}:
                <input type="text" name={keyName} onKeyPress={handleChange} />
            </label>
        </div>
    );
}

export default GenericTagInput;
