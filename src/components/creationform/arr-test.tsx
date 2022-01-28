// This is here as a reference implementation of an array form field
import { useForm, useFieldArray } from 'react-hook-form';
import AddIcon from '@material-ui/icons/Add';
import Pill from './pill';
import './creation-form.css';

type FormValues = {
    tags: {
        name: string;
    }[];
};

function Tags(): JSX.Element {
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
        <div className="vertical-center">
            <form
                className="container"
                onSubmit={(e) => {
                    console.log('sub');
                    e.preventDefault();
                }}
            >
                <div className="row d-flex flex-row align-items-center">
                    <AddIcon className="custom-tag mx-2 my-auto" onClick={() => append({})} />

                    {fields.map((field, index) => {
                        return <Pill key={field.id} index={index} setname={setname} field={field} remove={remove} />;
                    })}
                </div>
                <div className="row">
                    <input type="submit" onClick={handleSubmit(onSubmit)} />
                </div>
            </form>
        </div>
    );
}

export default Tags;
