import React, { useState } from 'react';
import './creation-form.css';
import CreationFormMetadataRecordInformationSection from './metadatarecordinformation/metadata-record-information';
import Contact from './contact/contact';
import GenericTextInput from './generictextinput/generic-text-input';
import GenericSelectInput from './genericselectinput/generic-select-input';

function CreationForm(): JSX.Element {
    const [formData, setFormData] = useState({
        fileidentifier: '',
        datestamp: Date.now(),
        hierarchylevel: '',
        generictext: '',
        genericselect: '',
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
                <GenericTextInput formData={formData} handleChange={handleChange} keyName="generictext" keyValue={formData.generictext} />
                <GenericSelectInput
                    formData={formData}
                    handleChange={handleChange}
                    keyName="genericselect"
                    keyValue={formData.genericselect}
                />
                <input type="submit" />
            </form>
        </div>
    );
}

export default CreationForm;
