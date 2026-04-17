<template>
  <div class="scenic-ranking">
    <div class="header">
      <span class="icon">◆</span>
      <span class="title">景点人流排名</span>
    </div>
    <div class="ranking-list" ref="listRef">
      <div 
        class="ranking-item" 
        v-for="(item, index) in visibleItems" 
        :key="item.id"
      >
        <span class="rank">NO.{{ item.rank }}</span>
        <span class="name">{{ item.name }}</span>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: item.percent + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const listRef = ref<HTMLDivElement>()
let scrollTimer: number | null = null
const currentIndex = ref(0)

const rankingData = [
  { id: 1, rank: 1, name: '庐山风景区', count: 5200 },
  { id: 2, rank: 2, name: '井冈山景区', count: 4800 },
  { id: 3, rank: 3, name: '三清山景区', count: 4500 },
  { id: 4, rank: 4, name: '龙虎山景区', count: 4200 },
  { id: 5, rank: 5, name: '婺源江湾景区', count: 3800 },
  { id: 6, rank: 6, name: '滕王阁景区', count: 3500 },
  { id: 7, rank: 7, name: '鄱阳湖景区', count: 3200 },
  { id: 8, rank: 8, name: '景德镇古窑', count: 2800 },
  { id: 9, rank: 9, name: '明月山景区', count: 2500 },
  { id: 10, rank: 10, name: '武功山景区', count: 2200 },
  { id: 11, rank: 11, name: '龟峰景区', count: 1800 },
  { id: 12, rank: 12, name: '大觉山景区', count: 1500 }
]

const maxCount = Math.max(...rankingData.map(d => d.count))

const processedData = rankingData.map(item => ({
  ...item,
  percent: (item.count / maxCount) * 100
}))

const visibleItems = computed(() => {
  const items = []
  for (let i = 0; i < 5; i++) {
    const index = (currentIndex.value + i) % processedData.length
    items.push(processedData[index])
  }
  return items
})

const startScroll = () => {
  scrollTimer = window.setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % processedData.length
  }, 2000)
}

const stopScroll = () => {
  if (scrollTimer) {
    clearInterval(scrollTimer)
    scrollTimer = null
  }
}

onMounted(() => {
  startScroll()
})

onBeforeUnmount(() => {
  stopScroll()
})
</script>

<style scoped lang="scss">
.scenic-ranking {
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
  
  .ranking-list {
    flex: 1;
    overflow: hidden;
    
    .ranking-item {
      display: flex;
      align-items: center;
      padding: 12px 10px;
      margin: 5px 0;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 4px;
      transition: all 0.3s ease;
      animation: slideIn 0.5s ease;
      
      &:hover {
        background: rgba(255, 200, 100, 0.1);
      }
      
      .rank {
        color: #ffd700;
        font-size: 13px;
        font-weight: bold;
        min-width: 45px;
      }
      
      .name {
        color: #fff;
        font-size: 13px;
        flex: 1;
        margin-right: 10px;
      }
      
      .progress-bar {
        width: 80px;
        height: 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
        overflow: hidden;
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ffd700, #ff9800);
          border-radius: 3px;
          transition: width 0.5s ease;
          box-shadow: 0 0 5px rgba(255, 200, 100, 0.5);
        }
      }
    }
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
