const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});
const app = require('./index.js');
const mongoose = require('mongoose');


const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true
})
.then(() => console.log("DB CONNECTED"))
.catch(err => console.log('ERROR - ',err));

const PORT = process.env.PORT || 3000;
app.listen(PORT , () => console.log('server is running on port', PORT));