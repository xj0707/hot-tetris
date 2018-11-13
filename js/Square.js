//方块类
class Square {
    constructor(data, rotates, position) {
        //初始化方块数据
        this.data = data
        //设置方块的位置
        this.origin = { x: 0, y: 0 }
        //设置一个方向
        this.position = position
        //旋转，其实只有四种状态90 180 270 360 投机取巧直接罗列出来
        this.rotates = rotates
    }

    //旋转
    rotate() {
        this.position = (this.position + 1) % 4
        for (let i = 0; i < this.data.length; i++) {
            for (let j = 0; j < this.data[0].length; j++) {
                this.data[i][j] = this.rotates[this.position][i][j]
            }
        }
    }
    //是否可以旋转
    canRotate() {
        let index = (this.position + 1) % 4
        let test = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
        for (let i = 0; i < this.data.length; i++) {
            for (let j = 0; j < this.data[0].length; j++) {
                test[i][j] = this.rotates[index][i][j]
            }
        }
        return test
    }
    //下移
    down() {
        this.origin.x += 1
    }
    //能否下移测试
    canDown() {
        return { x: this.origin.x + 1, y: this.origin.y }
    }
    //左移
    left() {
        this.origin.y -= 1
    }
    //能否左移测试
    canLeft() {
        return { x: this.origin.x, y: this.origin.y - 1 }
    }
    //右移
    right() {
        this.origin.y += 1
    }
    //能否下移测试
    canRight() {
        return { x: this.origin.x, y: this.origin.y + 1 }
    }

}