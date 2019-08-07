const mongoose = require('mongoose');
const productSchema = require('../models/product.model');
const Product = mongoose.model('Product', productSchema);
const categorySchema = require('../models/category.model');
const Category = mongoose.model('Category', categorySchema);

const productService = {
    numOfProducts: (req, res) => {
        Product.find({}, (err, products) => {
            return err ? res.status(400).json({error: "something wrong"}) : res.send({numOfProducts: products.length});
        });
    },
    randProduct: (req, res) => {
        Product.find({}, (err, products) => {
            const num = Math.floor(Math.random()*products.length);
            return err ? res.status(400).json({error: "something wrong"}) : res.send(products[num]);
        });
    },
    getProducts: (req, res) => {
        Product.find({category: req.params.categoryId}).populate('category').exec((err, data) => {
            return err ? res.status(400).json('you have error') : res.send(data);
        });
    },
    getCategory: (req, res) => {
        Category.find({}, (err, data) => {
            return err ? res.status(400).json('you have error') : res.send(data);
        });
    },
    addProduct: (req, res) => {
        const {productName, price, categoryId} = req.body;
        Product.findOne({productName}, async (err, data) => {
            if (err) {
                return res.status(400).json({error: "something wrong"});
            }
            if (data) {
                return res.status(400).json({error: "this product allready exist"});
            }
            console.log(req.file);
            const product = new Product({
                productName,
                category: categoryId,
                pic_url: req.file.path.slice(7),
                price
            });
            await product.save();
            return res.status(200).json('product Added');
        });
    },
    updateProduct: async (req, res) => {
        await Product.findOneAndUpdate({
                _id: req.params.productId
            },
            req.body,
            {
                runValidators: productSchema, useFindAndModify: false
            });
        return res.status(200).json('product updated');
    },
    searchProducts: async (req, res) => {
        const {search} = req.body;
        const products = await Product.find({});
        const filteredProducts = products.filter(product => product.productName.startsWith(search));
        return res.send(filteredProducts);
    },
    errorHandler: (error, req, res, next) => {
        return res.status(400).send({ error: error.message });
    }
}

module.exports = productService;