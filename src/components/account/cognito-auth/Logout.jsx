import React from 'react';
import PropTypes from 'prop-types';
import { Action } from 'react-cognito';
import { useStore } from 'react-redux';
import LogoutButton from './LogoutButton';
 
/**
 * Container for logout behaviour.
 * @example
 * <Logout onLogout={handler}>
 *   <LogoutForm />
 * </Logout>
 */
const Logout = (props) => {
 
  /**
   * Passed to child element as onClick prop.
   * Signs the user out, and then dispatches the logout action
   * If you want to take further actions (like reloading UI) then add an
   * onLogout property to the Logout element
   */
  const store = useStore();
  const onClick = (event) => {
    //const { store } = this.context;
    //console.log(store);
    const state = store.getState();
    state.cognito.user.signOut();
    event.preventDefault();
    store.dispatch(Action.logout());
    props.onLogout();
  }
 
  /**
   * renders the child element, adding an onClick property
   */
    return <LogoutButton onClick={onClick} />
}
/*Logout.contextTypes = {
  store: PropTypes.object,
};*/
Logout.propTypes = {
  //children: PropTypes.any.isRequired,
  onLogout: PropTypes.func,
};
Logout.defaultProps = {
  onLogout: () => {},
};

export default Logout;