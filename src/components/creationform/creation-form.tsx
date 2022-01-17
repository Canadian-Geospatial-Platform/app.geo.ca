import React, { useState } from 'react';
import './creation-form.css';
import CreationFormMetadataRecordInformationSection from './metadatarecordinformation/metadata-record-information';
import Contact from './contact/contact';
import GenericTextInput from './generictextinput/generic-text-input';

function CreationForm(): JSX.Element {
    const [formData, setFormData] = useState({
        fileidentifier: '',
        datestamp: Date.now(),
        hierarchylevel: '',
        generic: '',
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((values) => ({ ...values, [name]: value }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        /* eslint-disable */ alert(JSON.stringify(formData)); /* eslint-enable */
    };

    return (
        <div className="creation-form">
            <form onSubmit={handleSubmit}>
                <CreationFormMetadataRecordInformationSection formData={formData} handleChange={handleChange} />
                <Contact formData={formData} handleChange={handleChange} />
                <GenericTextInput formData={formData} handleChange={handleChange} keyname="generic" keyvalue={formData.generic} />
                <input type="submit" />
            </form>
        </div>
    );
}

export default CreationForm;
