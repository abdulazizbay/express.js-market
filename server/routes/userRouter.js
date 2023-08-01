const express   = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const config = require('config')
router.post('/register', async(req, res)=>{
    try{
        const {name,email,password} = req.body;
        const userExist = await User.findOne({email})
        if(userExist){
            return res.status(400).send({message:"User already exists"})
        }
        const hashedPassword = await bcrypt.hash(password,12)
        const user = new User({email:email,name:name,password:hashedPassword})
        await user.save()
        res.status(200).send({message:"User created successfully"})
    }catch(err){
        res.status(400).send({message: err})
        console.log(err, ':error');
    }

})


router.post('/login', async(req, res)=>{
    try{
        const {name,email,password} = req.body;
        const userExist = await User.findOne({email})
        if(!userExist){
            res.status(400).send({message: 'User not found, please create account first.'});
        }
        const checkedUser = await bcrypt.compare(password,userExist.password)
        if(!checkedUser){
            return res.status(404).json({message: 'password mismatch'})
        }
        const token = jwt.sign(
            {userId:userExist.id},
            config.get('jwtSecret'),
            {expiresIn:'1h'}
        )
        res.status(200).json({token,userID:userExist.id})
    }catch(err){
        res.status(400).send({message: err})
        console.log(err, ':error');
    }

})
module.exports = router;