import React, { useState } from 'react';
import './creation-form.css';

function CreationForm() {
  const [formData, setFormData] = useState({})
   const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(values => ({...values, [name]: value}))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(JSON.stringify(formData));
  }
 
  return (
    <div className="creation-form form-group">
    <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label>Enter your name:
      <input 
        type="text" 
        name="username" 
        value={formData.username || ""} 
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
