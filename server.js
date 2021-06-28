const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');

const handlebars = require('express-handlebars');
const productos = require('./api/productos');
const mensajes = require('./api/mensajes');

const archivo_mensajes = './public/logs/mensajes.txt'
const archivo_productos = './public/logs/productos.txt'

// establecemos la configuración de handlebars
app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: 'index.hbs',
        layoutsDir: __dirname + '/views/layouts'
    })
);

app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.static( __dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// definimos las rutas http
const router = express.Router();
app.use('/api', router);

/* -------------------- HTTP endpoints ---------------------- */

// TODO completar con lo realizado en entregas anteriores
router.get('/productos/listar', (req, res) => {
    try {
        res.status(200).send(JSON.stringify(productos.Listar()));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/productos/listar/:id', (req, res) => {
    try {
        res.status(200).send(JSON.stringify(productos.Listar(req.params.id)));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/productos/guardar', (req, res) => {
    try {
        console.log('Creado producto con:', req.body.title, req.body.price, req.body.thumbnail);

        productos.Agregar(req.body.title, req.body.price, req.body.thumbnail);
        //res.status(200).send(JSON.stringify(productos.Listar()));
        hayProductos = productos.hayProductos();
        res.render('layouts/index', {productos: productos.Listar(), hayProductos: hayProductos});
    } catch (error) {
        res.status(400).send(error);
    }
});

router.put('/productos/actualizar/:id', (req, res) => {
    try {
        res.status(200).send(JSON.stringify(productos.Actualizar(req.params.id, req.body.title, req.body.price, req.body.thumbnail)));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/productos/borrar/:id', (req, res) => {
    try {
        res.status(200).send(JSON.stringify(productos.Borrar(req.params.id)));
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/productos/vista', (req, res) => {
    try {
        let prods = productos.listar();

        res.render("vista", {
            productos: prods,
            hayProductos: prods.length
        });        
    } catch (error) {
        res.status(400).send(error);
    }

});

/*
Persistencia de los datos
*/

//Guardo los mensajes en el archivo de logs correspondiente
function persistirDatos(objeto, tipo) {
    let resultado;

    try {
        if(tipo == 'mensajes') {
            if(objeto.hayMensajes) {
                console.log('Hay mensajes');
                fs.writeFileSync(archivo_mensajes, JSON.stringify(objeto.Listar()));
            }

            resultado = true;
        } else if (tipo == 'productos') {
            if(objeto.hayProductos) {
                fs.writeFileSync(archivo_productos, JSON.stringify(objeto.Listar()));
            }
        } else {
            //el tipo es incorrecto o no existe, sale por error.
            resultado = false;
        }

        return resultado;
        
    } catch (error) {
        console.log('error', error);
        return false;
    }
}

/*
Web Sockets
*/

//Socket de actualización de mensajes
io.on('connection', socketMensajes => {
    socketMensajes.emit('mensajes', mensajes.Listar());

    socketMensajes.on('nuevo-mensaje', data => {
        mensajes.Agregar(data.userMail, data.userMessage, data.messageTime);
        
        if(persistirDatos(mensajes,'mensajes') == false) {
            mensajes.Agregar(
                'admin@e-commerce.com', 
                'Error al guardar los mensajes.', 
                getDate());
        }
        
        if(mensajes.hayMensajes) {
            io.sockets.emit('mensajes', mensajes.Listar());
        }
    });

});

//Socket de actualización de productos
io.on('connection', socket => {
    socket.emit('productos', productos.Listar());

    socket.on('nuevo-producto', data => {
        productos.Agregar(data.title, data.price, data.thumbnail);
        
        if(productos.hayProductos) {
            io.sockets.emit('productos', productos.Listar());
        }

    });
    
});

/* Funciones de servidor */

const PORT = 8080;

const srv = server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

srv.on("error", error => console.log(`Error en servidor ${error}`));

/*
Otras funciones
*/

function getDate() {
    var date = new Date(),
      year = date.getFullYear(),
      month = (date.getMonth() + 1).toString(),
      formatedMonth = (month.length === 1) ? ("0" + month) : month,
      day = date.getDate().toString(),
      formatedDay = (day.length === 1) ? ("0" + day) : day,
      hour = date.getHours().toString(),
      formatedHour = (hour.length === 1) ? ("0" + hour) : hour,
      minute = date.getMinutes().toString(),
      formatedMinute = (minute.length === 1) ? ("0" + minute) : minute,
      second = date.getSeconds().toString(),
      formatedSecond = (second.length === 1) ? ("0" + second) : second;
    return formatedDay + "-" + formatedMonth + "-" + year + " " + formatedHour + ':' + formatedMinute + ':' + formatedSecond;
  };