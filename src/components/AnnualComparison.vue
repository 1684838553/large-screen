<template>
  <div class="annual-comparison">
    <div class="header">
      <span class="icon">◆</span>
      <span class="title">年度接待游客比</span>
    </div>
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

const initChart = async () => {
  await nextTick()
  
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月']
  
  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10, 30, 60, 0.9)',
      borderColor: '#ffa500',
      textStyle: { color: '#fff' }
    },
    legend: {
      data: ['2021年', '2022年'],
      top: 5,
      right: 10,
      textStyle: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 10
      },
      itemWidth: 12,
      itemHeight: 8
    },
    grid: {
      left: '15%',
      right: '8%',
      top: '22%',
      bottom: '18%'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: months,
      axisLine: {
        lineStyle: { color: 'rgba(255, 255, 255, 0.3)' }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 9
      },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      name: '万人',
      nameTextStyle: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 9
      },
      axisLine: { show: false },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 9
      },
      splitLine: {
        lineStyle: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    },
    series: [
      {
        name: '2021年',
        type: 'line',
        smooth: true,
        data: [120, 100, 150, 180, 200, 220, 280, 260, 300, 250, 200],
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(255, 152, 0, 0.6)' },
              { offset: 1, color: 'rgba(255, 152, 0, 0.1)' }
            ]
          }
        },
        lineStyle: {
          color: '#ff9800',
          width: 2
        },
        itemStyle: { color: '#ff9800' },
        symbolSize: 4
      },
      {
        name: '2022年',
        type: 'line',
        smooth: true,
        data: [150, 130, 180, 220, 250, 280, 350, 320, 380, 300, 250],
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(30, 136, 229, 0.6)' },
              { offset: 1, color: 'rgba(30, 136, 229, 0.1)' }
            ]
          }
        },
        lineStyle: {
          color: '#1e88e5',
          width: 2
        },
        itemStyle: { color: '#1e88e5' },
        symbolSize: 4
      }
    ]
  }

  chartInstance.setOption(option)
}

const resizeChart = () => {
  chartInstance?.resize()
}

onMounted(() => {
  setTimeout(() => {
    initChart()
  }, 100)
  window.addEventListener('resize', resizeChart)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  chartInstance?.dispose()
})
</script>

<style scoped lang="scss">
.annual-comparison {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255, 200, 100, 0.3);
    margin-bottom: 10px;
    
    .icon {
      color: #ffd700;
      font-size: 12px;
    }
    
    .title {
      color: #fff;
      font-size: 14px;
      font-weight: bold;
      letter-spacing: 2px;
    }
  }
  
  .chart-container {
    flex: 1;
    width: 100%;
  }
}
</style>
