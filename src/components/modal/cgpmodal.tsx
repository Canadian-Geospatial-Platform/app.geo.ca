/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import './cgpmodal.scss';

const CgpModal = (props: CgpModalProps) => {
    const { className, center, wrapClassName, modalClassName, openOnLoad, unmountOnClose } = props;
    const [modal, setModal] = useState(openOnLoad);
    const { t } = useTranslation();
    const toggle = () => setModal(!modal);
    // Local Storage
    let setLocalStorage = () => {
        if (sessionStorage.getItem('cgp-modal-shown') === null) {
            sessionStorage.setItem('cgp-modal-shown', 'true');
        }
    };
    let getLocalStorage = () => {
        let cgpModalShown = sessionStorage.getItem('cgp-modal-shown');
        return cgpModalShown === 'true' ? false : true;
    };
    if (getLocalStorage()) {
        return (
            <Modal
                isOpen={modal}
                toggle={toggle}
                className={className}
                wrapClassName={wrapClassName}
                modalClassName={modalClassName}
                centered={center}
                unmountOnClose={unmountOnClose}
                onClosed={setLocalStorage}
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

interface CgpModalProps {
    className: string;
    center: boolean;
    wrapClassName: string;
    modalClassName: string;
    openOnLoad: boolean;
    unmountOnClose: boolean;
}

export default CgpModal;
