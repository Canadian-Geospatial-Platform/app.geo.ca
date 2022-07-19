import { useLocation, useHistory } from 'react-router';
import KeywordSearchIcon from '@material-ui/icons/Search';

import ButtonApp from '../button';

export default function KeywordSearch(): JSX.Element {
    const location = useLocation();
    const history = useHistory();

    return (
        <ButtonApp
            tooltip="appbar.keywordsearch"
            icon={<KeywordSearchIcon />}
            onClickFunction={() => history.push(`/search${location.search}`)}
        />
    );
}
