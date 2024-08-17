// 1. 畫面上印出 2 * 2 的顏色隨機的方塊
      // 2. 隨機一個方塊的顏色較透明，表示這是答案
      // 3. 使用者點擊答案方塊後，重新生成新的顏色隨機的方塊
      // 4. 每過一關方塊數量會增加，最高生成 8 * 8 的顏色隨機的方塊
      // 5. 有計分器及計時器，60秒倒數，時間到則跳出恭喜並顯示獲得幾分，並重頭開始遊戲

      // 設定起始關卡
      let level = 1
      // 設定起始分數
      let score = 0
      // 設定計時器
      let countInterval
      // 設定計時時間
      let remaining = 60
      // 設定控制遊戲暫停、執行的變數
      let gamePaused
      let gameStarted

      const record = document.querySelector('#record')
      const timer = document.querySelector('#timer')
      const scoreBoard = document.querySelector('#score-board')
      const startPauseBtn = document.querySelector('#start-pause-btn')
      const resetBtn = document.querySelector('#reset-btn')
      const cubeBox = document.querySelector('#cube-box')

      // 設定計時器格式
      function timerNum(num) {
        return num < 10 ? '0' + num : num
      }

      // 更新計時器的函數
      function updateTimer(remaining) {
        let min = parseInt(remaining / 60)
        let sec = parseInt(remaining % 60)
        let timerContent = `${timerNum(min)}:${timerNum(sec)}`
        timer.textContent = timerContent
      }

      // 執行計時器
      function countDown() {
        // 清除計時器，確保只有一個計時器存在
        clearInterval(countInterval)
        // 立即更新計時器，避免延遲
        updateTimer(remaining)
        countInterval = setInterval(() => {
          if (remaining <= 0) {
            clearInterval(countInterval)
            alert(`恭喜您獲得 ${score} 分`)
            updateRecord()
            resetGame()
          } else if (!gamePaused) {
            // 遊戲暫停時，計時暫停
            remaining--
            updateTimer(remaining)
          }
          // 每1000毫秒更新一次
        }, 1000)
      }

      // 產生新方塊
      function createCube() {
        let boxContent = ''
        const cube = document.querySelector('.cube')
        // 產生隨機顏色
        const r = Math.floor(Math.random() * 150)
        const g = Math.floor(Math.random() * 150)
        const b = Math.floor(Math.random() * 150)

        // 依關卡調整答案透明度
        let o
        if (level <= 31) {
          o = 0.7
        } else if (level <= 61) {
          o = 0.8
        } else {
          o = 0.9
        }

        // 設定方塊數量和排版
        let cubeCount
        let gridSize

        if (level < 2) {
          cubeCount = 4
          gridSize = '1fr 1fr'
        } else if (level < 6) {
          cubeCount = 9
          gridSize = '1fr 1fr 1fr'
        } else if (level < 11) {
          cubeCount = 16
          gridSize = '1fr 1fr 1fr 1fr'
        } else if (level < 16) {
          cubeCount = 25
          gridSize = '1fr 1fr 1fr 1fr 1fr'
        } else if (level < 21) {
          cubeCount = 36
          gridSize = '1fr 1fr 1fr 1fr 1fr 1fr'
        } else if (level < 26) {
          cubeCount = 49
          gridSize = '1fr 1fr 1fr 1fr 1fr 1fr 1fr'
        } else {
          cubeCount = 64
          gridSize = '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr'
        }

        cubeBox.style.gridTemplateColumns = gridSize
        // cubeBox.style.gridTemplateRows = gridSize

        // 產生隨機方塊為答案
        const randomIndex = Math.floor(Math.random() * cubeCount)
        for (let i = 0; i < cubeCount; i++) {
          if (i === randomIndex) {
            boxContent += `<div class="cube answer" style="background-color: rgb(${r}, ${g}, ${b}); opacity: ${o};"></div>`
          } else {
            boxContent += `<div class="cube" style="background-color: rgb(${r}, ${g}, ${b});"></div>`
          }
        }
        cubeBox.innerHTML = boxContent

        // 呼叫綁定事件的函式
        answerClick()
      }

      function answerClick() {
        const answerCube = document.querySelector('.answer')
        let scoreBoardContent = ''
        answerCube.addEventListener('click', function () {
          // 暫停時點擊不執行
          if (!gamePaused) {
            level++
            score++
            updateScore()
            createCube()
          }
        })
      }

      // 更新分數
      function updateScore() {
        let scoreBoardContent = `Score: ${score}`
        scoreBoard.textContent = scoreBoardContent
      }

      // 更新最高分
      let recordScore = 0
      function updateRecord() {
        if (score > recordScore) {
          alert(`恭喜您刷新紀錄！`)
          recordScore = score
          let recordContent = `Record: ${recordScore}`
          record.textContent = recordContent
        }
      }

      // 重設遊戲
      function resetGame() {
        level = 1
        score = 0
        remaining = 60
        updateScore()
        updateTimer(remaining)
        clearInterval(countInterval)
        boxContent = ''
        cubeBox.innerHTML = boxContent
        cubeBox.style.backgroundImage = 'url(./img/faker.jpg)'
        cubeBox.style.pointerEvents = 'none'
        gameStarted = false
        startPauseBtnContent = `遊<br />戲<br />開<br />始`
        startPauseBtn.innerHTML = startPauseBtnContent
      }

      // 開始遊戲
      startPauseBtn.addEventListener('click', function () {
        if (!gameStarted) {
          // 遊戲未開始時點擊
          // 設定遊戲開始
          gameStarted = true
          gamePaused = false
          cubeBox.style.backgroundImage = 'none'
          cubeBox.style.pointerEvents = 'auto'
          startPauseBtnContent = `遊<br />戲<br />暫<br />停`
          startPauseBtn.innerHTML = startPauseBtnContent
          createCube()
          countDown()
        } else if (gamePaused) {
          // 遊戲暫停時點擊
          // 設定遊戲繼續
          gamePaused = false
          cubeBox.style.backgroundImage = 'none'
          createCube()
          cubeBox.style.pointerEvents = 'auto'
          startPauseBtnContent = `遊<br />戲<br />暫<br />停`
          startPauseBtn.innerHTML = startPauseBtnContent
          countDown()
        } else {
          // 遊戲進行時點擊
          // 設定遊戲暫停
          gamePaused = true
          cubeBox.style.backgroundImage = 'url(./img/faker-sleeping.png)'
          cubeBox.innerHTML = ''
          cubeBox.style.pointerEvents = 'none'
          startPauseBtnContent = `遊<br />戲<br />繼<br />續`
          startPauseBtn.innerHTML = startPauseBtnContent
        }
      })

      // 重開一局
      resetBtn.addEventListener('click', function () {
        resetGame()
      })