const _ = require('lodash');
// const FormData = require('form-data');
const queryString = require('query-string');
const express = require('express');
const router = express.Router();

const axios = require('axios');

// Models
const Payment = require('../../models/Payment');
const AppealState = require('../../models/AppealState');

// Middleware
const auth = require('../../middleware/auth');

router.post('/paygov', auth, async (req, res) => {
    try {
        const data = queryString.stringify(req.body);
        // const data = JSON.stringify(req.body);
        // const paymentData = req.body;

        // const {
        //     messageType,
        //     merchantId,
        //     serviceId,
        //     orderId,
        //     transactionAmount,
        //     currencyCode,
        //     requestDateTime,
        //     successUrl,
        //     failUrl,
        //     checksum,
        // } = paymentData;
        // // const data = new FormData();
        // const data = new URLSearchParams();

        // // _.mapKeys(paymentData, (value, key) => {
        // //     data.append(key, value);
        // // });

        // data.append('messageType', messageType);
        // data.append('merchantId', merchantId);
        // data.append('serviceId', serviceId);
        // data.append('orderId', orderId);
        // data.append('transactionAmount', transactionAmount);
        // data.append('currencyCode', currencyCode);
        // data.append('requestDateTime', requestDateTime);
        // data.append('successUrl', successUrl);
        // data.append('failUrl', failUrl);
        // data.append('checksum', checksum);
        // console.log(data);

        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };

        const resposne = await axios.post(
            'https://pilot.surepay.ndml.in/SurePayPayment/sp/processRequest',
            data,
            config
        );

        res.json(resposne.data);

        // await AppealState.update(
        //     {
        //         appellant: 0,
        //         receptionist: 1,
        //         registrar: 0,
        //         bench: 0,
        //     },
        //     {
        //         where: { appealId: req.params.id },
        //     }
        // );

        // res.json(payment);
    } catch (err) {
        console.log(err);
        res.status(500).send('SERVER ERROR');
    }
});

// @route GET api/appellant/appeals/:id/payment
// @desc  Get order_id
// @access Private
router.get('/:id', auth, async (req, res) => {
    try {
        const payment = await Payment.findOne({
            where: { appealId: req.params.id },
        });

        res.json(payment);
    } catch (err) {
        console.log(err);
        res.status(500).send('SERVER ERROR');
    }
});

module.exports = router;
