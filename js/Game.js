class Game {
    constructor() {
        this.cur = null         //当前方块
        this.next = null        //下一次方块
        this.gameDivs = []    //游戏div矩阵数组
        this.nextDivs = []    //下一次方块游戏div矩阵数组
        this.gameData = []    //游戏矩阵数组
        this.timeDiv = null
        this.scoreDiv = null
        this.resultDiv = null
        this.score = 0
        for (let i = 0; i < 20; i++) {
            let gameArr = []
            for (let j = 0; j < 10; j++) {
                gameArr.push(0)
            }
            this.gameData.push(gameArr)
        }
    }
    init(doms, num1, num2) {
        this.cur = new SquareFactory().getSquare(num1)        //当前的方块
        this.next = new SquareFactory().getSquare(num2)        //下一次的方块
        this.timeDiv = doms.timeDiv
        this.scoreDiv = doms.scoreDiv
        this.resultDiv = doms.gameOverDiv
        this.initDiv(doms.gameDiv, this.gameData, this.gameDivs)  //初始化game中div
        this.initDiv(doms.nextDiv, this.next.data, this.nextDivs)      //初始化next中div
        this.setData()
        this.refreshDiv(this.gameData, this.gameDivs)             //刷新game中div
        this.refreshDiv(this.next.data, this.nextDivs)                 //刷新next中div
    }
    //数据合法性检查
    isVaild(pos, data) {
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[0].length; j++) {
                if (data[i][j] != 0) {
                    if (!this.check(pos, i, j)) {
                        return false
                    }
                }
            }
        }
        return true
    }
    //点位置的检查
    check(pos, x, y) {
        if (pos.x + x < 0) {
            return false
        } else if (pos.x + x >= this.gameData.length) {
            return false
        } else if (pos.y + y < 0) {
            return false
        } else if (pos.y + y >= this.gameData[0].length) {
            return false
        } else if (this.gameData[pos.x + x][pos.y + y] == 1) {//这个表示点已经被占用了
            return false
        } else {
            return true
        }
    }
    //设置数据
    setData() {
        for (let i = 0; i < this.cur.data.length; i++) {
            for (let j = 0; j < this.cur.data[i].length; j++) {
                if (this.check(this.cur.origin, i, j)) {
                    this.gameData[this.cur.origin.x + i][this.cur.origin.y + j] = this.cur.data[i][j]
                }
            }
        }
    }
    //清除数据
    clear() {
        for (let i = 0; i < this.cur.data.length; i++) {
            for (let j = 0; j < this.cur.data[i].length; j++) {
                if (this.check(this.cur.origin, i, j)) {
                    this.gameData[this.cur.origin.x + i][this.cur.origin.y + j] = 0
                }
            }
        }
    }
    //设置时间
    setTime(count) {
        this.timeDiv.innerHTML = count
    }
    //设置积分
    addScore(line) {
        console.log(line)
        let score = 0
        switch (line) {
            case 1:
                score = 10
                break;
            case 2:
                score = 20
                break
            case 3:
                score = 40
                break
            case 4:
                score = 80
                break
        }
        this.score += score
        this.scoreDiv.innerHTML = this.score
    }

    //初始化div
    initDiv(container, data, divs) {
        for (let i = 0; i < data.length; i++) {
            let gameDiv = []
            for (let j = 0; j < data[i].length; j++) {
                let newNode = document.createElement('div')
                newNode.className = 'none'
                newNode.style.top = (i * 20) + 'px'
                newNode.style.left = (j * 20) + 'px'
                container.appendChild(newNode)
                gameDiv.push(newNode)
            }
            divs.push(gameDiv)
        }
    }
    //刷新div
    refreshDiv(data, divs) {
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                if (data[i][j] == 0) {
                    divs[i][j].className = 'none'
                } else if (data[i][j] == 1) {
                    divs[i][j].className = 'done'
                } else if (data[i][j] == 2) {
                    divs[i][j].className = 'current'
                }
            }
        }
    }
    //下移
    down() {
        if (this.isVaild(this.cur.canDown(), this.cur.data)) {
            this.clear()
            this.cur.down()
            this.setData()
            this.refreshDiv(this.gameData, this.gameDivs)
            return true
        } else {
            return false
        }
    }
    //左移
    left() {
        if (this.isVaild(this.cur.canLeft(), this.cur.data)) {
            this.clear()
            this.cur.left()
            this.setData()
            this.refreshDiv(this.gameData, this.gameDivs)
        }
    }
    //右移
    right() {
        if (this.isVaild(this.cur.canRight(), this.cur.data)) {
            this.clear()
            this.cur.right()
            this.setData()
            this.refreshDiv(this.gameData, this.gameDivs)
        }
    }
    //旋转
    rotate() {
        if (this.isVaild(this.cur.origin, this.cur.canRotate())) {
            this.clear()
            this.cur.rotate()
            this.setData()
            this.refreshDiv(this.gameData, this.gameDivs)
        }
    }
    //下落
    fall() {
        while (this.down()) { }
    }
    //使用下一个方块
    performNext(num) {
        this.cur = this.next
        console.log(num)
        this.next = new SquareFactory().getSquare(num)
        this.refreshDiv(this.gameData, this.gameDivs)
        this.refreshDiv(this.next.data, this.nextDivs)
    }

    //方块固定
    fixed() {
        for (let i = 0; i < this.cur.data.length; i++) {
            for (let j = 0; j < this.cur.data[0].length; j++) {
                if (this.check(this.cur.origin, i, j)) {
                    if (this.gameData[this.cur.origin.x + i][this.cur.origin.y + j] == 2) {
                        this.gameData[this.cur.origin.x + i][this.cur.origin.y + j] = 1
                    }
                }
            }
        }
        this.refreshDiv(this.gameData, this.gameDivs)
    }
    //消除行
    checkClear() {
        let line = 0
        for (let i = this.gameData.length - 1; i >= 0; i--) {
            let clear = true
            for (let j = 0; j < this.gameData[0].length; j++) {
                if (this.gameData[i][j] != 1) {
                    clear = false
                    break;
                }
            }
            if (clear) {
                line += 1
                for (let m = i; m > 0; m--) {
                    for (let n = 0; n < this.gameData[0].length; n++) {
                        this.gameData[m][n] = this.gameData[m - 1][n]
                    }
                }
                for (let n = 0; n < this.gameData[0].length; n++) {
                    this.gameData[0][n] = 0
                }
                i++
            }
        }
        return line
    }
    //底部增加干扰行
    addBottomLine(lines) {
        for (let i = 0; i < this.gameData.length - lines.length; i++) {
            this.gameData[i] = this.gameData[i + lines.length]
        }
        for (let i = 0; i < lines.length; i++) {
            this.gameData[this.gameData.length - lines.length + i] = lines[i]
        }
        this.cur.origin.x -= lines.length
        if (this.cur.origin.x < 0) {
            this.cur.origin.x = 0
        }
        this.refreshDiv(this.gameData, this.gameDivs)
    }
    //随机生成多少个干扰行
    generatelines(lineNum) {
        let lines = []
        for (let i = 0; i < lineNum; i++) {
            let line=[]
            for (let j = 0; j < 10; j++) {
                line.push(Math.round(Math.random()))
            }
            lines.push(line)
        }
        return lines
    }

    //检查游戏结束
    checkGameOver() {
        let gameOver = false
        for (let i = 0; i < this.gameData[0].length; i++) {
            if (this.gameData[1][i] == 1) {
                gameOver = true
            }
        }
        return gameOver
    }
    //游戏结束
    gameOver(result) {
        if (result) {
            this.resultDiv.innerHTML = '你赢了'
        } else {
            this.resultDiv.innerHTML = '你输了'
        }
    }
}


