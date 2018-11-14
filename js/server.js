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
        socketMap[clientCount - 1].emit('start', { message: '游戏开始' })
    }
    //监听初始开始游戏
    socket.on('init', function (data) {
        if (socket.clientNum % 2 == 0) {
            socketMap[socket.clientNum - 1].emit('init', data)
        } else {
            socketMap[socket.clientNum + 1].emit('init', data)
        }
    })
    //监听下一个方块编号
    socket.on('next', function (data) {
        if (socket.clientNum % 2 == 0) {
            socketMap[socket.clientNum - 1].emit('next', data)
        } else {
            socketMap[socket.clientNum + 1].emit('next', data)
        }
    })


    socket.on('disconnect', function () {
        clientCount--
        console.log(`一个客服端已经离开${clientCount}`)
    })
    console.log(`当前连接的客服端数量为${clientCount}`)
})