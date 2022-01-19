// This file should be modified to use the generic components available
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

function CreationFormMetadataRecordInformationSection(props): JSX.Element {
    const { t } = useTranslation();

    return (
        <div>
            <h1>{t('creationform.basicview.metadatarecordinformation')}</h1>
            <div className="form-group">
                <label>
                    {t('creationform.basicview.fileidentifier')}:
                    <input type="text" name="fileidentifier" value={props.formData.fileidentifier || ''} onChange={props.handleChange} />
                </label>
            </div>
            <div className="form-group">
                <label>
                    {t('creationform.basicview.datestamp')}:
                    <input type="text" name="datestamp" value={props.formData.datestamp || ''} onChange={props.handleChange} />
                </label>
            </div>

            <div className="form-group">
                <label>
                    {t('creationform.basicview.hierarchylevel')}:
                    <input type="text" name="hierarchylevel" value={props.formData.hierarchylevel || ''} onChange={props.handleChange} />
                </label>
            </div>
        </div>
    );
}

export default CreationFormMetadataRecordInformationSection;
