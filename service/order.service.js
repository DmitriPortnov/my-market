const fs = require('fs');
const PdfPrinter = require('pdfmake');
const mongoose = require('mongoose');
const _ = require('lodash');
const cartProductSchema = require('../models/cartItem.model');
const CartProduct = mongoose.model('cart-product', cartProductSchema);
const orderSchema = require('../models/order.model');
const Order = mongoose.model('order', orderSchema);
const cartSchema = require('../models/cart.model');
const Cart = mongoose.model('cart', cartSchema);

const fonts = {
  Courier: {
    normal: 'Courier',
    bold: 'Courier-Bold',
    italics: 'Courier-Oblique',
    bolditalics: 'Courier-BoldOblique'
  },
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  },
  Times: {
    normal: 'Times-Roman',
    bold: 'Times-Bold',
    italics: 'Times-Italic',
    bolditalics: 'Times-BoldItalic'
  },
  Symbol: {
    normal: 'Symbol'
  },
  ZapfDingbats: {
    normal: 'ZapfDingbats'
  }
};

const createInvoce = (products) => {
  const invoiceContent = [['name', 'singlePrice ($)', 'quantity', 'fullPrice ($)']];
  products.forEach(p => {
    const product = {
      name: p.productId.productName,
      singlePrice: p.productId.price,
      quantity: p.quantity,
      fullPrice: p.totPrice
    }
    invoiceContent.push(_.toArray(product));
  });
  return invoiceContent;
}

const getDate = (data) => {
  const date = new Date(data);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const last4digits = (ccn) => {
  if (ccn.length === 19 || ccn.length === 20) {
    return ccn.slice(15, 19);
  }
}

const Orders = {
  createOrder: async (req, res) => {
    const newOrder = new Order(req.body);
    await newOrder.save();
    Cart.findOneAndUpdate({_id: req.body.cartId}, {finishedCart: true}, {useFindAndModify: false}, err => {
      if (err) {
        return res.status(400).json('something wrong');
      }
      CartProduct.find({cartId: req.body.cartId}).populate('productId').exec( async (err, products) => {
        if (err) {
            return res.status(400).json('something wrong');
        }
        const {firstname, lastname} = req.user;
        const filename = `invoice-${req.body.cartId}`;
        const newInvoice = createInvoce(products);
        const userData = [
          {text: 'Invoice \n', fontSize: 30, bold: true, alignment: 'center'},
          {text: `for ${firstname} ${lastname} \n\n `, fontSize: 20, bold: true, alignment: 'center'},
          {text: 'Delivary details. \n', bold: true},
          `City: ${req.body.city} \n`,
          `Street: ${req.body.street} \n`,
          `Delivary date: ${getDate(req.body.delivaryDate)} \n\n`,
        ]
        const text = `\n\n
          paid with Credit-card ends number: ${last4digits(newOrder.creditCard)} \n
          Total price: ${req.body.finalPrice}$ \n
          thank you for buying :)`;
        const printer = new PdfPrinter(fonts);
        const docDefinition = {
            content: [
              {text: userData},
              {
                layout: 'lightHorizontalLines',
                table: {
                  headerRows: 1,
                  widths: [ '*', '*', '*', '*' ],
                  body: newInvoice
                }
              },
              {
                text: text
              }
            ],
            defaultStyle: {
              font: 'Helvetica'
            }
        };
        const pdfDoc = await printer.createPdfKitDocument(docDefinition);
        await pdfDoc.pipe(fs.createWriteStream(`./public/orders/${filename}.pdf`));
        await pdfDoc.end();
      });
      return res.send(true);
    });
  },
  downloadPDF: (req, res) => {
    const filename = `invoice-${req.params.cartId}`;
    return res.download(`./public/orders/${filename}.pdf`);
  }
}

module.exports = Orders;