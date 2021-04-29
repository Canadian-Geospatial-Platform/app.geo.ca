/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState } from 'react';
import { StoreEnhancer } from 'redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { loadState } from '../../reducers/localStorage';
import './mappingmodal.scss';

const MappingModal = (props: MappingModalProps) => {
    const { className, center, wrapClassName, modalClassName, openOnLoad, unmountOnClose } = props;
    const [modal, setModal] = useState(openOnLoad);
    const { t } = useTranslation();
    const toggle = () => setModal(!modal);
    const localState: StoreEnhancer<unknown, unknown> | undefined = loadState();
    const mapping = localState !== undefined ? localState.mappingReducer.mapping : []
    
    if (mapping.length>0) {
        return (
            <Modal
                isOpen={modal}
                toggle={toggle}
                className={className}
                wrapClassName={wrapClassName}
                modalClassName={modalClassName}
                centered={center}
                unmountOnClose={unmountOnClose}
                onClosed={undefined}
                aria-labelledby="modal-heading"
                aria-describedby="modal-description"
            >
                <ModalHeader id="modal-heading" tag="h2" toggle={toggle}>
                    {t('modalhome.title')}
                </ModalHeader>
                <ModalBody id="modal-description" tag="div">
                    <p>{t('modalhome.description')}</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggle}>
                        {t('modalhome.buttonlabel')}
                    </Button>
                </ModalFooter>
            </Modal>
        );
    } else {
        return null;
    }
};

interface MappingModalProps {
    className: string;
    center: boolean;
    wrapClassName: string;
    modalClassName: string;
    openOnLoad: boolean;
    unmountOnClose: boolean;
}

export default MappingModal;
