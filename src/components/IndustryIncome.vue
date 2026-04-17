<template>
  <div class="industry-income">
    <div class="header">
      <span class="icon">◆</span>
      <span class="title">各行业收入</span>
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

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10, 30, 60, 0.9)',
      borderColor: '#ffa500',
      textStyle: { color: '#fff' },
      formatter: (params: any) => {
        const data = params[0]
        return `${data.name}<br/>收入: ${data.value}亿`
      }
    },
    grid: {
      left: '15%',
      right: '8%',
      top: '15%',
      bottom: '18%'
    },
    xAxis: {
      type: 'category',
      data: ['旅游', '住宿', '餐饮', '购物', '娱乐', '交通', '其他'],
      axisLine: {
        lineStyle: { color: 'rgba(255, 255, 255, 0.3)' }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 9,
        interval: 0,
        rotate: 15
      },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      name: '亿',
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
      type: 'bar',
      data: [
        { value: 100, itemStyle: { color: '#42a5f5' } },
        { value: 200, itemStyle: { color: '#ff9800' } },
        { value: 300, itemStyle: { color: '#42a5f5' } },
        { value: 400, itemStyle: { color: '#42a5f5' } },
        { value: 500, itemStyle: { color: '#42a5f5' } },
        { value: 600, itemStyle: { color: '#42a5f5' } },
        { value: 700, itemStyle: { color: '#42a5f5' } }
      ],
      barWidth: '45%',
      itemStyle: {
        borderRadius: [4, 4, 0, 0]
      },
      label: {
        show: true,
        position: 'top',
        color: '#ffd700',
        fontSize: 9,
        fontWeight: 'bold',
        formatter: '{c}'
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
.industry-income {
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
