// This is here as a reference implementation of an array form field
import * as React from 'react';
import { useForm, useFieldArray, useWatch, Control } from 'react-hook-form';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
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
            cart: [{ name: 'test', quantity: 1, price: 23 }],
        },
        mode: 'onBlur',
    });
    const { fields, append, remove } = useFieldArray({
        name: 'cart',
        control,
    });
    const onSubmit = (data: FormValues) => console.log(data);

    return (
        <div className="creation-form">
            <form onSubmit={handleSubmit(onSubmit)}>
                {fields.map((field, index) => {
                    return (
                        <div className="d-flex align-items-stretch custom-tag">
    <div className="mr-auto">
                        <div className="" key={field.id}>
                            <div key={field.id}>
                                <input
                                    placeholder="name"
                                    {...register(`cart.${index}.name` as const, {
                                        required: true,
                                    })}
                                    className={errors?.cart?.[index]?.name ? 'error' : ''}
                                />
                                <div>                        </div>
                        </div>
                        </div>
                        </div>
                                <div className="icon" onClick={() => remove(index)}>
                                  <EditIcon className="align-middle"/>
                                </div>
                                <span className="icon" onClick={() => remove(index)}>
                                <ClearIcon className="align-middle"/>
                                </span>
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
