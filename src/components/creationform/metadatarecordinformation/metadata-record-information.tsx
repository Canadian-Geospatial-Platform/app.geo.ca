import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

function CreationFormMetadataRecordInformationSection(props): JSX.Element {
    const { t } = useTranslation();

    return (
        <div>
                <h2>{t('nav.home')}</h2>
                <div className="form-group">
                    <label>
                        File Identifier:
                        <input type="text" name="t2" value={props.formData.t2 || ''} onChange={props.handleChange} />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Hierarchy Level:
                        <input type="text" name="t1" value={props.formData.t1 || ''} onChange={props.handleChange} />
                    </label>
                </div>
        </div>
    );
}

export default CreationFormMetadataRecordInformationSection;
