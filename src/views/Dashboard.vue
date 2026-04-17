<template>
  <div class="dashboard">
    <header class="header">
      <div class="header-bg">
        <div class="decoration-left">
          <span class="stripe"></span>
          <span class="stripe"></span>
          <span class="stripe"></span>
          <span class="stripe"></span>
          <span class="stripe"></span>
          <span class="stripe"></span>
        </div>
        <div class="title-wrapper">
          <h1>江西省旅游指标监控平台</h1>
        </div>
        <div class="decoration-right">
          <span class="stripe"></span>
          <span class="stripe"></span>
          <span class="stripe"></span>
          <span class="stripe"></span>
          <span class="stripe"></span>
          <span class="stripe"></span>
        </div>
      </div>
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
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: linear-gradient(180deg, 
      rgba(20, 40, 80, 0.8) 0%, 
      rgba(10, 30, 60, 0.6) 50%,
      transparent 100%
    );
    
    .header-bg {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      position: relative;
    }
    
    .decoration-left,
    .decoration-right {
      display: flex;
      flex-direction: column;
      gap: 4px;
      position: absolute;
      z-index: 1;
      
      .stripe {
        width: 60px;
        height: 6px;
        background: linear-gradient(90deg, 
          rgba(255, 165, 0, 0.9) 0%,
          rgba(255, 200, 100, 0.7) 50%,
          rgba(255, 165, 0, 0.4) 100%
        );
        transform: skewX(-20deg);
        box-shadow: 
          0 0 8px rgba(255, 165, 0, 0.6),
          inset 0 1px 0 rgba(255, 255, 255, 0.3);
        
        &:nth-child(1) { opacity: 1; width: 70px; }
        &:nth-child(2) { opacity: 0.9; width: 60px; }
        &:nth-child(3) { opacity: 0.8; width: 50px; }
        &:nth-child(4) { opacity: 0.7; width: 40px; }
        &:nth-child(5) { opacity: 0.6; width: 35px; }
        &:nth-child(6) { opacity: 0.5; width: 30px; }
      }
    }
    
    .decoration-left {
      left: 80px;
    }
    
    .decoration-right {
      right: 80px;
      
      .stripe {
        transform: skewX(20deg);
      }
    }
    
    .title-wrapper {
      background: linear-gradient(135deg, 
        rgba(20, 50, 100, 0.9) 0%,
        rgba(30, 70, 130, 0.85) 50%,
        rgba(20, 50, 100, 0.9) 100%
      );
      border: 2px solid rgba(100, 180, 255, 0.5);
      border-radius: 8px;
      padding: 15px 60px;
      position: relative;
      box-shadow: 
        0 0 30px rgba(100, 180, 255, 0.3),
        0 0 60px rgba(100, 180, 255, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.2),
        inset 0 -1px 0 rgba(0, 0, 0, 0.2);
      
      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 0;
        height: 0;
        border-style: solid;
      }
      
      &::before {
        left: -20px;
        border-width: 15px 20px 15px 0;
        border-color: transparent rgba(30, 70, 130, 0.85) transparent transparent;
      }
      
      &::after {
        right: -20px;
        border-width: 15px 0 15px 20px;
        border-color: transparent transparent transparent rgba(30, 70, 130, 0.85);
      }
      
      h1 {
        font-size: 28px;
        letter-spacing: 6px;
        color: #fff;
        text-shadow: 
          0 0 20px rgba(100, 180, 255, 0.8),
          0 0 40px rgba(100, 180, 255, 0.4),
          0 2px 4px rgba(0, 0, 0, 0.3);
        font-weight: bold;
        margin: 0;
        white-space: nowrap;
      }
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
