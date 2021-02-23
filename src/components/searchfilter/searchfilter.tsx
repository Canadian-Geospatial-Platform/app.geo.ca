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
    const selectFilterValue = (findex: number) => {
        const newselected = fselected.map((fs) => fs);
        const selectedIndex = fselected.findIndex((fs) => fs === findex);
        if (selectedIndex < 0) {
            newselected.push(findex);
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
            setFilterSelected(open ? [] : [1]);
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
        <div className="filterContainer">
            <div className={fselected.length > 0 || open ? 'filterCheck checked' : 'filterCheck'} onClick={() => handleOpen()}>
                <div className="checkBox" />
                <div className="filterTitle">{filtertitle}</div>
            </div>
            {vtype && (
                <div className={open ? 'filterList open' : 'filterList'}>
                    {filtervalues.map((filter, findex: number) => {
                        const selected = fselected.findIndex((fs) => fs === findex) > -1;
                        return (
                            <div
                                key={filter}
                                className={selected ? 'filterValue checked' : 'filterValue'}
                                onClick={() => selectFilterValue(findex)}
                            >
                                <div className="checkBox" />
                                <div className="value">{filter}</div>
                            </div>
                        );
                    })}
                    {/* <div className={fselected.length>0?"filterAction":"filterAction disabled"}>
                    <button className="btn searchButton submit" onClick={fselected.length>0?handleSubmit:undefined}>Submit</button>
                    <button className="btn searchButton clear" onClick={fselected.length>0?handleClear:undefined}>Clear</button>
                </div>     */}
                </div>
            )}
        </div>
    );
}

interface filterProps {
    filtertitle: string;
    filtervalues: string[];
    filterselected: number[];
    selectFilters: (arg:unknown) => void;
}
