// This is here as a reference implementation of an array form field
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import Pill from './pill';
import './creation-form.css';

type FormValues = {
    tags: {
        name: string;
    }[];
};

function ArrTest(): JSX.Element {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            tags: [],
        },
    });
    const { fields, append, remove, update } = useFieldArray({
        name: 'tags',
        control,
    });
    const onSubmit = (data: FormValues) => console.log(data);

    function setname(index, field) {
        update(index, field);
    }

    return (
        <div className="creation-form">
            <form onSubmit={handleSubmit(onSubmit)}>
                {fields.map((field, index) => {
                    return (
                        <div key={field.id} className="d-flex align-items-stretch custom-tag">
                            <Pill index={index} setname={setname} field={field} remove={remove} />
                        </div>
                    );
                })}

                <button
                    type="button"
                    onClick={() =>
                        append({
                            name: '',
                        })
                    }
                >
                    APPEND
                </button>
                <input type="submit" />
            </form>
        </div>
    );
}

export default ArrTest;
