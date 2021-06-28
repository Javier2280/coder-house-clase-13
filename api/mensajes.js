class Mensajes {
    constructor() {
        // incializar variables
        this.mensajes = [];
    }

    Agregar(userMail, userMessage, messageTime) {
        let maxId = 1;

        try {
            if (this.mensajes.length > 0) {

                maxId = (this.mensajes.sort( 
                    function(a, b) {
                       return parseFloat(b['id']) - parseFloat(a['id']);
                    }
                    )[0]['id']) + 1;

                //maxId = this.mensajes.length + 1;

            }

            this.mensajes.push({ id: maxId, userMail: userMail, userMessage: userMessage, messageTime: messageTime });
            return { id: maxId, userMail: userMail, userMessage: userMessage, messageTime: messageTime };

        } catch (error) {
            throw new Error(error);
        }
    }

    Listar(id) {
        try {

            if (id == undefined) {

                if (this.mensajes.length == 0) {
                    return { error: 'no hay mensajes cargados' };
                } else {
                    return this.mensajes;
                }

            } else {
                let respuesta = [];

                if (mensajes.length == 0) {
                    respuesta = { error: 'Mensaje no encontrado' };
                    return respuesta;

                } else {
                    for (var i = 0; i < this.mensajes.length; i++) {
                        if (this.mensajes[i].id == id) {
                            respuesta = this.mensajes[i];
                        }
                    }
                    if (respuesta.length == 0) {
                        respuesta = { error: 'Mensaje no encontrado' };
                    }

                    return respuesta;
                }

            }

        } catch (error) {

            throw new Error(error);
        }
    }

    hayMensajes() {
        try {
            if(this.mensajes.length > 0) {
                return true
            } else {
                return false
            }
        } catch (error) {
            throw new Error(error);
        }
    }
}

// exporto una instancia de la clase
module.exports = new Mensajes();