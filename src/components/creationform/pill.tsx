// This is here as a reference implementation of an array form field
import { useState } from 'react';
import { useForm, useFieldArray, useWatch, Control } from 'react-hook-form';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import './creation-form.css';

function Pill(props): JSX.Element {
  const [editMode, setEditMode] = useState(false);
  const [backupName, setBackupName] = useState('');

    return (
       <div className="d-flex align-items-stretch custom-tag">
          <div className="mr-auto">
              <div>
                  {props.name}
                  <input
                      placeholder="name"
                  />
                  <div> </div>
              </div>
          </div>
          {!editMode && (
            <>
              <div
                  className="icon"
                  onClick={() => {
                      setBackupName(props.name);
                      setEditMode(!editMode);
                  }}
              >
                  <EditIcon />
              </div>
              <span className="icon" >
                  <ClearIcon />
              </span>
            </>
          )}
          {editMode && (
            <>
              <span
                  className="icon"
                  onClick={() => {
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
      </div>)
}

export default Pill;
