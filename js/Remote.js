//其他人类
class Remote {
    constructor(socket) {
        this.time = 500
        this.timer = null
        this.game = new Game()
        this.timeCount = 0
        this.count = 0
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
            this.game.init(this.doms, data.curSquare, data.nexSquare)
        })
        this.socket.on('next', (data) => {
            this.game.performNext(data.squareIndex)
        })
    }
    //开始
    start(curSquare, nexSquare) {

        this.game.init(this.doms, curSquare, nexSquare)
        this.bindKeyEvent()
        // this.timer = setInterval(() => {
        //     this.timeFun()
        //     if (!this.game.down()) {
        //         this.game.fixed()
        //         let line = this.game.checkClear()
        //         if (line) {
        //             console.log(line)
        //             this.game.addScore(line)
        //         }
        //         if (this.game.checkGameOver()) {
        //             this.game.gameOver(false)
        //             this.stop()
        //         } else {
        //             let suqareIndex = Math.ceil(Math.random() * 7)
        //             this.game.performNext(suqareIndex)
        //         }
        //     }
        // }, this.time)
    }
    //时间计时
    timeFun(doms) {
        this.timeCount += 1
        if (this.timeCount == 2) {
            this.timeCount = 0
            this.count += 1
            this.game.setTime(this.count)
            if (this.count % 15 == 0) {
                let lines = this.game.generatelines(1)
                this.game.addBottomLine(lines)
            }
        }
    }
    //停止
    stop() {
        if (this.timer) {
            clearInterval(this.timer)
            this.timer = null
            document.onkeydown = null
        }
    }
    //绑定键盘事件
    bindKeyEvent() {

    }
}