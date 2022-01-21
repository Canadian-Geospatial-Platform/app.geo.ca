import React from 'react';
import { useForm } from 'react-hook-form';
import './creation-form.css';

function CreationForm(): JSX.Element {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm();

  // Append geojson data to the simple input fields and submit the result to the server
  const onSubmit = (data) => {
    // Simulates adding geojson data from geoview
    data.map = {geojson: "abc", geojs2: "abcdd"}
    console.log(data)
  };

  // Fetch an object from the server and prefil the form with the values. Will allow users to save and reload incomplete forms and view/edit complet ones.
  const loadData = (data) => {
    // Simulates getting data from server and ovewriting field values
    setValue('firstName', 'Value loaded from server')
  }

    return (
        <div className="creation-form">
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register('firstName')} /> {/* register an input */}
                <input {...register('lastName', { required: true })} />
                {errors.lastName && <p>Last name is required.</p>}
                <input {...register('age', { pattern: /\d+/ })} />
                {errors.age && <p>Please enter number for age.</p>}
                <input type="submit" />
            </form>
            <button onClick={loadData}>Load Values from Server</button>
        </div>
    );
}

export default CreationForm;
