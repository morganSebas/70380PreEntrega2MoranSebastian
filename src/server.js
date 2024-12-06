import express from 'express'
import { create } from 'express-handlebars'
import  path from 'path'
import { __dirname } from './path.js'
import productRouter from './routes/productos.routes.js'
import cartRouter from './routes/carritos.routes.js'
import multerRouter from './routes/imagenes.routes.js'
import { Server } from 'socket.io'
const app = express()
const hbs = create()
const PORT = 8080
const server = app.listen(PORT, () => {
    console.log("Server on port", PORT)
})
console.log(__dirname)
const io = new Server(server)
app.use(express.json()) 
app.use(express.urlencoded({extended: true}))
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.set('views', path.join(__dirname, '/views'))

app.use('/static', express.static(__dirname + '/public'))

app.use('/api/productos', productRouter)
app.use('/api/carritos', cartRouter)
app.use('/upload', multerRouter)
app.get('/', (req,res) => {
    res.status(200).send("Ok")
})

//array de pruebas, mas adelante reemplazar por datos desde la bd
const productos = [
    {nombre: "Amoladora", marca: "TheWall", precio: 150000, stock: 12, status: true},
    {nombre: "Martillo", marca: "Sin Marca", precio: 22000, stock: 40, status: true},
    {nombre: "Aujeradora", marca: "TheWall", precio: 100330, stock: 42, status: false}
]
app.get('/', (req,res) => {
    res.render('/template/productos', {productos})  //aca va la plantilla que quiero rederiza osea productos
})
 




//Conexiones de socket.io
//socket = info que llega de la conexion
io.on('connection', (socket) => { 
    console.log('Usuario conectado: ', socket.id); 
    
    socket.on('mensaje', (data) => { 
        console.log('Mensaje recibido: ', data);
        //Enviar un mensaje
        socket.emit('respuesta', 'Mensaje recibido correctamente: ', data)
    })

    socket.on('disconnect', ()=> {
        console.log('Usuario desconectado: ', socket.id);
        
    })
})
