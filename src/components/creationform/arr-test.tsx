// This is here as a reference implementation of an array form field
import { useState } from 'react';
import { useForm, useFieldArray, useWatch, Control } from 'react-hook-form';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import Pill from './pill';
import './creation-form.css';

type FormValues = {
    cart: {
        name: string;
        price: number;
        quantity: number;
    }[];
};

const Total = ({ control }: { control: Control<FormValues> }) => {
    const formValues = useWatch({
        name: 'cart',
        control,
    });
    const total = formValues.reduce((acc, current) => acc + (current.price || 0) * (current.quantity || 0), 0);
    return <p>Total Amount: {total}</p>;
};

function ArrTest(): JSX.Element {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            cart: [{ name: 'test dfsaf', quantity: 1, price: 23 }],
        },
        mode: 'onBlur',
    });
    const { fields, append, remove, update } = useFieldArray({
        name: 'cart',
        control,
    });
    const onSubmit = (data: FormValues) => console.log(data);
    const [editMode, setEditMode] = useState(false);
    const [backupName, setBackupName] = useState('');

  function setname (index, field){
    console.log(name)
    console.log(name)
    update(index, field)
  };

    return (
        <div className="creation-form">
            <form onSubmit={handleSubmit(onSubmit)}>
                {fields.map((field, index) => {
                    return (
                        <div key={field.id} className="d-flex align-items-stretch custom-tag">
                          <Pill setname={setname} field={field}/>
                            <div className="mr-auto">
                                <div>
                                    <input
                                        placeholder="name"
                                        {...register(`cart.${index}.name`, {
                                            required: true,
                                        })}
                                        className={errors?.cart?.[index]?.name ? 'error' : ''}
                                    />
                                    <div> </div>
                                </div>
                            </div>
                            {!editMode && (
                                <div
                                    className="icon"
                                    onClick={() => {
                                        setBackupName(field.name);
                                        update(index, field);
                                        setEditMode(!editMode);
                                    }}
                                >
                                    <EditIcon />
                                </div>
                            )}
                            {!editMode && (
                                <span className="icon" onClick={() => remove(index)}>
                                    <ClearIcon />
                                </span>
                            )}
                            {editMode && (
                                <span
                                    className="icon"
                                    onClick={() => {
                                        update(index, field);
                                        setEditMode(!editMode);
                                    }}
                                >
                                    <CheckIcon />
                                </span>
                            )}

                            {editMode && (
                                <span
                                    className="icon"
                                    onClick={() => {
                                        update(index, field);
                                        setEditMode(!editMode);
                                    }}
                                >
                                    <CancelIcon />
                                </span>
                            )}
                        </div>
                    );
                })}

                <Total control={control} />

                <button
                    type="button"
                    onClick={() =>
                        append({
                            name: '',
                            quantity: 0,
                            price: 0,
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
