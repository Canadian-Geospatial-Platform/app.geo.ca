/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import './infomodal.scss';

const InfoModal = (props: InfoModalProps) => {
    const { className, center, wrapClassName, modalClassName, onClose, title, infotext, openOnLoad } = props;
    const [modal, setModal] = useState(openOnLoad);
    const { t } = useTranslation();
    const toggle = () => setModal(!modal);
    return (
        <Modal
            isOpen={modal}
            toggle={toggle}
            className={className}
            wrapClassName={wrapClassName}
            modalClassName={modalClassName}
            centered={center}
            onClosed={onClose}
            aria-labelledby="modal-heading"
            aria-describedby="modal-description"
        >
            <ModalHeader id="modal-heading" tag="h2" toggle={toggle}>
                {title}
            </ModalHeader>
            <ModalBody id="modal-description" tag="div">
                <p>{infotext}</p>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>
                    {t('modal.buttonlabel')}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

interface InfoModalProps {
    className: string;
    center: boolean;
    wrapClassName: string;
    modalClassName: string;
    title: string;
    infotext: string;
    openOnLoad: boolean;
    onClose: any;
}

export default InfoModal;
