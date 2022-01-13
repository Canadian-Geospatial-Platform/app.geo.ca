import React, { useState } from 'react';
import './creation-form.css';

function CreationForm() {
  const [formData, setFormData] = useState({
      fileidentifier: "",
      age: 0
  });
   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(values => ({...values, [name]: value}))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert(JSON.stringify(formData));
  }
 
  return (
    <div className="creation-form">
    <form onSubmit={handleSubmit}>
    <h2>Indentification</h2>
    <div className="form-group">
      <label>File Identifier:
      <input 
        type="text" 
        name="fileidentifier" 
        value={formData.fileidentifier || ""} 
        onChange={handleChange}
      />
      </label>
    </div>
    <div className="form-group">
      <label>Enter your age:
        <input 
          type="number" 
          name="age" 
          value={formData.age || ""} 
          onChange={handleChange}
        />
        </label>
      </div>
        <input type="submit" />
    </form>
    </div>
  );
}

export default CreationForm;
