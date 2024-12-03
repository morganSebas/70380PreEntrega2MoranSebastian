import { Router } from "express";
import crypto from 'crypto'
import {__dirname} from '../path.js'
import path from 'path';
import {promises as fs} from 'fs';

const cartRouter = Router()
const carritosPath = path.resolve(__dirname, '../src/db/carritos.json'); 
const carritosData = await fs.readFile(carritosPath, 'utf-8');
const carritos = JSON.parse(carritosData);

//Retorna un listado de los productos que tieen el carrito dado su ID carrito.
cartRouter.get('/:cid', (req,res)=> {
    const carrito = carritos.find(cart => cart.id == req.params.cid)
    if(carrito) {
        res.status(200).send(carrito.products)
    } 
    else {
        res.status(404).send({mensaje: "El carrito no existe"})
    }
})
// Crea  un nuevo carrito.
cartRouter.post('/', async (req,res) => {
    const newCarrito = {
        id: crypto.randomBytes(5).toString('hex'),
        products: []
    }
    carritos.push(newCarrito)
    await fs.writeFile(carritosPath, JSON.stringify(carritos))
    res.status(200).send(`Carrito creado correctamente con el id ${newCarrito.id}`)
})
//Actualiza la cantidad  seleccionada par un determinado articulo, si no existe lo agrega.
cartRouter.post('/:cid/products/:pid', async (req,res) => {
    const {quantity} = req.body
    const carrito = carritos.find(cart => cart.id == req.params.cid)
    if(carrito) {
        const indice = carrito.products.findIndex(prod => prod.id == req.params.pid)
        if(indice != -1) { 
            carrito.products[indice].quantity = quantity
        } 
        else { 
            carrito.products.push({id: req.params.pid, quantity: quantity})
        }
        await fs.writeFile(carritosPath, JSON.stringify(carritos))
        res.status(200).send("Carrito actualizado correctamente")
    } 
    else {
        res.status(404).send({mensaje: "El carrito no existe"})
    }
})

export default cartRouter