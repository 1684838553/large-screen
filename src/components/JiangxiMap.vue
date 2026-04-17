<template>
  <div class="map-wrapper">
    <div class="notice-banner">
      <div class="notice-content">
        <span class="notice-icon">📢</span>
        <div class="notice-text" v-if="currentCity">
          <span class="city-name">{{ currentCity.name }}</span>
          <span class="desc">人口达到</span>
          <span class="highlight">{{ currentCity.value }}万人</span>
        </div>
      </div>
    </div>
    <div ref="chartRef" class="map-container"></div>
    <div class="ranking-panel">
      <h4>人口排名 TOP5</h4>
      <ul>
        <li v-for="(item, index) in topCities" :key="item.name" :class="`rank-${index + 1}`">
          <span class="rank-num">{{ index + 1 }}</span>
          <span class="city-name">{{ item.name }}</span>
          <span class="city-value">{{ item.value }}万人</span>
        </li>
      </ul>
    </div>
    <div class="stats-panel">
      <div class="stat-card" v-for="(stat, index) in statsData" :key="index">
        <div class="stat-title">{{ stat.title }}</div>
        <div class="stat-content">
          <div class="stat-icon">
            <span>{{ stat.icon }}</span>
          </div>
          <div class="stat-data">
            <div class="stat-value">
              <span class="number">{{ stat.value }}</span>
              <span class="unit">{{ stat.unit }}</span>
            </div>
            <div class="stat-trend">
              <span class="trend-label">较上次</span>
              <span class="trend-arrow" :class="stat.trend > 0 ? 'up' : 'down'">
                {{ stat.trend > 0 ? '▲' : '▼' }}{{ Math.abs(stat.trend) }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null
let carouselTimer: number | null = null

const cityData = ref<any[]>([])
const currentIndex = ref(0)

const currentCity = computed(() => {
  return cityData.value[currentIndex.value] || null
})

const topCities = computed(() => {
  return [...cityData.value]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
})

const statsData = ref([
  {
    title: '2022年旅游业收入',
    icon: '💰',
    value: '10,387.6',
    unit: '万元',
    trend: -7.3
  },
  {
    title: '来访游客数',
    icon: '🧳',
    value: '622.4',
    unit: '万人',
    trend: -5.2
  },
  {
    title: '人口出游支出',
    icon: '💳',
    value: '7,331.6',
    unit: '万元',
    trend: -3.8
  }
])

const startCarousel = () => {
  if (cityData.value.length === 0) return
  carouselTimer = window.setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % cityData.value.length
  }, 3000)
}

const stopCarousel = () => {
  if (carouselTimer) {
    clearInterval(carouselTimer)
    carouselTimer = null
  }
}

const initMap = async () => {
  if (!chartRef.value) return

  try {
    const response = await fetch('/geo/jiangxi.json')
    const geoJson = await response.json()
    
    echarts.registerMap('jiangxi', geoJson)
    
    cityData.value = generateMockData(geoJson)
    
    chartInstance = echarts.init(chartRef.value)
    
    const rankedData = [...cityData.value].sort((a, b) => b.value - a.value)
    
    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(10, 30, 60, 0.9)',
        borderColor: '#ffa500',
        borderWidth: 1,
        textStyle: {
          color: '#fff'
        },
        formatter: (params: any) => {
          if (params.seriesType === 'map' || params.seriesType === 'scatter') {
            const data = cityData.value.find(d => d.name === params.name)
            return `<div style="padding: 5px;">
              <div style="font-size: 16px; font-weight: bold; color: #ffa500;">${params.name}</div>
              <div style="margin-top: 5px;">人口: <span style="color: #fff; font-weight: bold;">${data?.value || 0}</span> 万人</div>
            </div>`
          }
          return params.name
        }
      },
      visualMap: {
        show: true,
        left: 20,
        bottom: 30,
        min: 100,
        max: 500,
        text: ['高', '低'],
        textStyle: {
          color: '#fff',
          fontSize: 12
        },
        inRange: {
          color: ['#0d47a1', '#1565c0', '#1e88e5', '#42a5f5', '#64b5f6']
        },
        calculable: true,
        itemWidth: 15,
        itemHeight: 100
      },
      geo: {
        map: 'jiangxi',
        roam: true,
        zoom: 1.1,
        center: [115.9, 27.6],
        label: {
          show: true,
          color: '#fff',
          fontSize: 11
        },
        itemStyle: {
          areaColor: '#1a5fb4',
          borderColor: '#ffa500',
          borderWidth: 2,
          shadowColor: 'rgba(255, 165, 0, 0.4)',
          shadowBlur: 15,
          shadowOffsetX: 2,
          shadowOffsetY: 3
        },
        emphasis: {
          label: {
            show: true,
            color: '#fff',
            fontSize: 13
          },
          itemStyle: {
            areaColor: '#29b6f6',
            shadowColor: 'rgba(255, 165, 0, 0.6)',
            shadowBlur: 20
          }
        },
        select: {
          label: {
            show: true,
            color: '#fff'
          },
          itemStyle: {
            areaColor: '#0288d1'
          }
        }
      },
      series: [
        {
          name: '江西省',
          type: 'map',
          map: 'jiangxi',
          geoIndex: 0,
          data: cityData.value.map(item => ({
            name: item.name,
            value: item.value
          }))
        },
        {
          name: '城市数据',
          type: 'scatter',
          coordinateSystem: 'geo',
          symbol: 'circle',
          symbolSize: (val: number[]) => {
            return Math.sqrt(val[2]) * 0.8
          },
          label: {
            show: true,
            formatter: (params: any) => {
              const data = cityData.value.find(d => d.name === params.name)
              return `{value|${data?.value || 0}}`
            },
            position: 'right',
            color: '#ffa500',
            fontSize: 11,
            fontWeight: 'bold',
            rich: {
              value: {
                color: '#ffa500',
                fontSize: 11,
                fontWeight: 'bold'
              }
            }
          },
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.4,
              y: 0.4,
              r: 1,
              colorStops: [
                { offset: 0, color: '#fff' },
                { offset: 0.3, color: '#ffcc80' },
                { offset: 1, color: '#ff9800' }
              ]
            },
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 8
          },
          data: cityData.value.map((item: any) => ({
            name: item.name,
            value: [...item.center, item.value]
          })),
          zlevel: 5
        },
        {
          name: 'TOP排名',
          type: 'scatter',
          coordinateSystem: 'geo',
          symbol: 'pin',
          symbolSize: 40,
          label: {
            show: true,
            formatter: (params: any) => {
              return `${params.dataIndex + 1}`
            },
            color: '#fff',
            fontSize: 14,
            fontWeight: 'bold'
          },
          itemStyle: {
            color: (params: any) => {
              const colors = ['#ff5252', '#ff9800', '#ffc107', '#4caf50', '#2196f3']
              return colors[params.dataIndex] || '#ff9800'
            },
            shadowColor: 'rgba(0, 0, 0, 0.4)',
            shadowBlur: 10
          },
          data: rankedData.slice(0, 5).map((item: any) => ({
            name: item.name,
            value: [...item.center, item.value]
          })),
          zlevel: 10
        }
      ]
    }
    
    chartInstance.setOption(option)
    startCarousel()
  } catch (error) {
    console.error('地图初始化失败:', error)
  }
}

const generateMockData = (geoJson: any) => {
  return geoJson.features.map((feature: any) => ({
    name: feature.properties.name,
    value: Math.round(Math.random() * 400 + 100),
    center: feature.properties.center || feature.properties.centroid
  }))
}

const resizeChart = () => {
  chartInstance?.resize()
}

onMounted(() => {
  initMap()
  window.addEventListener('resize', resizeChart)
})

onBeforeUnmount(() => {
  stopCarousel()
  window.removeEventListener('resize', resizeChart)
  chartInstance?.dispose()
})
</script>

<style scoped lang="scss">
.map-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.notice-banner {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  max-width: 90%;
  
  .notice-content {
    display: flex;
    align-items: center;
    background: linear-gradient(
      135deg,
      rgba(60, 40, 20, 0.85) 0%,
      rgba(80, 55, 30, 0.8) 30%,
      rgba(90, 60, 35, 0.75) 50%,
      rgba(70, 45, 25, 0.8) 70%,
      rgba(50, 35, 20, 0.85) 100%
    );
    border: 1px solid rgba(180, 140, 80, 0.4);
    border-radius: 6px;
    padding: 12px 25px;
    box-shadow: 
      0 2px 15px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 220, 150, 0.15),
      inset 0 -1px 0 rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);
  }
  
  .notice-icon {
    font-size: 20px;
    margin-right: 10px;
    animation: pulse 1s ease-in-out infinite;
  }
  
  .notice-text {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #fff;
    font-size: 14px;
    min-width: 200px;
    animation: fadeIn 0.5s ease-in-out;
  }
  
  .city-name {
    color: #fff;
    font-weight: bold;
    font-size: 16px;
  }
  
  .desc {
    color: rgba(255, 255, 255, 0.9);
    margin: 0 4px;
  }
  
  .highlight {
    color: #ffd700;
    font-weight: bold;
    font-size: 18px;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.map-container {
  width: 100%;
  height: calc(100% - 50px);
  margin-top: 50px;
}

.ranking-panel {
  position: absolute;
  top: 70px;
  left: 20px;
  background: linear-gradient(135deg, rgba(10, 30, 60, 0.95), rgba(20, 50, 80, 0.9));
  border: 1px solid rgba(255, 165, 0, 0.5);
  border-radius: 8px;
  padding: 15px;
  box-shadow: 
    0 4px 15px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
    color: #ffa500;
    text-align: center;
    letter-spacing: 2px;
    text-shadow: 0 0 10px rgba(255, 165, 0, 0.5);
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      display: flex;
      align-items: center;
      padding: 8px 10px;
      margin: 5px 0;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
      transition: all 0.3s;
      
      &:hover {
        background: rgba(255, 165, 0, 0.15);
        transform: translateX(3px);
      }
      
      &.rank-1 .rank-num { background: linear-gradient(135deg, #ff5252, #d32f2f); }
      &.rank-2 .rank-num { background: linear-gradient(135deg, #ff9800, #f57c00); }
      &.rank-3 .rank-num { background: linear-gradient(135deg, #ffc107, #ff8f00); }
      &.rank-4 .rank-num { background: linear-gradient(135deg, #4caf50, #388e3c); }
      &.rank-5 .rank-num { background: linear-gradient(135deg, #2196f3, #1976d2); }
      
      .rank-num {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-size: 12px;
        font-weight: bold;
        color: #fff;
        margin-right: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }
      
      .city-name {
        flex: 1;
        color: #fff;
        font-size: 13px;
      }
      
      .city-value {
        color: #ffa500;
        font-size: 13px;
        font-weight: bold;
        text-shadow: 0 0 8px rgba(255, 165, 0, 0.5);
      }
    }
  }
}

.stats-panel {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  z-index: 10;
  
  .stat-card {
    background: linear-gradient(135deg, rgba(15, 30, 50, 0.95), rgba(25, 45, 70, 0.9));
    border: 1px solid rgba(100, 180, 255, 0.3);
    border-radius: 8px;
    padding: 15px 20px;
    min-width: 200px;
    box-shadow: 
      0 4px 20px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    
    .stat-title {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.7);
      text-align: center;
      margin-bottom: 12px;
      letter-spacing: 1px;
    }
    
    .stat-content {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .stat-icon {
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(20, 40, 60, 0.8);
      border: 2px solid rgba(255, 200, 100, 0.4);
      border-radius: 8px;
      box-shadow: 
        0 0 15px rgba(255, 200, 100, 0.2),
        inset 0 0 10px rgba(255, 200, 100, 0.1);
      
      span {
        font-size: 24px;
      }
    }
    
    .stat-data {
      flex: 1;
    }
    
    .stat-value {
      display: flex;
      align-items: baseline;
      gap: 5px;
      margin-bottom: 5px;
      
      .number {
        font-size: 22px;
        font-weight: bold;
        color: #ffd700;
        text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
      }
      
      .unit {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }
    }
    
    .stat-trend {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      
      .trend-label {
        color: rgba(255, 255, 255, 0.5);
      }
      
      .trend-arrow {
        font-weight: bold;
        
        &.up {
          color: #ff5252;
        }
        
        &.down {
          color: #4caf50;
        }
      }
    }
  }
}
</style>
