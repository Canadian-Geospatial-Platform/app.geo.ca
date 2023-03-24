import { useRef, useEffect } from 'react';
//import { render } from 'react-dom';

import { useTranslation } from 'react-i18next';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Card, CardHeader, CardContent, Divider, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { DomEvent } from 'leaflet';
import { ReactJSXLibraryManagedAttributes } from '@emotion/react/types/jsx-namespace';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: 450,
            height: '100%',
            margin: '0px 2px',
            borderRadius: 0,
        },
        avatar: {
            color: '#666666',
            padding: '4px 10px',
        },
    })
);

export default function PanelApp(props: PanelAppProps): JSX.Element {
    const { showing, title, icon, content, closeFunction } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    const panel = useRef();
    useEffect(() => {
        // disable events on container
        DomEvent.disableClickPropagation((panel.current as unknown) as HTMLElement);
        DomEvent.disableScrollPropagation((panel.current as unknown) as HTMLElement);
    }, []);

    // TODO: first draf to open close the custom appbar pnael component. Make this cleaner
    /* if (typeof panel.current !== 'undefined') {
        panel.current.parentElement.style.display = 'block';
    } 
    function closePanel(): void {
    panel.current.parentElement.style.display = 'none';
    } */

    return (
        <Card className={classes.root + (showing ? ' current' : '')} ref={panel}>
            <CardHeader
                className={classes.avatar}
                title={
                    <Typography variant={'h2'} className="panel-title">
                        {t(title)}
                    </Typography>
                }
                avatar={icon}
                action={
                    <IconButton aria-label={t('appbar.close')} onClick={closeFunction}>
                        <CloseIcon />
                    </IconButton>
                }
            />
            <Divider />
            <CardContent>{content}</CardContent>
        </Card>
    );
}

interface PanelAppProps {
    showing?: boolean;
    title: string;
    // eslint-disable-next-line react/require-default-props
    icon?: React.ReactNode;
    content: Element;
    closeFunction: () => void;
}

export interface PanelProps {
    showing: boolean;
    ksOnly?: boolean;
    initKeyword?: string;
    analyticOrg?: number[];
    setKSOnly?: (kso: boolean) => void;
    setKeyword?: (kw: string) => void;
    setAnalyticOrg?: (ao: number[]) => void;
    closeFunction: (cp?: string) => void;
    auth: boolean;
}
