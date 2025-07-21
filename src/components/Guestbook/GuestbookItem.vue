<template>
  <n-card 
    class="guestbook-item" 
    :embedded="isdarkTheme" 
    :bordered="!isdarkTheme"
    style="margin-bottom: 16px;"
  >
    <n-thing>
      <template #avatar>
        <n-avatar 
          :src="messageData.user.avatar" 
          round 
          size="medium"
          :fallback-src="'https://07akioni.oss-cn-beijing.aliyuncs.com/demo1.JPG'"
        />
      </template>
      
      <template #header>
        <div class="user-info">
          <n-text strong>{{ messageData.user.username }}</n-text>
          <n-tag 
            v-if="messageData.user.level >= 5" 
            size="small" 
            type="error" 
            :bordered="false"
            style="margin-left: 8px;"
          >
            {{ messageData.user.level >= 6 ? '站长' : 'VIP' }}
          </n-tag>
        </div>
      </template>
      
      <template #header-extra>
        <n-space>
          <n-tag size="small" :bordered="false">
            <template #icon>
              <n-icon :component="LocationOutline" />
            </template>
            {{ messageData.address || '未知地区' }}
          </n-tag>
          <n-text depth="3" style="font-size: 12px;">
            {{ messageData.createTime }}
          </n-text>
        </n-space>
      </template>
      
      <template #description>
        <div class="message-content" v-html="formatContent(messageData.content)"></div>
        
        <!-- 显示图片 -->
        <div v-if="messageData.contentImg" class="message-images">
          <n-space>
            <n-image 
              v-for="(img, index) in messageData.contentImg.split(', ')" 
              :key="index"
              :src="img" 
              width="100"
              height="100"
              object-fit="cover"
              style="border-radius: 6px;"
              preview-disabled
              @click="$emit('preview-image', img)"
            />
          </n-space>
        </div>
        
        <!-- 操作按钮 -->
        <div class="message-actions">
          <n-space>
            <n-button 
              text 
              size="small" 
              @click="handleLike"
              :type="isLiked ? 'primary' : 'default'"
            >
              <template #icon>
                <n-icon :component="isLiked ? HeartSharp : HeartOutline" />
              </template>
              {{ messageData.likes || 0 }}
            </n-button>
            
            <n-button 
              text 
              size="small" 
              @click="toggleReply"
            >
              <template #icon>
                <n-icon :component="ChatbubbleOutline" />
              </template>
              回复
            </n-button>
            
            <n-button 
              v-if="canDelete" 
              text 
              size="small" 
              type="error"
              @click="handleDelete"
            >
              <template #icon>
                <n-icon :component="TrashOutline" />
              </template>
              删除
            </n-button>
          </n-space>
        </div>
        
        <!-- 回复编辑器 -->
        <div v-if="showReplyEditor" class="reply-editor">
          <n-divider style="margin: 16px 0;" />
          <GuestbookEditor
            :placeholder="`回复 @${messageData.user.username}:`"
            :is-reply="true"
            @submit="handleReplySubmit"
            @cancel="showReplyEditor = false"
          />
        </div>
        
        <!-- 回复列表 -->
        <div v-if="messageData.replies && messageData.replies.length > 0" class="replies" :style="repliesStyle">
          <n-divider style="margin: 16px 0;" />
          <div class="replies-header">
            <n-text depth="2">{{ messageData.replies.length }} 条回复</n-text>
          </div>
          <div class="replies-list">
            <div 
              v-for="reply in displayReplies" 
              :key="reply.id" 
              class="reply-item"
            >
              <n-space>
                <n-avatar 
                  :src="reply.user.avatar" 
                  round 
                  size="small"
                />
                <div class="reply-content">
                  <div class="reply-header">
                    <n-text strong style="font-size: 13px;">{{ reply.user.username }}</n-text>
                    <n-text depth="3" style="font-size: 11px; margin-left: 8px;">{{ reply.createTime }}</n-text>
                    <n-text depth="3" style="font-size: 11px; margin-left: 8px;">{{ reply.address }}</n-text>
                  </div>
                  <div class="reply-text" v-html="formatContent(reply.content)"></div>
                  <div class="reply-actions">
                    <n-space>
                      <n-button 
                        text 
                        size="tiny" 
                        @click="handleReplyLike(reply)"
                        :type="isReplyLiked(reply.id) ? 'primary' : 'default'"
                      >
                        <template #icon>
                          <n-icon :component="isReplyLiked(reply.id) ? HeartSharp : HeartOutline" />
                        </template>
                        {{ reply.likes || 0 }}
                      </n-button>
                      <n-button 
                        text 
                        size="tiny" 
                        @click="replyToReply(reply)"
                      >
                        回复
                      </n-button>
                    </n-space>
                  </div>
                </div>
              </n-space>
            </div>
          </div>
          
          <!-- 显示更多回复按钮 -->
          <div v-if="messageData.replies.length > maxRepliesShow" class="more-replies">
            <n-button 
              text 
              size="small" 
              @click="toggleMoreReplies"
            >
              {{ showAllReplies ? '收起回复' : `查看更多 ${messageData.replies.length - maxRepliesShow} 条回复` }}
            </n-button>
          </div>
        </div>
      </template>
    </n-thing>
  </n-card>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'
import { VaeStore } from '@/store'
import { storeToRefs } from 'pinia'
import { useMessage } from 'naive-ui'
import {
  LocationOutline,
  HeartOutline,
  HeartSharp,
  ChatbubbleOutline,
  TrashOutline
} from '@vicons/ionicons5'
import GuestbookEditor from './GuestbookEditor.vue'
import emoji from '@/assets/emoji'

interface MessageData {
  id: string
  parentId: string | null
  uid: string
  address?: string
  content: string
  likes: number
  contentImg?: string
  createTime: string
  user: {
    username: string
    avatar: string
    level: number
    homeLink?: string
  }
  replies?: MessageData[]
}

const props = defineProps<{
  messageData: MessageData
  currentUserId?: string
}>()

const emit = defineEmits<{
  like: [messageId: string]
  reply: [parentId: string, content: string, replyToUser?: string]
  delete: [messageId: string]
  'preview-image': [imageSrc: string]
}>()

const store = VaeStore()
const { isdarkTheme, userInfo } = storeToRefs(store)
const message = useMessage()

// 状态管理
const showReplyEditor = ref(false)
const showAllReplies = ref(false)
const maxRepliesShow = 3
const likedMessages = ref<string[]>([])
const likedReplies = ref<string[]>([])

// 计算属性
const isLiked = computed(() => likedMessages.value.includes(props.messageData.id))
const canDelete = computed(() => props.currentUserId === props.messageData.uid)
const displayReplies = computed(() => {
  if (!props.messageData.replies) return []
  return showAllReplies.value 
    ? props.messageData.replies 
    : props.messageData.replies.slice(0, maxRepliesShow)
})

// 回复区域样式 - 适配暗黑模式
const repliesStyle = computed(() => ({
  backgroundColor: isdarkTheme.value ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
  borderRadius: '6px',
  padding: '12px',
  marginTop: '8px'
}))

// 格式化内容（支持表情和换行）
const formatContent = (content: string) => {
  let formatted = content.replace(/\n/g, '<br>')
  
  // 替换表情
  Object.entries(emoji.allEmoji).forEach(([key, value]) => {
    const regex = new RegExp(`\\${key}`, 'g')
    formatted = formatted.replace(regex, `<img src="${value}" alt="${key}" style="width: 20px; height: 20px; vertical-align: middle;">`)
  })
  
  return formatted
}

// 事件处理
const handleLike = () => {
  if (isLiked.value) {
    likedMessages.value = likedMessages.value.filter(id => id !== props.messageData.id)
    message.info('取消点赞')
  } else {
    likedMessages.value.push(props.messageData.id)
    message.success('点赞成功！')
  }
  emit('like', props.messageData.id)
}

const toggleReply = () => {
  showReplyEditor.value = !showReplyEditor.value
}

const handleReplySubmit = (content: string) => {
  emit('reply', props.messageData.id, content)
  showReplyEditor.value = false
}

const handleDelete = () => {
  emit('delete', props.messageData.id)
}

const isReplyLiked = (replyId: string) => {
  return likedReplies.value.includes(replyId)
}

const handleReplyLike = (reply: MessageData) => {
  if (isReplyLiked(reply.id)) {
    likedReplies.value = likedReplies.value.filter(id => id !== reply.id)
  } else {
    likedReplies.value.push(reply.id)
  }
}

const replyToReply = (reply: MessageData) => {
  showReplyEditor.value = true
}

const toggleMoreReplies = () => {
  showAllReplies.value = !showAllReplies.value
}
</script>

<style scoped lang="less">
.guestbook-item {
  .user-info {
    display: flex;
    align-items: center;
  }
  
  .message-content {
    margin: 8px 0;
    line-height: 1.6;
    word-wrap: break-word;
  }
  
  .message-images {
    margin: 12px 0;
  }
  
  .message-actions {
    margin-top: 12px;
  }
  
  .reply-editor {
    margin-top: 8px;
  }
  
  .replies {
    .replies-header {
      margin-bottom: 12px;
    }
    
    .reply-item {
      margin-bottom: 12px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .reply-content {
        flex: 1;
        margin-left: 8px;
        
        .reply-header {
          margin-bottom: 4px;
        }
        
        .reply-text {
          margin: 4px 0;
          line-height: 1.5;
          font-size: 13px;
        }
        
        .reply-actions {
          margin-top: 4px;
        }
      }
    }
    
    .more-replies {
      text-align: center;
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid var(--n-divider-color);
    }
  }
}
</style> 