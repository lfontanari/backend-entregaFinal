import  productModel  from "../models/product.model.js";
import { faker } from '@faker-js/faker';
faker.locale = 'es';

export const getAllProducts  = async (limit = 10 , page = 1, query, sort ) => {
        let consulta = {}
        if (query != undefined){
            consulta[query.split(":")[0]] = query.split(":")[1]
        }
        return await productModel.paginate(consulta,{limit:limit,page:page,sort:sort == undefined ? {}: {price:Number(sort)}})
            
    }

export const getProductById = async (id) => {
        return await productModel.findById(id)
    }

export const createProduct = async (product) => {
        return await productModel.create(product)
    }

export const createProductMock =  () => {
       
        return  {
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            thumbnail: faker.image.image(),
            code: faker.random.alphaNumeric(8).toUpperCase(),
            stock: faker.random.numeric(1),
            category:faker.commerce.department(),
            status: faker.datatype.boolean(),
            id: faker.database.mongodbObjectId()
        }
    }

export const updateProduct = async (id,product) => {
        return await productModel.findByIdAndUpdate(id,product)
    }

export const deleteProduct = async (id) => {
        return await productModel.findByIdAndDelete(id)
    }
