const express = require('express');
const router = express.Router();
const Category = require('../models/Category')
const Product = require('../models/product');

router.get('/getall', async(req,res)=>{
    try{
        const allCategories = await Category.find()
        return res.status(200).json(allCategories)
    }catch(err){
        return res.status(400).json({message: err.message})
    }
})


router.post('/add', async(req,res)=>{
    try{
        const {name} = req.body
        console.log(name);
        if (typeof name !== 'string') {
            return res.status(400).json({ message: 'Category name is required and must be a non-empty string.' });
        }
        const existCategory = await Category.findOne({name})
        if(existCategory){return res.status(400).json({message:"Category already exists"})}
        const newCategory =  new Category({name})  
        await newCategory.save()  
        return res.status(200).json(newCategory)
    }catch(err){
        return res.status(400).json({message: err.message})
    }
})


router.put('/put/:id', async(req,res)=>{
    try{
        const categoryID = req.params.id
        const {name} = req.body
        
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryID,
            {name:name},
            {new:true}
        )
        if(!updatedCategory) {
            return res.status(400).json({ message: 'Category not updated.' });
        }
        return res.status(200).json({category:updatedCategory,message:"Success"})
    }catch(e){
        res.status(400).json({message:e.message})
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
      const categoryID = req.params.id;
      const existCategory = await Category.findById(categoryID);
  
      if (!existCategory) {
        return res.status(400).json({ message: 'Category not found' });
      }
  
      const deletedCategoryID = await Category.findByIdAndDelete(categoryID);
  
      if (!deletedCategoryID) {
        return res.status(500).json({ message: 'Failed to delete the category.' });
      }
  
      return res.status(200).json({ message: 'Success' });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  });

module.exports = router