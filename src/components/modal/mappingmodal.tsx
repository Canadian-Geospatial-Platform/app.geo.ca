/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector} from "react-redux";
import { useLocation, useHistory } from 'react-router';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import BeatLoader from "react-spinners/BeatLoader";
import axios from "axios";
import { getQueryParams } from '../../common/queryparams';
import { envglobals } from '../../common/envglobals';
import { loadState } from '../../reducers/localStorage';
import { setMapping } from "../../reducers/action";
import './mappingmodal.scss';

const MappingModal = (props: MappingModalProps) => {
    const { className, center, wrapClassName, modalClassName, openOnLoad, toggle, onClosed, unmountOnClose } = props;
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
        if (location.pathname!=='/map' || queryParams.rvKey) {
            history.push({
                pathname: '/map',
                search: '',
            });
        }
    };

    const getMappingList = () => {
        setLoading(true);
        const promises = [];
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
        <Modal
            isOpen={openOnLoad}
            toggle={toggle}
            className={className}
            wrapClassName={wrapClassName}
            modalClassName={modalClassName}
            centered={center}
            unmountOnClose={unmountOnClose}
            onClosed={onClosed}
            aria-labelledby="modal-heading"
            aria-describedby="modal-description"
        >
            <ModalHeader id="modal-heading" tag="h2" toggle={toggle}>
                {t('modal.mapping.title')}
            </ModalHeader>
            <ModalBody id="modal-description" tag="div">
            {loading ?
                <div className="d-flex justify-content-center status-indicator">
                    <BeatLoader color="#515AA9" />
                </div>
                : 
                (mappingList.length>0 ?
                    mappingList.map((ml: SearchResult, mindex: number) => (
                        <button
                            key={`ml-${mindex}`}
                            type="button"
                            className="btn btn btn-filter"
                            onClick={() => removeMapping(ml.id)}
                        >
                            {ml.title} <i className="fas fa-times" />
                        </button> 
                    ) ) : t('modal.mapping.noadded') )
            }
            </ModalBody>
            <ModalFooter>
                {loadState()!==undefined && loadState().mappingReducer.mapping.length>0 && 
                <Button color="secondary" onClick={gotoMyMap}>
                    {t('modal.mapping.gotomymap')}
                </Button> }
                <Button color="secondary" onClick={toggle}>
                    {t('modal.mapping.cancel')}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

interface MappingModalProps {
    className: string;
    center: boolean;
    wrapClassName: string;
    modalClassName: string;
    openOnLoad: boolean;
    toggle: any;
    onClosed: any;
    unmountOnClose: boolean;
}

interface SearchResult {
    id: string;
    title: string;
    error?: unknown;
}

export default MappingModal;
