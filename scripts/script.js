var canvas = document.getElementById('myCanvas')
var ctx = canvas.getContext('2d')

var x = canvas.width / 2
var y = canvas.height - 30
var dx = 2
var dy = -2
var ballRadius = 10
var paddleHeight = 10
var paddleWidth = 75
var paddleX = (canvas.width - paddleWidth) / 2
var rightPressed = false
var leftPressed = false
var brickRowCount = 3
var brickColumnCount = 5
var brickWidth = 75
var brickHeight = 20
var brickPadding = 10
var brickOffsetTop = 30
var brickOffsetLeft = 30
var score = 0

var bricks = []
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = []
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = {x: 0, y: 0, status: 1}
  }
}

// [0][0] {x: 0, y:0}
// [0][1] {x: 0, y:0}
// [0][2] {x: 0, y:0}

// [1][0] {x: 0, y:0}
// [1][1] {x: 0, y:0}
// [1][2] {x: 0, y:0}
// .
// .
// [4][0] {x: 0, y:0}
// [4][1] {x: 0, y:0}
// [4][2] {x: 0, y:0}

document.addEventListener('keydown', keyDownHandler)
document.addEventListener('keyup', keyUpHandler)

function drawBricks () {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft
        var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop
        bricks[c][r].x = brickX
        bricks[c][r].y = brickY
        ctx.beginPath()
        ctx.rect(brickX, brickY, brickWidth, brickHeight)
        ctx.fillStyle = '#0095DD'
        ctx.fill()
        ctx.closePath()
      }
    }
  }
}

function keyDownHandler (e) {
  if (e.keyCode === 39) {
    rightPressed = true
  } else if (e.keyCode === 37) {
    leftPressed = true
  }
}

function keyUpHandler (e) {
  if (e.keyCode === 39) {
    rightPressed = false
  } else if (e.keyCode === 37) {
    leftPressed = false
  }
}

function drawBall () {
  ctx.beginPath()
  // position = (x = 50, y = 50) radius = 10, full circle = Math.PI * 2
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
  ctx.fillStyle = '#0095DD'
  ctx.fill()
  ctx.closePath()
}

function drawPaddle () {
  ctx.beginPath()
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
  ctx.fillStyle = '#0095DD'
  ctx.fill()
  ctx.closePath()
}

function collisionDetection () {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r]
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy
          b.status = 0
          score++
          if (score === brickRowCount * brickColumnCount) {
            alert('YOU WIN, CONGRATULATIONS!')
            document.location.reload()
          }
        }
      }
    }
  }
}

function drawScore () {
  ctx.font = '16px Arial'
  ctx.fillStyle = '#0095DD'
  ctx.fillText('Score: ' + score, 8, 20)
}

function draw () {
  // clearRect method clears the canvas after every interval
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawBall()
  drawPaddle()
  drawBricks()
  drawScore()
  collisionDetection()

  if (y + dy < ballRadius) {
    dy = -dy
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy
    } else {
      alert('Game Over')
      document.location.reload()
    }
  }
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx
  }

  if (rightPressed === true && paddleX < canvas.width - paddleWidth) {
    paddleX += 7
  }

  if (leftPressed === true && paddleX > 0) {
    paddleX -= 7
  }

  x += dx
  y += dy
}

document.addEventListener('mousemove', mouseMoveHandler)

function mouseMoveHandler (e) {
  var relativeX = e.clientX - canvas.offsetLeft
  if (relativeX > paddleWidth / 2 && relativeX < canvas.width - (paddleWidth / 2)) {
    paddleX = relativeX - paddleWidth / 2
  }
}

setInterval(draw, 10)
