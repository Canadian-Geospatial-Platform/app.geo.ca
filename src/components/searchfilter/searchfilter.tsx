import React, {useState} from 'react';
import './searchfilter.scss';

const filtertypes = [
    {"start":"^", "end":"$", "sep":"|"},
    {"start":"", "end":"", "sep":","},
];
export default function SearchFilter(props:filterProps): JSX.Element {
    const {filtertitle, filtervalues, filterselected, filtertype, selectFilters} = props;
    const fo = filtertypes[filtertype?filtertype:0];
    const [fselected, setFilterSelected] = useState(filterselected.length>2 ? filterselected.substring(fo.start.length,filterselected.length-fo.start.length-fo.end.length).split(fo.end+fo.sep+fo.start) : []);
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
            selectFilters(fselected.length>0 ? fselected.map(fs=>fo.start+fs+fo.end).join(fo.sep):"");  
        }
        setOpen(!open);
    }
    const handleSubmit = () => {
        selectFilters(fselected.map(fs=>fo.start+fs+fo.end).join(fo.sep));
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
    filtertype?: number;
    selectFilters: Function; 
}