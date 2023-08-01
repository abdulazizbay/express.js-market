const express = require('express')
const app = express();
const session = require('express-session');
const config = require('config');
const mongoose = require('mongoose')
app.use(express.json());
app.use('/api/auth',require('./routes/userRouter'))
app.use('/api/product',require('./routes/productRouter'))
app.use('/api/category',require('./routes/categoryRouter'))
app.use('/api/cart',require('./routes/cartRouter'))
async function start(){
    try{
        await mongoose.connect(config.get('mongoURI'),{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        app.listen(config.get('port'), ()=>{console.log(`successfully running`);})
    }catch(e){
        console.log(e)
        process.exit(1)
    }
}
start()


