let standAlone = true  //单机模式
if (standAlone) {
    let local = new LocalAlone()
    local.start()
} else {
    //双人模式 
    let socket = io("ws://localhost:3000")

    let local = new Local(socket)

    let remote = new Remote(socket)

    //游戏等待玩家
    socket.on('waiting', function (data) {
        document.getElementById('local_gameOver').style.color = 'red'
        document.getElementById('local_gameOver').innerHTML = data.message
    })

}


