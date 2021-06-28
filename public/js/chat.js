const socketMensajes = io.connect();

socketMensajes.on('mensajes', data => {
    let tabla = message2TableJS(data);
    document.getElementById('messages').innerHTML = tabla;
});

function message2TableJS(mensajes) {
    let res = ''
    if (mensajes.length) {
        res += `
        <style>
            .table td, .table th {
                vertical-align : middle;
            }
        </style>
        <div>
            <table>
        `
        res += mensajes.map(mensaje => `
                <tr>
                    <td style="color:blue"><b>${mensaje.userMail}</b></td>
                    <td style="color:brown">${mensaje.messageTime}</td>
                    <td style="color:green"><i>${mensaje.userMessage}</i></td>
                </tr>
        `).join(' ')
        res += `
            </table>
        </div>`
    }
    return res
}

function addMessage(e) {

    var mensajes = {
        userMail: document.getElementById('userMail').value,
        userMessage: document.getElementById('message').value,
        messageTime: getDate()
    };

    socketMensajes.emit('nuevo-mensaje', mensajes);
    return false;
}

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