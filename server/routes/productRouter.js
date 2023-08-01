const express = require('express');
const router = express.Router();
const Product = require('../models/product')
const Category = require('../models/Category');


router.get('/getallproducts',async(req,res)=>{
    try{
        const products = await Product.find()
        return res.status(200).json(products)
    }catch(e){
        return res.status(400).json(e.message)
    }
}) 


router.post('/addproduct',async(req,res)=>{
    const {name,price,description,photo,review} = req.body
    try{
        const category = await Category.findOne({name: req.body.category})
        if(!category){return res.status(400).json({message: "No category"})}

        newProduct = new Product({
            name: name,
            price:price,
            description:description,
            photo:photo,
            review: review,
            category: category
        })
        await newProduct.save()
        res.json({message: "success"})
    }catch(e){
        res.status(400).json({message:e.message});
        console.log(e.message);
    }

})

router.delete('/delete/:id',async(req,res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id)
        return res.status(200).json({message: "success"})
    }catch(e){
        console.log(e.message);
        return res.status(400).json({message: e.message})
    }

})

router.put('/put/:id',async(req,res)=>{
    try{
        const {name,price,description,photo,review,category} = req.body
        const existingProduct = await Product.findById(req.params.id);
        if (!existingProduct) {
          return res.status(404).json({ message: 'Product not found.' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,{
            name: name,
            price:price,
            description:description,
            photo:photo,
            review: review,
            category: category
        },
        {new: true})
        if (!updatedProduct) {
            return res.status(500).json({ message: 'Failed to update the product.' });
          }
        return res.status(200).json({message: "success",updated: updatedProduct})
    }catch(e){
        console.log(e.message);
        return res.status(400).json({message: e.message})
    }

})



module.exports = router