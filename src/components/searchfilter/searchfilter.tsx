/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import './searchfilter.scss';

export default function SearchFilter(props: filterProps): JSX.Element {
    const { filtertitle, filtervalues, filterselected, selectFilters } = props;
    const [fselected, setFilterSelected] = useState(filterselected);
    const [open, setOpen] = useState(false);
    const vtype = filtervalues.length > 0;
    const selectFilterValue = (filter: string) => {
        const newselected = fselected.map((fs) => fs);
        const selectedIndex = fselected.findIndex((fs) => fs === filter);
        if (selectedIndex < 0) {
            newselected.push(filter);
        } else {
            newselected.splice(selectedIndex, 1);
        }
        selectFilters(newselected);
        setFilterSelected(newselected);
    };
    const handleOpen = () => {
        if (vtype) {
            if (open) {
                selectFilters(fselected);
            }
        } else {
            setFilterSelected(open ? [] : ['ture']);
            selectFilters(!open);
        }
        setOpen(!open);
    };
    /* const handleSubmit = () => {
        selectFilters(fselected);
        setOpen(false); 
    }
    const handleClear = () => {
        selectFilters("");
        setFilterSelected([]);
        setOpen(false);
    } */
    useEffect(() => {
        setFilterSelected(filterselected);
    }, [filterselected]);

    return (
        <div className={open ? 'filter-wrap open' : 'filter-wrap'}>
            <div className={fselected.length > 0 || open ? 'filterCheck checked' : 'filterCheck'} onClick={() => handleOpen()}>
                <h3 className="filter-title">{filtertitle}</h3>
            </div>
            {vtype && (
                <div className={open ? 'filter-list-wrap open' : 'filter-list-wrap'}>
                    <ul className="list">
                        {filtervalues.map((filter) => {
                            const selected = fselected.findIndex((fs) => fs === filter) > -1;
                            return (
                                <li
                                    key={filter}
                                    className={
                                        selected ? 'filterValue checked d-flex flex-row list-item' : 'filterValue d-flex flex-row list-item'
                                    }
                                    onClick={() => selectFilterValue(filter)}
                                >
                                    <label htmlFor={filter} className="label">
                                        {filter}
                                    </label>
                                    <input type="checkbox" id={filter} name={filter} className="checkbox" />
                                </li>
                            );
                        })}
                        {/* <div className={fselected.length>0?"filterAction":"filterAction disabled"}>
                    <button className="btn searchButton submit" onClick={fselected.length>0?handleSubmit:undefined}>Submit</button>
                    <button className="btn searchButton clear" onClick={fselected.length>0?handleClear:undefined}>Clear</button>
                </div>     */}
                    </ul>
                </div>
            )}
        </div>
    );
}

interface filterProps {
    filtertitle: string;
    filtervalues: string[];
    filterselected: string[];
    selectFilters: (arg: unknown) => void;
}
