// This is here as a reference implementation of an array form field
import { useState } from 'react';
import { useForm, useFieldArray, useWatch, Control } from 'react-hook-form';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import './creation-form.css';

function Pill({ setname, field, remove, index }): JSX.Element {
    const [editMode, setEditMode] = useState(false);
    const [fieldValue, setFieldValue] = useState(field.name);

    return (
        <div className="d-flex align-items-stretch custom-tag">
            {!editMode && (
                <>
                    <div className="mr-auto">{field.name}</div>
                    <div
                        className="icon"
                        onClick={() => {
                            setEditMode(!editMode);
                        }}
                    >
                        <EditIcon />
                    </div>
                    <span
                        className="icon"
                        onClick={() => {
                            remove(index);
                        }}
                    >
                        <ClearIcon />
                    </span>
                </>
            )}
            {editMode && (
                <>
                    <div className="mr-auto">
                        <input
                            defaultValue={field.name}
                            onChange={(e) => {
                                setFieldValue(e.target.value);
                            }}
                        />
                    </div>
                    <span
                        className="icon"
                        onClick={() => {
                            field.name = fieldValue;
                            setname(index, field);
                            setEditMode(!editMode);
                        }}
                    >
                        <CheckIcon />
                    </span>

                    <span
                        className="icon"
                        onClick={() => {
                            setEditMode(!editMode);
                        }}
                    >
                        <CancelIcon />
                    </span>
                </>
            )}
        </div>
    );
}

export default Pill;
