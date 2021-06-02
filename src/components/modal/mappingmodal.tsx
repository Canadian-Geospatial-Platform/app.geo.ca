/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector} from "react-redux";
import { useLocation, useHistory } from 'react-router';
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import BeatLoader from "react-spinners/BeatLoader";
import axios from "axios";
import { getQueryParams } from '../../common/queryparams';
import { envglobals } from '../../common/envglobals';
import { loadState } from '../../reducers/localStorage';
import { setMapping } from "../../reducers/action";
import './mappingmodal.scss';

const MappingModal = (props: MappingModalProps) => {
    const { className, wrapClassName, modalClassName, openOnLoad, toggle, onClosed } = props;
    const history = useHistory();
    const location = useLocation();
    const { t } = useTranslation();
    const mapping = useSelector(state=>state.mappingReducer.mapping);
    const dispatch = useDispatch();
    const queryParams: { [key: string]: string } = getQueryParams(location.search);
    const language = t("app.language");

    const [mappingList, setMappingList] = useState([]);
    const [loading, setLoading] = useState(false);

    const removeMapping = (mid:string) => {
        const localmapping = loadState()!==undefined ? loadState().mappingReducer.mapping : [];
        const newMapping = localmapping.filter((m:string) => m!==mid);
        dispatch(setMapping(newMapping));
        onClosed();
    };
    const gotoMyMap = () => {
        toggle();
        if (location.pathname!=='/map') {
            history.push({
                pathname: '/map',
                search: '',
            });
        } else if ( queryParams.rvKey ) {
            window.location.href="/map";
        } else {
            window.location.reload();
        }    
    };

    const gotoView = (id: string) => {
        window.open(`/result?id=${encodeURI(id.trim())}&lang=${language}`, `_blank`);
    };

    const getMappingList = () => {
        setLoading(true);
        const promises = [];
        if (loadState()!==undefined && loadState().mappingReducer && loadState().mappingReducer.mapping && Array.isArray(loadState().mappingReducer.mapping)) {
            loadState().mappingReducer.mapping.forEach((mid: string)=>{
                const searchParams = {
                    id: mid,
                    lang: language,
                };
                promises.push(
                    axios.get(`${envglobals().APP_API_DOMAIN_URL}/id`, { params: searchParams})
                    .then(response => response.data)
                    .then((data) => {
                        const res = data.Items[0];
                        return {id:res.id, title: res.title };
                    })
                    .catch(error=>{
                        return {id:'', title: '', error };
                    })
                );
            });
        }    
        const result = Promise.all(promises);
        result.then(
            (mlist: SearchResult[]) => {
               setMappingList(mlist); 
               setLoading(false);
            }
        ); 
        return result;
    };

    useEffect(() => { getMappingList() }, [openOnLoad, mapping, language]);    
    // console.log(mappingList);
    return (
        <div tabIndex="-1" style={{position: "fixed", zIndex: "1050", display: openOnLoad?"block":"none"}}>
            <div className={wrapClassName}>
                <div className={`modal ${modalClassName} fade show`} role="dialog" tabIndex="-1" style={{display: openOnLoad?"block":"none"}}>
                    <div aria-labelledby="modal-heading" aria-describedby="modal-description" className={`modal-dialog ${className} modal-dialog-centered`} role="document">
                        <div className="modal-content">
                            <div id="modal-heading" className="modal-header">
                                <h2 className="modal-title">
                                    {t('modal.mapping.title')}
                                </h2>
                                <button type="button" className="close" aria-label="Close" onClick={toggle}><span aria-hidden="true">×</span></button>
                            </div>
                            <div id="modal-description" className="modal-body">
                            {loading ?
                                <div className="d-flex justify-content-center status-indicator">
                                    <BeatLoader color="#515AA9" />
                                </div>
                                : 
                                (mappingList.length>0 ?
                                    mappingList.map((ml: SearchResult, mindex: number) => (
                                        <div key={`ml-${mindex}`} className="mapping-list-item">
                                            <button  className="btn link-button" type="button" onClick={() => gotoView(ml.id)}>{ml.title}</button> 
                                            <button  className="btn" type="button" onClick={() => removeMapping(ml.id)}><i className="fas fa-times" /></button>
                                        </div> 
                                    ) ) : t('modal.mapping.noadded') )
                            }
                        </div>
                        <div className="modal-footer">
                        {loadState()!==undefined && loadState().mappingReducer.mapping.length>0 && !loading &&
                            <button  type="button" className="btn btn-secondary" onClick={gotoMyMap}>
                                {t('modal.mapping.gotomymap')}
                            </button> }
                            <button type="button" className="btn btn-secondary" onClick={toggle}>{t('modal.mapping.cancel')}</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show" />
        </div>
        </div>
    );
};

interface MappingModalProps {
    className: string;
    wrapClassName: string;
    modalClassName: string;
    openOnLoad: boolean;
    toggle: any;
    onClosed: any;
}

interface SearchResult {
    id: string;
    title: string;
    error?: unknown;
}

export default MappingModal;
