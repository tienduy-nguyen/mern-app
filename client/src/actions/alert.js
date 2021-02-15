import { v4 as uuidv4 } from 'uuid';
import * as Types from '../constants/types';

export const setAlert = (msg, alertType) => {
  return (dispatch) => {
    const id = uuidv4();
    dispatch({
      type: Types.SET_ALERT,
      payload: { msg, alertType, id },
    });

    setTimeout(() => dispatch({ type: Types.REMOVE_ALERT, payload: id }), 5000);
  };
};
