import React, {useState} from 'react';
import './searchfilter.scss';

export default function SearchFilter(props:filterProps): JSX.Element {
    const {filtertitle, filtervalues, filterselected, selectFilters} = props;
    const [fselected, setFilterSelected] = useState(filterselected.length>2 ? filterselected.substring(1,filterselected.length-2).split("$|^") : []);
    const [open, setOpen] = useState(false);
    const selectFilterValue = (filter: string) => {
        const newselected = fselected.map(fs=>fs);
        const selectedIndex = fselected.findIndex( fs => fs === filter);
        if (selectedIndex < 0) {
            newselected.push(filter);
        } else {
            newselected.splice(selectedIndex, 1);
        }
        setFilterSelected(newselected);
    }
    const handleOpen = () => {
        if (open) {
            selectFilters(fselected.length>0 ? fselected.map(fs=>'^'+fs+'$').join("|"):"");  
        }
        setOpen(!open);
    }
    const handleSubmit = () => {
        selectFilters(fselected.map(fs=>'^'+fs+'$').join("|"));
        setOpen(false); 
    }
    const handleClear = () => {
        selectFilters("");
        setFilterSelected([]);
        setOpen(false);
    }
    return (
        <div className="filterContainer">
            <div className={fselected.length>0 || open ? "filterCheck checked": "filterCheck"} onClick={() => handleOpen()}>
                <div className="checkBox"></div>
                <div className="filterTitle">{filtertitle}</div>
            </div>
            <div className={open?"filterList open":"filterList"}>
            {filtervalues.map(filter=>{
                const selected = (fselected.findIndex( fs => fs === filter) > -1);
                return (
                    <div key={filter}
                        className = {selected? "filterValue checked" : "filterValue"}
                        onClick = {()=>selectFilterValue(filter)}
                    >
                        <div className="checkBox"></div>
                        <div className="value">{filter}</div>
                    </div>
                )})}
                <div className={fselected.length>0?"filterAction":"filterAction disabled"}>
                    <button className="btn searchButton submit" onClick={fselected.length>0?handleSubmit:undefined}>Submit</button>
                    <button className="btn searchButton clear" onClick={fselected.length>0?handleClear:undefined}>Clear</button>
                </div>    
            </div>
        </div>
    )
}

interface filterProps {
    filtertitle: string;
    filtervalues: string[];
    filterselected: string;
    selectFilters: Function; 
}