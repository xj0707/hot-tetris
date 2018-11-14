//当前类
class Local {
    constructor(socket) {
        this.time = 500
        this.timer = null
        this.game = new Game()
        this.timeCount = 0
        this.count = 0
        this.socket = socket
        this.doms = {
            gameDiv: document.getElementById('local_game'),
            nextDiv: document.getElementById('local_next'),
            timeDiv: document.getElementById('local_time'),
            scoreDiv: document.getElementById('local_score'),
            gameOverDiv: document.getElementById('local_gameOver')
        }
        //游戏开始监听
        this.socket.on('start', (data) => {
            this.doms.gameOverDiv.style.color = 'green'
            this.doms.gameOverDiv.innerHTML = data.message
            this.start()
        })
    }
    //开始
    start() {
        let curSquare = Math.ceil(Math.random() * 7)
        let nexSquare = Math.ceil(Math.random() * 7)
        this.game.init(this.doms, curSquare, nexSquare)
        this.socket.emit('init', { curSquare, nexSquare })
        this.bindKeyEvent()
        // let squareIndex = Math.ceil(Math.random() * 7)
        // this.game.performNext(squareIndex)
        // this.socket.emit('next', { squareIndex })
        this.timer = setInterval(() => {
            this.timeFun()
            if (!this.game.down()) {
                this.game.fixed()
                let line = this.game.checkClear()
                if (line) {
                    this.game.addScore(line)
                }
                if (this.game.checkGameOver()) {
                    this.game.gameOver(false)
                    this.stop()
                } else {
                    let squareIndex = Math.ceil(Math.random() * 7)
                    this.game.performNext(squareIndex)
                    this.socket.emit('next', { squareIndex })
                }
            }
        }, this.time)
    }
    //时间计时
    timeFun(doms) {
        this.timeCount += 1
        if (this.timeCount == 2) {
            this.timeCount = 0
            this.count += 1
            this.game.setTime(this.count)
            // if (this.count % 15 == 0) {
            //     let lines = this.game.generatelines(1)
            //     this.game.addBottomLine(lines)
            // }
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
        document.onkeydown = (e) => {
            if (e.keyCode == 38) {  //up
                this.game.rotate()
            } else if (e.keyCode == 39) {  //right
                this.game.right()
            } else if (e.keyCode == 40) {  //down
                this.game.down()
            } else if (e.keyCode == 37) {  //left
                this.game.left()
            } else if (e.keyCode == 32) {  //space
                this.game.fall()
            }
        }
    }
}