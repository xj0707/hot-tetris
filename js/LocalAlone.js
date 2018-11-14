//当前类
class LocalAlone {
    constructor() {
        this.time = 500
        this.timer = null
        this.game = new Game()
        this.timeCount = 0
        this.count = 0
        this.doms = {
            gameDiv: document.getElementById('local_game'),
            nextDiv: document.getElementById('local_next'),
            timeDiv: document.getElementById('local_time'),
            scoreDiv: document.getElementById('local_score'),
            gameOverDiv: document.getElementById('local_gameOver')
        }
    }
    //开始
    start() {
        let curSquare = Math.ceil(Math.random() * 7)  //当前方块
        let nexSquare = Math.ceil(Math.random() * 7)  //下一个方块
        let curPostion = Math.floor(Math.random() * 4) //当前方块选择角度
        let nexPostion = Math.floor(Math.random() * 4)   //下个方块旋转角度
        this.game.init(this.doms, { curSquare, curPostion }, { nexSquare, nexPostion })
        this.bindKeyEvent()
        this.timer = setInterval(() => {
            this.timeFun()
            if (!this.game.down()) {
                this.game.fixed()
                let line = this.game.checkClear()
                if (line) {
                    this.game.addScore(line)
                    //给对方增加干扰
                    if (line > 1) {
                        let lines = this.game.generatelines(1)
                    }
                }
                if (this.game.checkGameOver()) {
                    this.game.gameOver(false)
                    this.stop()
                } else {
                    let squareIndex = Math.ceil(Math.random() * 7)
                    let squarePostion = Math.floor(Math.random() * 4)
                    this.game.performNext(squareIndex, squarePostion)
                }
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
            //自动增加底部干扰
            if (this.count % 20 == 0) {
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