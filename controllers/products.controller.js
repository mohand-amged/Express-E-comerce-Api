const mongoose = require('mongoose')
const product = require('../models/products.model')
const httpStatusText = require('../utils/httpStatusText')

// Get all Products

const getAllProduct = async (req, res) => {
    try {
        const products = await product.find({}, {"__v" : false});
        return res.status(200).json({status: httpStatusText.SUCCESS, data: {products}})

    } catch (err) {
        return res.status(500).json({ 
            status: httpStatusText.ERROR, 
            data: null, 
            message: err.message, // Fixed typo
            code: 500 
        });
    }
};

const getProduct = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send({status : httpStatusText.FAIL, message : `No todo with id: ${id}`});
      }
    const getProduct = await product.findById(id)
    return res.status(200).json({status : httpStatusText.SUCCESS, data : {getProduct}})
}

const addProduct = async (req, res) => {
    try {
        const {title, quantity, description ,price} = req.body;
        const newProduct = await product.create({title, quantity, description, price})
        return res.status(201).json({status : httpStatusText.SUCCESS ,data: newProduct});
    } catch (err) {
        return res.status(400).json({
          status: httpStatusText.ERROR,
          data: null,
          message: err.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, quantity, description, price} = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).send({status: httpStatusText, massage: `No product with id : ${id}`});
        }
        const updateProduct = await product.findByIdAndUpdate(
            id,
            { title, quantity, description, price },
            { new: true }
        );

        return res.status(200).json({
            status: httpStatusText.SUCCESS,
            data: { updateProduct }
        });

    } catch (err) {
        return res.status(404).json({
            status: httpStatusText.ERROR,
            data: null,
            message: err.message // Fixed typo
        });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).send({status : httpStatusText.FAIL, message : `No Product with id: ${id}`});
          }
          const deletedProduct = await product.findByIdAndDelete(id);
          if (!deletedProduct) { 
              return res.status(404).json({ 
                  status: httpStatusText.ERROR, 
                  message: "Product not found" 
              });
          }
        res.json({status : httpStatusText.SUCCESS , data : null });

    } catch (err) {
        return res.status(500).json({ status : httpStatusText.ERROR, data : null, message: err.message, code : 500 });
    }
};

module.exports = {getAllProduct, getProduct, addProduct, updateProduct, deleteProduct}