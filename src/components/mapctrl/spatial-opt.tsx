import { Fade, Tooltip } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

interface SpatialOptProps {
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export function SpatialOpt(props: SpatialOptProps): JSX.Element {
    const { checked, onChange } = props;
    const { t } = useTranslation();
    const onDoubleClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
    };
    //const newButton = useRef();
    /*
    useEffect(() => {
        // disable events on container
        DomEvent.disableClickPropagation(newButton.current.children[0] as HTMLElement);
        DomEvent.disableScrollPropagation(newButton.current.children[0] as HTMLElement);
    }, []);*/
    return (
        <Tooltip title={t('filter.label.spatial.opt-tooltip')} placement="left" TransitionComponent={Fade}>
            <div className="leaflet-control-spatial-opt" style={{ border: 'none', borderRadius: 3, height: 30 }}>
                <p>
                    <label htmlFor="spatial-opt" style={{ marginLeft: 2, marginRight: 3, marginBottom: 0 }}>
                        <input
                            ref={(node) => {
                                if (node) {
                                    node.style.setProperty('width', '15px', 'important');
                                    node.style.setProperty('height', '15px', 'important');
                                }
                            }}
                            style={{ verticalAlign: 'middle', marginRight: 5 }}
                            id="spatial-opt"
                            type="checkbox"
                            defaultChecked={checked}
                            onChange={onChange}
                            onDoubleClick={onDoubleClick}
                        />
                        {t('filter.label.spatial.opt')}
                    </label>
                </p>
            </div>
        </Tooltip>
    );
}
