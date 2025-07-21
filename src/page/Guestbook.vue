<template>
  <div class="guestbook-page">
    <BackgroundPlate
      title="留言板"
      description="往往那些不起眼的小餐馆，才能吃到真正的美味，而那些大酒店的我吃不起。"
      color="#00897b"
    />
    
    <div class="guestbook-content">
      <n-grid :cols="clientWidth > 1200 ? 10 : 8" item-responsive>
        <n-gi 
          :offset="clientWidth > 1200 ? 1 : 0" 
          :span="clientWidth > 1200 ? 8 : 8"
        >
          <GuestbookJs />
        </n-gi>
      </n-grid>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VaeStore } from '@/store'
import { storeToRefs } from 'pinia'
import BackgroundPlate from '@/components/background/BackgroundPlate.vue'
import GuestbookJs from '@/components/Guestbook/guestbook-js.vue'

const store = VaeStore()
const { clientWidth } = storeToRefs(store)
</script>

<style scoped lang="less">
.guestbook-page {
  min-height: 100vh;
  
  .guestbook-content {
    padding: 20px 0;
  }
}

@media (max-width: 768px) {
  .guestbook-page {
    .guestbook-content {
      padding: 10px 0;
    }
  }
}
</style>
