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
        //游戏结束监听
        this.socket.on('lose', (data) => {
            this.game.gameOver(true)
            // this.doms.gameOverDiv.style.color = 'green'
            // this.doms.gameOverDiv.innerHTML = data.message
            this.stop()
        })
        //掉线监听
        this.socket.on('leave', (data) => {
            this.doms.gameOverDiv.style.color = 'red'
            this.doms.gameOverDiv.innerHTML = '对方掉线'
            document.getElementById('remote_gameOver').style.color = 'red'
            document.getElementById('remote_gameOver').innerHTML = '已掉线'
            this.stop()
        })
    }
    //开始
    start() {
        let curSquare = Math.ceil(Math.random() * 7)  //当前方块
        let nexSquare = Math.ceil(Math.random() * 7)  //下一个方块
        let curPostion = Math.floor(Math.random() * 4) //当前方块选择角度
        let nexPostion = Math.floor(Math.random() * 4)   //下个方块旋转角度
        this.game.init(this.doms, { curSquare, curPostion }, { nexSquare, nexPostion })
        this.socket.emit('init', { cur: { curSquare, curPostion }, next: { nexSquare, nexPostion } })
        this.bindKeyEvent()
        // let squareIndex = Math.ceil(Math.random() * 7)
        // this.game.performNext(squareIndex)
        // this.socket.emit('next', { squareIndex })
        this.timer = setInterval(() => {
            this.timeFun()
            if (!this.game.down()) {
                this.game.fixed()
                this.socket.emit('fixed')
                let line = this.game.checkClear()
                if (line) {
                    this.game.addScore(line)
                    this.socket.emit('line', { line })
                }
                if (this.game.checkGameOver()) {
                    this.game.gameOver(false)
                    document.getElementById('remote_gameOver').innerHTML = '你赢了'
                    this.socket.emit('lose')
                    this.stop()
                } else {
                    let squareIndex = Math.ceil(Math.random() * 7)
                    let squarePostion = Math.floor(Math.random() * 4)
                    this.game.performNext(squareIndex, squarePostion)
                    this.socket.emit('next', { squareIndex, squarePostion })
                }
            } else {
                this.socket.emit('down')
            }
        }, this.time)
    }
    //时间计时
    timeFun() {
        this.timeCount += 1
        if (this.timeCount == 2) {
            this.timeCount = 0
            this.count += 1
            this.game.setTime(this.count)
            this.socket.emit('time', { count: this.count })
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
                this.socket.emit('rotate')
            } else if (e.keyCode == 39) {  //right
                this.game.right()
                this.socket.emit('right')
            } else if (e.keyCode == 40) {  //down
                this.game.down()
                this.socket.emit('down')
            } else if (e.keyCode == 37) {  //left
                this.game.left()
                this.socket.emit('left')
            } else if (e.keyCode == 32) {  //space
                this.game.fall()
                this.socket.emit('fall')
            }
        }
    }
}