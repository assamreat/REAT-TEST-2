import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { getPayment } from '../../actions/payment';

import { buf } from 'crc-32';
import axios from 'axios';

const ConfirmPayment = ({ getPayment, match, payment: { payment } }) => {
    useEffect(() => {
        const { id } = match.params;
        getPayment(id);
    }, []);

    const initiatePayment = async () => {
        const messageType = '0100';
        const merchantId = process.env.REACT_APP_MERCHANT_ID;
        const serviceId = process.env.REACT_APP_SERVICE_ID;
        const orderId = payment.order_id;
        const customerId = '1000001';
        const transactionAmount = 1000.0;
        const currencyCode = 'INR';
        const secretKey = process.env.REACT_APP_NSDL_KEY;
        const successUrl = 'http://test.areatappeal.in/paymentSuccess';
        const failUrl = 'http://test.areatappeal.in/paymentFail';
        const additionalField1 = 'example@gmail.com';
        const additionalField2 = 'example@gmail.com';
        const additionalField3 = 'example@gmail.com';
        const additionalField4 = 'example@gmail.com';
        const additionalField5 = 'example@gmail.com';

        const date = new Date();
        const requestDateTime =
            ('00' + date.getDate()).slice(-2) +
            '-' +
            ('00' + (date.getMonth() + 1)).slice(-2) +
            '-' +
            date.getFullYear() +
            ' ' +
            ('00' + date.getHours()).slice(-2) +
            ':' +
            ('00' + date.getMinutes()).slice(-2) +
            ':' +
            ('000' + date.getMilliseconds()).slice(-3);

        const message = `${messageType}|${merchantId}|${serviceId}|${orderId}|${customerId}|${transactionAmount}|${currencyCode}|${requestDateTime}|${successUrl}|${failUrl}|${additionalField1}|${additionalField2}|${additionalField3}|${additionalField4}|${additionalField5}`;

        const generateCRC32Checksum = (message, secretKey) => {
            const msg = message + '|' + secretKey;

            // get bytes array
            const enc = new TextEncoder();
            const bytesArray = enc.encode(msg);

            const checksum = buf(bytesArray);

            return checksum;
        };

        const checksum = generateCRC32Checksum(message, secretKey);

        const paymentData = {
            messageType: messageType,
            merchantId: merchantId,
            serviceId: serviceId,
            orderId: orderId,
            customerId: customerId,
            transactionAmount: transactionAmount,
            currencyCode: currencyCode,
            requestDateTime: requestDateTime,
            successUrl: successUrl,
            failUrl: failUrl,
            additionalField1: additionalField1,
            additionalField2: additionalField2,
            additionalField3: additionalField3,
            additionalField4: additionalField4,
            additionalField5: additionalField5,
            checksum: checksum,
        };

        const data = JSON.stringify(paymentData);

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        try {
            const res = await axios.post('/payment/paygov', data, config);

            console.log(res);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="bg-primary p-5" style={{ minHeight: '100vh' }}>
            <div className="card" style={{ width: '60%', margin: '0 auto' }}>
                <div className="card-body mx-4">
                    <div className="container">
                        <p
                            className="my-5 mx-5 text-center"
                            style={{ fontSize: '30px' }}
                        >
                            Continue to Payment
                        </p>
                        <div className="row">
                            <ul className="list-unstyled">
                                <li className="text-black">
                                    Assam Real Estate Appellate Tribunal
                                </li>
                                <li className="text-muted mt-1">
                                    <span className="text-black">
                                        3rd Floor, Aditya Tower, Rukmini Gaon,
                                        G.S. Road
                                    </span>
                                </li>
                                <li className="text-black mt-1">
                                    Guwahati-781036
                                </li>
                            </ul>
                            <hr />
                            <div className="col-xl-10">
                                <p>Appeal Fee</p>
                            </div>
                            <div className="col-xl-2">
                                <p className="float-end">
                                    {' '}
                                    <i className="fa-solid fa-indian-rupee-sign"></i>{' '}
                                    1000
                                </p>
                            </div>
                            <hr />
                        </div>

                        <div className="row text-black">
                            <div className="col-xl-12">
                                <p className="float-end fw-bold">
                                    Total:{' '}
                                    <i className="fa-solid fa-indian-rupee-sign"></i>{' '}
                                    1000
                                </p>
                            </div>
                            <hr style={{ border: '2px solid black' }} />
                        </div>
                        <div
                            className="text-center"
                            style={{ marginTop: '90px' }}
                        >
                            <button
                                className="btn btn-primary text-uppercase"
                                onClick={initiatePayment}
                            >
                                Continue to Payment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return { payment: state.payment };
};

export default connect(mapStateToProps, { getPayment })(ConfirmPayment);
