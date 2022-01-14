import React from 'react';
import { useTranslation } from 'react-i18next';

function Contact(props: any): JSX.Element {
    const { t } = useTranslation();

    return (
        <div>
            <h1>{t('creationform.basicview.contact')}</h1>
            <div className="form-group">
                <label htmlFor="individualname">
                    {t('creationform.basicview.individualname')}:
                    <input type="text" name="individualname" value={props.formData.individualname || ''} onChange={props.handleChange} />
                </label>
            </div>
            <div className="form-group">
                <label htmlFor="governmentofcanadaorganisation">
                    {t('creationform.basicview.governmentofcanadaorganisation')}:
                    <input
                        type="text"
                        name="governmentofcanadaorganisation"
                        value={props.formData.governmentofcanadaorganisation || ''}
                        onChange={props.handleChange}
                    />
                </label>
            </div>
        </div>
    );
}

export default Contact;
