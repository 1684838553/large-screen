<template>
  <div class="visitor-top5">
    <div class="header">
      <span class="icon">◆</span>
      <span class="title">接待游客人数TOP5</span>
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

  const cities = ['南昌市', '九江市', '上饶市', '景德镇', '鹰潭市']
  const values = [123, 100, 125, 100, 95]
  const maxValue = Math.max(...values)

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10, 30, 60, 0.9)',
      borderColor: '#ffa500',
      textStyle: { color: '#fff' },
      formatter: (params: any) => {
        const data = params[0]
        return `${data.name}<br/>游客人数: ${data.value}万人次`
      }
    },
    grid: {
      left: '18%',
      right: '10%',
      top: '15%',
      bottom: '15%'
    },
    xAxis: {
      type: 'category',
      data: cities,
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
      name: '万人次',
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
    series: [{
      type: 'pictorialBar',
      symbolSize: [20, 6],
      symbolOffset: [0, 0],
      symbolPosition: 'end',
      z: 12,
      itemStyle: {
        color: (params: any) => {
          return values[params.dataIndex] >= maxValue ? '#ff9800' : '#42a5f5'
        }
      },
      data: values
    }, {
      type: 'pictorialBar',
      symbolSize: [20, 6],
      symbolOffset: [0, 3],
      z: 11,
      itemStyle: {
        color: (params: any) => {
          return values[params.dataIndex] >= maxValue ? '#ff9800' : '#42a5f5'
        },
        opacity: 0.6
      },
      data: values
    }, {
      type: 'pictorialBar',
      symbolSize: [20, 6],
      symbolOffset: [0, 6],
      z: 10,
      itemStyle: {
        color: (params: any) => {
          return values[params.dataIndex] >= maxValue ? '#ff9800' : '#42a5f5'
        },
        opacity: 0.3
      },
      data: values
    }, {
      name: 'hill',
      type: 'pictorialBar',
      symbol: 'path://M0,10 L10,10 C5.5,10 5.5,0 5,0 C4.5,0 4.5,10 0,10 z',
      itemStyle: {
        color: (params: any) => {
          const colors = values[params.dataIndex] >= maxValue 
            ? ['rgba(255, 152, 0, 0.8)', 'rgba(255, 152, 0, 0.2)']
            : ['rgba(66, 165, 245, 0.8)', 'rgba(66, 165, 245, 0.2)']
          return {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: colors[0] },
              { offset: 1, color: colors[1] }
            ]
          }
        }
      },
      label: {
        show: true,
        position: 'top',
        color: '#ffd700',
        fontSize: 10,
        fontWeight: 'bold',
        formatter: '{c}'
      },
      data: values,
      barWidth: 25
    }]
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
.visitor-top5 {
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
