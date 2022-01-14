import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './creation-form.css';

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
                <h2>{t('nav.home')}</h2>
                <div className="form-group">
                    <label>
                        File Identifier:
                        <input type="text" name="fileidentifier" value={formData.fileidentifier || ''} onChange={handleChange} />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Hierarchy Level:
                        <input type="text" name="hierarchylevel" value={formData.hierarchylevel || ''} onChange={handleChange} />
                    </label>
                </div>
                <input type="submit" />
            </form>
        </div>
    );
}

export default CreationForm;
