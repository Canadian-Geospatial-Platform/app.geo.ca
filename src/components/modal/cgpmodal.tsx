/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './cgpmodal.scss';

const CgpModal = (props: CgpModalProps) => {
    const { buttonLabel, className, center, wrapClassName, modalClassName, openOnLoad, unmountOnClose } = props;

    const [modal, setModal] = useState(openOnLoad);

    const toggle = () => setModal(!modal);

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
                About the geoSearch application
            </ModalHeader>
            <ModalBody tag="div">
                <p>
                    The geoSearch application uses a map to search data over the area shown. Pan and zoom the map to filter the content
                    based on your area of interest. The results will refresh based on the area of the map.
                </p>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>
                    {buttonLabel}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

interface CgpModalProps {
    buttonLabel: string;
    className: string;
    center: boolean;
    wrapClassName: string;
    modalClassName: string;
    openOnLoad: boolean;
    unmountOnClose: boolean;
}

export default CgpModal;
