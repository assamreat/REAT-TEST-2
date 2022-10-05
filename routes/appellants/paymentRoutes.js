const express = require('express');
const router = express.Router();

const axios = require('axios');

// Models
const Payment = require('../../models/Payment');
const AppealState = require('../../models/AppealState');

// Middleware
const auth = require('../../middleware/auth');

router.post('/', auth, async (req, res) => {
    try {
        const data = req.body;

        const resposne = await axios.post(
            'https://pilot.surepay.ndml.in/SurePayPayment/sp/processRequest',
            data
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
