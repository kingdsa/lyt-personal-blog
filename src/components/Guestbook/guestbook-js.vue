<template>
  <div class="guestbook-container">
    <!-- 留言统计信息 -->
    <n-card class="stats-card" :embedded="isdarkTheme" :bordered="!isdarkTheme">
      <n-space justify="space-around" align="center">
        <n-statistic label="留言总数" :value="totalMessages" />
        <n-statistic label="回复总数" :value="totalReplies" />
        <n-statistic label="今日留言" :value="todayMessages" />
      </n-space>
    </n-card>

    <!-- 留言编辑器 -->
    <div class="editor-section">
      <GuestbookEditor 
        @submit="handleNewMessage"
        placeholder="在这里留下你的想法吧..."
      />
    </div>

    <!-- 留言排序和筛选 -->
    <n-card class="filter-card" :embedded="isdarkTheme" :bordered="!isdarkTheme">
      <n-space justify="space-between" align="center">
        <n-space>
          <n-text strong>留言列表</n-text>
          <n-tag :bordered="false" type="info" size="small">
            共 {{ filteredMessages.length }} 条留言
          </n-tag>
        </n-space>
        <n-space>
          <n-select
            v-model:value="sortType"
            :options="sortOptions"
            size="small"
            style="width: 120px"
            @update:value="handleSortChange"
          />
          <n-button 
            text 
            size="small" 
            @click="refreshMessages"
            :loading="loading"
          >
            <template #icon>
              <n-icon :component="RefreshOutline" />
            </template>
            刷新
          </n-button>
        </n-space>
      </n-space>
    </n-card>

    <!-- 留言列表 -->
    <div class="messages-list">
      <n-spin :show="loading">
        <n-empty 
          v-if="!loading && filteredMessages.length === 0" 
          size="large" 
          description="还没有留言，快来抢沙发吧！"
        >
          <template #icon>
            <n-icon :component="ChatbubbleOutline" />
          </template>
        </n-empty>
        
        <div v-else>
          <GuestbookItem
            v-for="message in displayMessages"
            :key="message.id"
            :message-data="message"
            :current-user-id="currentUser?.userId"
            @like="handleLike"
            @reply="handleReply"
            @delete="handleDelete"
            @preview-image="handlePreviewImage"
          />
          
          <!-- 加载更多按钮 -->
          <div v-if="hasMore" class="load-more">
            <n-button 
              block 
              quaternary 
              @click="loadMore"
              :loading="loadingMore"
            >
              加载更多留言
            </n-button>
          </div>
          
          <!-- 没有更多数据提示 -->
          <div v-else-if="filteredMessages.length > pageSize" class="no-more">
            <n-text depth="3">
              <n-icon :component="CheckmarkCircleOutline" />
              已显示全部留言
            </n-text>
          </div>
        </div>
      </n-spin>
    </div>

    <!-- 图片预览模态框 -->
    <n-modal 
      v-model:show="showImagePreview" 
      preset="card" 
      style="width: 80vw; max-width: 800px;"
    >
      <template #header>
        <span>图片预览</span>
      </template>
      <div class="image-preview-modal">
        <n-image 
          :src="previewImageSrc" 
          style="max-width: 100%; height: auto;"
          object-fit="contain"
        />
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, nextTick } from 'vue'
import { VaeStore } from '@/store'
import { storeToRefs } from 'pinia'
import { useMessage } from 'naive-ui'
import {
  RefreshOutline,
  ChatbubbleOutline,
  CheckmarkCircleOutline
} from '@vicons/ionicons5'
import GuestbookItem from './GuestbookItem.vue'
import GuestbookEditor from './GuestbookEditor.vue'
import { 
  guestbookMessages, 
  createNewMessage, 
  createNewReply,
  formatTime,
  type MessageData,
  type UserInfo
} from '@/assets/guestbook-data'

const store = VaeStore()
const { isdarkTheme, userInfo } = storeToRefs(store)
const message = useMessage()

// 响应式状态
const messages = ref<MessageData[]>([...guestbookMessages])
const loading = ref(false)
const loadingMore = ref(false)
const sortType = ref('latest')
const pageSize = ref(5)
const currentPage = ref(1)

// 图片预览
const showImagePreview = ref(false)
const previewImageSrc = ref('')

// 排序选项
const sortOptions = [
  { label: '最新回复', value: 'latest' },
  { label: '最早回复', value: 'oldest' },
  { label: '点赞最多', value: 'likes' },
  { label: '回复最多', value: 'replies' }
]

// 计算属性
const currentUser = computed(() => userInfo.value)

const totalMessages = computed(() => messages.value.length)

const totalReplies = computed(() => {
  return messages.value.reduce((total, msg) => {
    return total + (msg.replies?.length || 0)
  }, 0)
})

const todayMessages = computed(() => {
  const today = new Date().toDateString()
  return messages.value.filter(msg => {
    const msgDate = new Date(msg.createTime).toDateString()
    return msgDate === today
  }).length
})

const filteredMessages = computed(() => {
  let sorted = [...messages.value]
  
  switch (sortType.value) {
    case 'latest':
      sorted.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
      break
    case 'oldest':
      sorted.sort((a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime())
      break
    case 'likes':
      sorted.sort((a, b) => b.likes - a.likes)
      break
    case 'replies':
      sorted.sort((a, b) => (b.replies?.length || 0) - (a.replies?.length || 0))
      break
  }
  
  return sorted
})

const displayMessages = computed(() => {
  const endIndex = currentPage.value * pageSize.value
  return filteredMessages.value.slice(0, endIndex)
})

const hasMore = computed(() => {
  return displayMessages.value.length < filteredMessages.value.length
})

// 事件处理函数
const handleNewMessage = async (content: string, images?: string[]) => {
  if (!currentUser.value?.userId) {
    message.warning('请先登录后再发表留言')
    return
  }
  
  try {
    const newMessage = createNewMessage(content, images, currentUser.value)
    messages.value.unshift(newMessage)
    
    // 重置到第一页显示新留言
    currentPage.value = 1
    
    message.success('留言发表成功！')
  } catch (error) {
    message.error('发表留言失败，请重试')
    console.error('New message error:', error)
  }
}

const handleReply = (parentId: string, content: string, replyToUser?: string) => {
  if (!currentUser.value?.userId) {
    message.warning('请先登录后再回复')
    return
  }
  
  try {
    const newReply = createNewReply(content, parentId, currentUser.value, replyToUser)
    
    // 找到父留言并添加回复
    const parentMessage = messages.value.find(msg => msg.id === parentId)
    if (parentMessage) {
      if (!parentMessage.replies) {
        parentMessage.replies = []
      }
      parentMessage.replies.push(newReply)
      message.success('回复成功！')
    }
  } catch (error) {
    message.error('回复失败，请重试')
    console.error('Reply error:', error)
  }
}

const handleLike = (messageId: string) => {
  // 模拟点赞功能
  const targetMessage = messages.value.find(msg => msg.id === messageId)
  if (targetMessage) {
    // 这里应该调用API更新点赞状态，现在只是模拟
    // targetMessage.likes += isLiked ? -1 : 1
  }
}

const handleDelete = (messageId: string) => {
  if (!currentUser.value?.userId) {
    message.warning('请先登录')
    return
  }
  
  // 找到要删除的留言
  const messageIndex = messages.value.findIndex(msg => msg.id === messageId)
  if (messageIndex > -1) {
    const targetMessage = messages.value[messageIndex]
    if (targetMessage.uid === currentUser.value.userId) {
      messages.value.splice(messageIndex, 1)
      message.success('留言已删除')
    } else {
      message.error('只能删除自己的留言')
    }
  }
}

const handlePreviewImage = (imageSrc: string) => {
  previewImageSrc.value = imageSrc
  showImagePreview.value = true
}

const handleSortChange = () => {
  currentPage.value = 1
}

const refreshMessages = async () => {
  loading.value = true
  
  try {
    // 模拟API刷新
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 这里应该重新获取数据，现在只是重置页面
    currentPage.value = 1
    
    message.success('刷新成功')
  } catch (error) {
    message.error('刷新失败')
  } finally {
    loading.value = false
  }
}

const loadMore = async () => {
  if (loadingMore.value) return
  
  loadingMore.value = true
  
  try {
    // 模拟加载延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    currentPage.value++
  } catch (error) {
    message.error('加载失败')
  } finally {
    loadingMore.value = false
  }
}

// 组件挂载时初始化
onMounted(() => {
  // 可以在这里调用API获取初始数据
  console.log('Guestbook mounted, total messages:', totalMessages.value)
})
</script>

<style scoped lang="less">
.guestbook-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
  
  .stats-card {
    margin-bottom: 20px;
  }
  
  .editor-section {
    margin-bottom: 20px;
  }
  
  .filter-card {
    margin-bottom: 20px;
    
    :deep(.n-card__content) {
      padding: 12px 16px;
    }
  }
  
  .messages-list {
    .load-more {
      margin: 20px 0;
    }
    
    .no-more {
      text-align: center;
      padding: 20px 0;
      
      .n-icon {
        margin-right: 4px;
        vertical-align: middle;
      }
    }
  }
  
  .image-preview-modal {
    text-align: center;
    
    .n-image {
      max-height: 70vh;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .guestbook-container {
    padding: 0 12px;
    
    .stats-card {
      :deep(.n-statistic) {
        .n-statistic__label {
          font-size: 12px;
        }
        .n-statistic__value {
          font-size: 18px;
        }
      }
    }
    
    .filter-card {
      :deep(.n-space) {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }
  }
}
</style>
