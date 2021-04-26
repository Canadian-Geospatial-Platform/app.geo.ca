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

    let cgpShowModal = localStorage.getItem('cgp-show-modal');
    if (cgpShowModal !== null) {
        localStorage.setItem('cgp-show-modal', 'false');
        return;
    }

    return (
        <Modal
            isOpen={modal}
            toggle={toggle}
            className={className}
            wrapClassName={wrapClassName}
            modalClassName={modalClassName}
            centered={center}
            unmountOnClose={unmountOnClose}
        >
            <ModalHeader tag="h2" toggle={toggle}>
                {t('modalhome.title')}
            </ModalHeader>
            <ModalBody tag="div">
                <p>{t('modalhome.description')}</p>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>
                    {t('modalhome.buttonlabel')}
                </Button>
            </ModalFooter>
        </Modal>
    );
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
