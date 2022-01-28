// This is here as a reference implementation of an array form field
import { useState } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import './creation-form.css';

function Pill({ setname, field, remove, index }): JSX.Element {
    const [editMode, setEditMode] = useState(false);
    const [fieldValue, setFieldValue] = useState(field.name);

    const updateName = (e: Event) => {
        e && e.preventDefault();
        field.name = fieldValue;
        setname(index, field);
        setEditMode(!editMode);
    };

    return (
        <div className="d-flex align-items-stretch custom-tag px-3 py-1 m-1">
            {!editMode && (
                <>
                    <div className="mr-auto px-2 my-auto">{field.name}</div>
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
                            autoFocus
                            defaultValue={field.name}
                            onChange={(e) => {
                                setFieldValue(e.target.value);
                            }}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') updateName(e);
                            }}
                        />
                    </div>
                    <span className="icon" onClick={updateName}>
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
