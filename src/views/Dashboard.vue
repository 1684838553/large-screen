<template>
  <div class="dashboard">
    <header class="header">
      <h1>数据可视化大屏</h1>
    </header>
    
    <main class="content">
      <section class="left">
        <div class="panel">
          <h3>左侧图表区域</h3>
          <BaseChart :option="chartOption" />
        </div>
      </section>
      
      <section class="center">
        <div class="panel">
          <h3>中央地图区域</h3>
          <JiangxiMap />
        </div>
      </section>
      
      <section class="right">
        <div class="panel">
          <h3>右侧图表区域</h3>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseChart from '@/components/BaseChart.vue'
import JiangxiMap from '@/components/JiangxiMap.vue'

const chartOption = ref({
  title: {
    text: '示例图表',
    textStyle: { color: '#fff' }
  },
  tooltip: {},
  xAxis: {
    data: ['A', 'B', 'C', 'D', 'E'],
    axisLine: { lineStyle: { color: '#fff' } }
  },
  yAxis: {
    axisLine: { lineStyle: { color: '#fff' } }
  },
  series: [{
    type: 'bar',
    data: [10, 20, 30, 40, 50],
    itemStyle: {
      color: '#409eff'
    }
  }]
})
</script>

<style scoped lang="scss">
.dashboard {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .header {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to bottom, rgba(0, 100, 200, 0.3), transparent);
    
    h1 {
      font-size: 32px;
      letter-spacing: 8px;
    }
  }
  
  .content {
    flex: 1;
    display: flex;
    padding: 20px;
    gap: 20px;
    
    .left, .right {
      width: 400px;
    }
    
    .center {
      flex: 1;
    }
    
    .panel {
      width: 100%;
      height: 100%;
      background: rgba(0, 100, 200, 0.2);
      border: 1px solid rgba(0, 100, 200, 0.5);
      border-radius: 8px;
      padding: 20px;
      
      h3 {
        margin-bottom: 20px;
        font-size: 18px;
        color: #409eff;
      }
    }
  }
}
</style>
