/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import './searchfilter.scss';

export default function SearchFilter(props: filterProps): JSX.Element {
    const { filtertitle, filtervalues, filterselected, selectFilters, singleselect } = props;
    const [fselected, setFilterSelected] = useState(singleselect?[filterselected[0]]:filterselected);
    const [open, setOpen] = useState(false);
    const vtype = filtervalues.length > 0;
    const filterShowing = filtervalues.map(
        (f:string, i:number) => {
          return {"filter": f, "findex": i};
        }).sort(
         (a, b) => { 
            return a.filter.toLowerCase().localeCompare(b.filter.toLowerCase());
         });
    const selectFilterValue = (findex: number) => {
        const newselected = fselected.map((fs) => fs);
        const selectedIndex = fselected.findIndex((fs) => fs === findex);
        if (selectedIndex < 0) {
            if (singleselect) {
                newselected.splice(0,1);
            }
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
            {filtertitle !== "" && <button type="button" className="link-button filter-title" aria-expanded={open ? 'true' : 'false'} onClick={() => handleOpen()}>
                {filtertitle}
            </button> }
            <div className="filter-list-wrap">
                <ul className="list">
                    {filterShowing.map((f: {filter: string, findex: number}) => {
                        const selected = fselected.findIndex((fs) => fs === f.findex) > -1;
                        const inputID = `filter-${filtertitle.replace(/ /g, '-').toLowerCase()}-${f.findex}`; // create valid html ids for each label/input pair (lowercase is optional)
                        return (
                            <li
                                key={`filter-${f.findex}`}
                                className={
                                    selected
                                        ? 'filterValue checked d-flex flex-row align-items-start list-item'
                                        : 'filterValue d-flex flex-row align-items-start list-item'
                                }
                            >
                                <label htmlFor={inputID} className="label">
                                    {f.filter}
                                </label>
                                <input
                                    id={inputID}
                                    type="checkbox"
                                    className="checkbox"
                                    checked={selected}
                                    onChange={() => selectFilterValue(f.findex)}
                                />
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    ) : (
        <div className="filter-list-wrap">
            <ul className="list single">
                <li
                    className={
                        fselected.length > 0
                            ? 'filterValue checked d-flex flex-row align-items-start list-item'
                            : 'filterValue d-flex flex-row align-items-start list-item'
                    }
                >
                    <label htmlFor={filtertitle.replace(/ /g, '-').toLowerCase()} className="label">
                        {filtertitle}
                    </label>
                    <input
                        id={filtertitle.replace(/ /g, '-').toLowerCase()}
                        type="checkbox"
                        className="checkbox"
                        checked={fselected.length > 0}
                        onChange={handleOpen}
                    />
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
    singleselect?: boolean;
}
