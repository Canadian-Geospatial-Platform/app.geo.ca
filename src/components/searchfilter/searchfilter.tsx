/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
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

    useEffect(() => {
        setFilterSelected(filterselected);
    }, [filterselected]);

    return vtype ? (
        <div className={open ? 'filter-wrap open' : 'filter-wrap'}>
            <button type="button" className="link-button filter-title" onClick={() => handleOpen()}>
                {filtertitle}
            </button>
            <div className="filter-list-wrap">
                <ul className="list">
                    {filtervalues.map((filter: string, findex: number) => {
                        const selected = fselected.findIndex((fs) => fs === findex) > -1;
                        return (
                            <li
                                key={filter}
                                className={
                                    selected
                                        ? 'filterValue checked d-flex flex-row align-items-start list-item'
                                        : 'filterValue d-flex flex-row align-items-start list-item'
                                }
                                onClick={() => selectFilterValue(findex)}
                            >
                                <label htmlFor={filter} className="label">
                                    {filter}
                                </label>
                                <input type="checkbox" className="checkbox" checked={selected} />
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    ) : (
        <div className="filter-list-wrap">
            <ul className="list">
                <li
                    className={
                        fselected.length > 0
                            ? 'filterValue checked d-flex flex-row align-items-start list-item'
                            : 'filterValue d-flex flex-row align-items-start list-item'
                    }
                    onClick={() => handleOpen()}
                >
                    <label htmlFor={filtertitle} className="label">
                        {filtertitle}
                    </label>
                    <input type="checkbox" className="checkbox" checked={fselected.length > 0} />
                </li>
            </ul>
        </div>
    );
}

interface filterProps {
    filtertitle: string;
    filtervalues: string[];
    filterselected: number[];
    selectFilters: (arg: unknown) => void;
}
