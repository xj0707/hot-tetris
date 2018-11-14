const app = require('http').createServer()
const io = require('socket.io')(app)
const PORT = 3000

app.listen(PORT)
console.log(`websocket listening on port ${PORT}`)

//客服端连接数
let clientCount = 0
//存储客服端socket
let socketMap = {}

//连接
io.on('connection', function (socket) {
    clientCount++
    socket.clientNum = clientCount
    socketMap[clientCount] = socket
    //奇数就说明 只有一个人 游戏还不能开始
    if (clientCount % 2 == 1) {
        socket.emit('waiting', { message: '请等待其他玩家' })
    } else {
        socket.emit('start', { message: '游戏开始' })
        //告诉另外的客服端 游戏开始了
        if (socketMap[clientCount - 1]) {
            socketMap[clientCount - 1].emit('start', { message: '游戏开始' })
        } else {
            socket.emit('leave')
        }
    }
    //监听初始开始游戏
    bindListtener(socket, 'init')
    //监听下一个方块编号
    bindListtener(socket, 'next')
    bindListtener(socket, 'rotate')
    bindListtener(socket, 'right')
    bindListtener(socket, 'down')
    bindListtener(socket, 'left')
    bindListtener(socket, 'fall')
    bindListtener(socket, 'fixed')
    bindListtener(socket, 'line')
    bindListtener(socket, 'time')
    bindListtener(socket, 'lose')

    socket.on('disconnect', function () {
        clientCount--
        console.log(`一个客服端已经离开${clientCount}`)
        if (socket.clientNum % 2 == 0) {
            if (socketMap[socket.clientNum - 1]) {
                socketMap[socket.clientNum - 1].emit('leave')
            }
        } else {
            if (socketMap[socket.clientNum + 1]) {
                socketMap[socket.clientNum + 1].emit('leave')
            }
        }
        delete socketMap[socket.clientNum]
    })
    console.log(`当前连接的客服端数量为${clientCount}`)
})

function bindListtener(socket, event) {
    socket.on(event, function (data) {
        if (socket.clientNum % 2 == 0) {
            if (socketMap[socket.clientNum - 1]) {
                socketMap[socket.clientNum - 1].emit(event, data)
            }
        } else {
            if (socketMap[socket.clientNum + 1]) {
                socketMap[socket.clientNum + 1].emit(event, data)
            }
        }
    })
}