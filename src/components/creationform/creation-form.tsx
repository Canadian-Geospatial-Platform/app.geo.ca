import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './creation-form.css';
import CreationFormMetadataRecordInformationSection from './metadatarecordinformation/metadata-record-information.tsx'

function CreationForm(): JSX.Element {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        fileidentifier: '',
        datestamp: Date.now(),
        hierarchylevel: '',
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((values) => ({ ...values, [name]: value }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        alert(JSON.stringify(formData));
    };

    return (
        <div className="creation-form">
            <form onSubmit={handleSubmit}>
                <CreationFormMetadataRecordInformationSection formData={formData} handleChange={handleChange} />
                <input type="submit" />
            </form>
        </div>
    );
}

export default CreationForm;
