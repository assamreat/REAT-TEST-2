import axios from 'axios';
import { GET_PAYMENT, PAYMENT_ERROR } from './types';

export const getPayment = (id) => async (dispatch) => {
    try {
        const res = await axios.get(`/payment/${id}`);

        dispatch({
            type: GET_PAYMENT,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: PAYMENT_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};
