import React, { useState } from 'react';
import './creation-form.css';
import GenericTextInput from './generictextinput/generic-text-input';
import GenericSelectInput from './genericselectinput/generic-select-input';
import GenericTagInput from './generictaginput/generic-tag-input';

function CreationForm(): JSX.Element {
    const [formData, setFormData] = useState({
        fileidentifier: '',
        datestamp: Date.now(),
        hierarchylevel: '',
        generictext: '',
        genericselect: '',
        generictag: [{key: 't1'}, {key: 't2'}],
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((values) => ({ ...values, [name]: value }));
    };

    const handleArrayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, keyCode } = event.target;
        const { charCode } = event;
        
        if (charCode === 13)
        setFormData((values) => ({ ...values, [name]: formData.[name].concat(({key: value})) }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        /* eslint-disable */ alert(JSON.stringify(formData)); /* eslint-enable */
    };

    const selectvalues=["avc", "dvc"];

    return (
        <div className="creation-form">
                <GenericTextInput formData={formData} handleChange={handleChange} keyName="generictext" />
                <GenericSelectInput
                    formData={formData}
                    handleChange={handleChange}
                    keyName="genericselect"
                    values={selectvalues}
                />
                <GenericTagInput formData={formData} handleChange={handleArrayChange} keyName="generictag" />
                <button onClick={handleSubmit}>asdf</button>
        </div>
    );
}

export default CreationForm;
