import { render } from 'react-dom';
import { Provider } from 'react-redux';
import AccountIcon from '@material-ui/icons/AccountBox';

import { useMap } from 'react-leaflet';

import AccountPanel from '../../account/account-panel';
import ButtonApp from '../button';

import { setupCognito, cognito } from 'react-cognito';
import { combineReducers, createStore } from 'redux';
import config from '../../account/cognito-auth/config.json';

const reducers = combineReducers({
    cognito,
});

//let store = createStore(reducers);
let store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
//config.group = 'admins'; // Uncomment this to require users to be in a group 'admins'
setupCognito(store, config);

export default function Account(): JSX.Element {
    const map = useMap();
    
    function handleclick() {
        render(<Provider store={store}><AccountPanel /></Provider>, map.getContainer().getElementsByClassName('cgp-apppanel')[0]);
    }

    return <ButtonApp tooltip="appbar.account" icon={<AccountIcon />} onClickFunction={handleclick} />;
}
