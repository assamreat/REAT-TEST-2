const express = require('express');
// env file config
require('dotenv').config();

// const path = require('path');
// connect DB
const sequelize = require('./util/database');

const app = express();

// Multer -set up
const multer = require('multer');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './data/uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// Models
const Appellant = require('./models/Appellant');
const Appeal = require('./models/Appeal');
const AppealState = require('./models/AppealState');
const Checklist = require('./models/Checklist');
const AppealDoc = require('./models/AppealDoc');
const RevertedAppeal = require('./models/RevertedAppeal');
const Payment = require('./models/Payment');

// Init Middleware
app.use(express.json({ extended: false }));
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('file')
);
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.get('/', (req, res) => res.send('API IS RUNNING'));

// Define Routes
const userRoutes = require('./routes/officials/userRoutes');
const authRoutes = require('./routes/officials/authRoutes');
const appellantUserRoutes = require('./routes/appellants/userRoutes');
const appealRoutes = require('./routes/appellants/appealRoutes');
const receptionistRoutes = require('./routes/officials/receptionistRoutes');
const registrarRoutes = require('./routes/officials/registrarRoutes');
const uploadRoutes = require('./routes/officials/uploadRoutes');
const downloadRoutes = require('./routes/officials/downloadRoutes');
const paymentRoutes = require('./routes/appellants/paymentRoutes');

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/appellants', appellantUserRoutes);
app.use('/api/appellant', appealRoutes);
app.use('/api/receptionist', receptionistRoutes);
app.use('/api/registrar', registrarRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/download', downloadRoutes);
app.use('/payment', paymentRoutes);

// Define PORT
const PORT = process.env.PORT || 5000;

// Model relations
Appeal.belongsTo(Appellant, { constraints: true, onDelete: 'CASCADE' });
Appellant.hasMany(Appeal);

AppealState.belongsTo(Appeal, { constraints: true, onDelete: 'CASCADE' });
Appeal.hasOne(AppealState);

Checklist.belongsTo(Appeal, { constraints: true, onDelete: 'CASCADE' });
Appeal.hasOne(Checklist);

AppealDoc.belongsTo(Appeal, { constraints: true, onDelete: 'CASCADE' });
Appeal.hasOne(AppealDoc);

RevertedAppeal.belongsTo(Appeal, { constraints: true, onDelete: 'CASCADE' });
Appeal.hasOne(RevertedAppeal);

Payment.belongsTo(Appeal, { constraints: true, onDelete: 'CASCADE' });
Appeal.hasOne(Payment);

if (process.env.NODE_ENV === 'production') {
    // Express will serve up production assets
    // like our main.js file, or main.css file
    app.use(express.static('client/build'));

    // Express will serve up the index.html file
    // if it doesn't recognise the route

    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

sequelize
    // .sync({ force: true })
    .sync()
    .then((result) => {
        app.listen(PORT, () => {
            console.log('SERVER IS RUNNING');
        });
    })
    .catch((err) => {
        console.log(err);
    });
