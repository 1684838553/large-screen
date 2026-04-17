<template>
  <div class="hot-words">
    <div class="header">
      <span class="icon">◆</span>
      <span class="title">江西实时热词</span>
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

  const data = [
    { name: '庐山', value: 22 },
    { name: '陶瓷', value: 18 },
    { name: '红色旅游', value: 15 },
    { name: '滕王阁', value: 12 },
    { name: '婺源', value: 10 },
    { name: '美食', value: 8 },
    { name: '鄱阳湖', value: 6 },
    { name: '古镇', value: 5 }
  ]

  const option: echarts.EChartsOption = {
    tooltip: {
      show: true,
      backgroundColor: 'rgba(10, 30, 60, 0.9)',
      borderColor: '#ffa500',
      textStyle: { color: '#fff' },
      formatter: (params: any) => {
        return `${params.name}: ${params.value}%`
      }
    },
    series: [{
      type: 'graph',
      layout: 'force',
      data: data.map((item, index) => ({
        name: item.name,
        value: item.value,
        symbolSize: item.value * 2.5,
        category: index,
        label: {
          show: true,
          formatter: (params: any) => {
            return `${params.name}\n${params.value}%`
          },
          fontSize: item.value > 10 ? 12 : 10,
          color: '#fff'
        },
        itemStyle: {
          color: item.value > 15 ? '#ff9800' : 
                 item.value > 10 ? '#ffd700' : '#42a5f5',
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          shadowBlur: 10
        }
      })),
      roam: true,
      force: {
        repulsion: 100,
        edgeLength: 50,
        gravity: 0.1
      },
      emphasis: {
        focus: 'self',
        itemStyle: {
          shadowBlur: 20,
          shadowColor: 'rgba(255, 200, 100, 0.8)'
        }
      }
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
.hot-words {
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
