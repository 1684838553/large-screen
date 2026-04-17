<template>
  <div class="map-wrapper">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

const cityData = ref<any[]>([])

const topCities = computed(() => {
  return [...cityData.value]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
})

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

.map-container {
  width: 100%;
  height: 100%;
}

.ranking-panel {
  position: absolute;
  top: 20px;
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
</style>
