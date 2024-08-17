const url = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-B397F97E-9944-4693-A57E-17CCF4C6049D'

// 取得資料
getData()

function getData() {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      sortCity(data.records.location)
      generateCards(data.records.location)
      switchRegion(data.records.location)
      getTime()
    })
    .catch(error => {
      console.log(error)
    })
}

//小卡排序
function sortCity (locations) {
  const cityOrders = [13, 3 , 14, 6, 7, 4, 16, 1, 8, 12, 19, 9, 20, 5, 11, 17, 22, 18, 2, 15, 10, 21]

  locations.forEach((city, index) => {
    city.cityOrder = cityOrders[index]
  })
  locations = locations.sort((a, b) => a.cityOrder - b.cityOrder)
}

// 動態生成小卡
function generateCards(locations) {
  const container = document.querySelector('.container')
  // 清空既有卡片
  container.innerHTML = ''

  locations.forEach(location => {
    const card = document.createElement('div')
    card.className = 'card animated'
    
    const cardContent = `
      <div class="card-content">
        <div class="city-name">${location.locationName}</div>
        <div class="condition">${location.weatherElement[0].time[1].parameter.parameterName}</div>
        <div class="icon"></div>
        <div class="temperature">${location.weatherElement[2].time[1].parameter.parameterName}°C~${location.weatherElement[4].time[1].parameter.parameterName}°C</div>
        <div class="rain-rate"><i class="fa-solid fa-droplet" style="color: #113285"></i> ${location.weatherElement[1].time[1].parameter.parameterName}%</div>
      </div>
    `
    
    card.innerHTML = cardContent
    container.appendChild(card)
    
    // 設置天氣圖示
    setWeatherIcon(card, location.weatherElement[0].time[1].parameter.parameterValue)
  })

  // 重新套用卡片特效
  applyCardEffects()
}

// 設置天氣圖示
function setWeatherIcon(card, conditionValue) {
  const icon = card.querySelector('.icon')
  if (conditionValue === '1') {
    // 晴天
    icon.innerHTML = '<div class="sunny"><div class="sun"><div class="sun-1"></div><div class="sun-2"></div><div class="sun-3"></div><div class="sun-4"></div><div class="sun-5"></div><div class="sun-6"></div><div class="sun-7"></div><div class="sun-8"></div><div class="sun-9"></div><div class="sun-10"></div><div class="sun-11"></div><div class="sun-12"></div></div></div>'
  } else if (
    conditionValue === '2' ||
    conditionValue === '3'
  ) {
    // 晴時多雲
    icon.innerHTML = '<div class="sunny-cloudy"><div class="cloudy-sun"></div><div class="cloudy-cloud"></div></div>'
  } else if (conditionValue === '4') {
    // 多雲
    icon.innerHTML = '<div class="cloudy"><div class="cloudy-cloud"></div><div class="cloudy-cloud-left"></div><div class="cloudy-cloud-right"></div></div></div>'
  } else if (
    conditionValue === '5' ||
    conditionValue === '6' ||
    conditionValue === '7'
  ) {
    // 陰天
    icon.innerHTML = '<div class="gray-cloudy"><div class="gray-cloud"></div><div class="gray-cloud-left"></div><div class="gray-cloud-right"></div></div></div>'
  } else if (conditionValue === '8' || conditionValue === '9' || conditionValue === '10' || conditionValue === '11' || conditionValue === '12' || conditionValue === '13' || conditionValue === '14' || conditionValue === '19' || conditionValue === '20' || conditionValue === '29' || conditionValue === '30') {
    // 雨天
    icon.innerHTML = '<div class="rainy"><div class="thunderstorm-cloud"></div><div class="raindrop raindrop-1"></div><div class="raindrop raindrop-2"></div><div class="raindrop raindrop-3"></div></div>'
  } else if (conditionValue === '15' || conditionValue === '16' || conditionValue === '17' || conditionValue === '18' || conditionValue === '21' || conditionValue === '22' || conditionValue === '33' || conditionValue === '34') {
    // 雷雨
    icon.innerHTML = '<div class="thunderstorm"><div class="thunderstorm-cloud"></div><div class="thunder"></div></div>'
  } else if (conditionValue === '23' || conditionValue === '42') {
    // 雪天
    icon.innerHTML = '<div class="snowy"><div class="thunderstorm-cloud"></div><div class="snowflake snowflake-1"></div><div class="snowflake snowflake-2"></div><div class="snowflake snowflake-3"></div></div>'
  } else if (conditionValue === '24' || conditionValue === '25' || conditionValue === '26' || conditionValue === '27' || conditionValue === '28') {
    // 霧天
    icon.innerHTML = '<div class="hazy"><div class="thunderstorm-cloud"></div><div class="fog fog-1"></div><div class="fog fog-2"></div></div>'
  } else if (conditionValue === '31' || conditionValue === '32' || conditionValue === '38' || conditionValue === '39') {
    // 霧雨
    icon.innerHTML = '<div class="hazy"><div class="thunderstorm-cloud"></div><div class="fog fog-3"></div><div class="fog fog-4"></div><div class="raindrop raindrop-4"></div><div class="raindrop raindrop-5"></div><div class="raindrop raindrop-6"></div></div>'
  } else if (conditionValue === '35' || conditionValue === '36' || conditionValue === '41') {
    // 霧雷雨
    icon.innerHTML = '<div class="hazy"><div class="thunderstorm-cloud"></div><div class="fog fog-3"></div><div class="fog fog-4"></div><div class="thunder"></div></div>'
  } else if (conditionValue === '37') {
    // 霧雪雨
    icon.innerHTML = '<div class="hazy"><div class="thunderstorm-cloud"></div><div class="fog fog-3"></div><div class="fog fog-4"></div><div class="snowflake snowflake-4"></div><div class="snowflake snowflake-5"></div><div class="snowflake snowflake-6"></div></div>'
  }
}

// 卡片特效
// 讓html優先加載，再執行js
document.addEventListener('DOMContentLoaded', applyCardEffects)

// 套用卡片特效
function applyCardEffects() {
  const cards = document.querySelectorAll('.card')
  // 新增<style>元素
  const style = document.createElement('style')
  // 將<style>元素放到<head>中
  // 方便後續變相新增css
  document.head.appendChild(style)

  // 宣告動畫計時器
  let animationTimeout

  cards.forEach(card => {
    card.addEventListener('mousemove', handleInteraction)
    card.addEventListener('mouseout', endInteraction)
  })

  // 畫面互動的函式
  function handleInteraction(event) {
    // 取得目標卡片
    const card = event.currentTarget

    // 用來儲存滑鼠位置之變數
    let posX, posY

    // 取得滑鼠相對於卡片的位置
    posX = event.offsetX
    posY = event.offsetY

    // 取得卡片的寬高
    // offsetWidth / offsetHeight 為元素在頁面實際佔據的寬高，不包含邊框
    const cardWidth = card.offsetWidth
    const cardHeight = card.offsetHeight

    // 計算卡片旋轉角度，不超過20度（正負10度）
    const rotateY = ((posX - cardWidth / 2) / cardWidth) * 20
    const rotateX = ((cardHeight / 2 - posY) / cardHeight) * 20

    // 計算閃光效果的位置
    // 乘以100，轉換為百分比
    const sparkleX = (posX / cardWidth) * 100
    const sparkleY = (posY / cardHeight) * 100
    // 計算閃光效果的大小
    // Math.abs() 取絕對值
    const sparkleSize = 20 + Math.abs(rotateX) + Math.abs(rotateY)

    // 設定卡片旋轉
    // perspective() 用來設定視距，越大透視效果越弱
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`

    // 設定閃光效果
    style.textContent = `
      .card:hover::after {
        background-position: ${sparkleX}% ${sparkleY}%
        opacity: ${sparkleSize / 100}
      }
    `

    // 清除其餘卡片動畫
    clearTimeout(animationTimeout)
  }

  // 停止畫面互動的函式
  function endInteraction(event) {
    const card = event.currentTarget
    // 重置卡片狀態
    card.style.transform = ''
    style.textContent = ''

    animationTimeout = setTimeout(() => {
      card.classList.add('animated')
      // 給予2.5秒延遲讓卡片恢復原狀
    }, 2500)
  }
}

// 切換區域
const northernRegion = ['臺北市', '新北市', '基隆市', '桃園市', '新竹市', '新竹縣', '宜蘭縣']
const centralRegion = ['苗栗縣', '臺中市', '彰化縣', '南投縣', '雲林縣']
const southernRegion = ['嘉義縣', '嘉義市', '臺南市', '高雄市', '屏東縣', '澎湖縣']
const easternRegion = ['臺東縣', '花蓮縣']
const islandRegion = ['金門縣', '連江縣']

// 切換區域
function switchRegion(locations) {
  const buttons = [
    {id: 'all', filter: () => locations},
    {id: 'northern', filter: location => northernRegion.includes(location.locationName)},
    {id: 'central', filter: location => centralRegion.includes(location.locationName)},
    {id: 'southern', filter: location => southernRegion.includes(location.locationName)},
    {id: 'eastern', filter: location => easternRegion.includes(location.locationName)},
    {id: 'island', filter: location => islandRegion.includes(location.locationName)}
  ]

  buttons.forEach(button => {
    const btn = document.querySelector(`#${button.id}`)
    btn.addEventListener('click', () => {
      const aimedLocations = locations.filter(button.filter)
      generateCards(aimedLocations)
    })
  })
}

// 返回頂部
const goTopBtn = document.querySelector('#go-top-btn')
goTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

window.addEventListener('scroll', displayGoTopBtn)

function displayGoTopBtn() {
  if (window.scrollY > 300) {
    goTopBtn.style.display = 'block'
  } else {
    goTopBtn.style.display = 'none'
  }
}

// 顯示日期
function getTime() {
  const time = document.querySelector('.time')
  const now = new Date()
  const month = now.getMonth() + 1
  const day = addZero(now.getDate())
  time.innerHTML = `${month}月${day}日`
}

function addZero(num) {
  return num < 10 ? '0' + num : num
}