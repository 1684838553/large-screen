<template>
  <div class="dashboard">
    <header class="header">
      <h1>数据可视化大屏</h1>
    </header>
    
    <main class="content">
      <section class="left">
        <div class="panel">
          <div class="chart-section ranking">
            <ScenicRanking />
          </div>
          <div class="chart-section age">
            <AgeDistribution />
          </div>
          <div class="chart-section annual">
            <AnnualComparison />
          </div>
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
          <div class="chart-section industry">
            <IndustryIncome />
          </div>
          <div class="chart-section visitor">
            <VisitorTop5 />
          </div>
          <div class="chart-section hotwords">
            <HotWords />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import JiangxiMap from '@/components/JiangxiMap.vue'
import ScenicRanking from '@/components/ScenicRanking.vue'
import AgeDistribution from '@/components/AgeDistribution.vue'
import AnnualComparison from '@/components/AnnualComparison.vue'
import IndustryIncome from '@/components/IndustryIncome.vue'
import VisitorTop5 from '@/components/VisitorTop5.vue'
import HotWords from '@/components/HotWords.vue'
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
      padding: 15px;
      display: flex;
      flex-direction: column;
      gap: 15px;
      
      h3 {
        margin-bottom: 20px;
        font-size: 18px;
        color: #409eff;
      }
      
      .chart-section {
        background: rgba(10, 30, 60, 0.6);
        border: 1px solid rgba(100, 180, 255, 0.2);
        border-radius: 6px;
        padding: 10px;
        
        &.ranking {
          flex: 1.2;
        }
        
        &.age {
          flex: 1;
        }
        
        &.annual {
          flex: 1;
        }
        
        &.industry {
          flex: 1;
        }
        
        &.visitor {
          flex: 1;
        }
        
        &.hotwords {
          flex: 1.2;
        }
      }
    }
    
    .center .panel {
      display: block;
      padding: 15px;
    }
    
    .right .panel {
      padding: 10px;
    }
  }
}
</style>
