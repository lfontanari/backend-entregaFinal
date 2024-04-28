
import cartModel from "../models/cart.model.js";

export const getAllCarts = async () => {
        return await cartModel.find()
    }

export const getCartById = async (id) => {
        return await cartModel.findById(id)
    }

export const createCart = async () => {
        return await cartModel.create({})
    }

export const getProductsFromCart = async (id) => {
        return await cartModel.findById(id).populate('products.product')
    }

export const updateCartProducts = async (cid,cart) => {
        return await cartModel.findByIdAndUpdate(cid, cart)
    }