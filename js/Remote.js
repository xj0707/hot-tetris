//其他人类
class Remote {
    constructor(socket) {
        this.game = new Game()
        this.socket = socket
        this.doms = {
            gameDiv: document.getElementById('remote_game'),
            nextDiv: document.getElementById('remote_next'),
            timeDiv: document.getElementById('remote_time'),
            scoreDiv: document.getElementById('remote_score'),
            gameOverDiv: document.getElementById('remote_gameOver')
        }
        this.socket.on('start', (data) => {
            this.doms.gameOverDiv.style.color = 'green'
            this.doms.gameOverDiv.innerHTML = data.message
            this.emit()
        })
    }
    //socket 驱动显示对方的游戏情况
    emit() {
        this.socket.on('init', (data) => {
            this.game.init(this.doms, data.cur, data.next)
        })
        this.socket.on('next', (data) => {
            this.game.performNext(data.squareIndex, data.squarePostion)
        })
        this.socket.on('rotate', (data) => {
            this.game.rotate()
        })
        this.socket.on('right', (data) => {
            this.game.right()
        })
        this.socket.on('down', (data) => {
            this.game.down()
        })
        this.socket.on('left', (data) => {
            this.game.left()
        })
        this.socket.on('fall', (data) => {
            this.game.fall()
        })
        this.socket.on('fixed', (data) => {
            this.game.fixed()
        })
        this.socket.on('line', (data) => {
            this.game.checkClear()
            this.game.addScore(data.line)
        })
        this.socket.on('time', (data) => {
            this.game.setTime(data.count)
        })
        this.socket.on('lose', (data) => {
            this.game.gameOver(false)
        })
        this.socket.on('addBottomLines', (data) => {
            this.game.addBottomLine(data.lines)
        })
        this.socket.on('autoLines', (data) => {
            this.game.addBottomLine(data.lines)
        })
    }
   
}