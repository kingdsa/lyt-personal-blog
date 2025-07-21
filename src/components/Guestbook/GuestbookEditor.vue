<template>
  <n-card 
    class="guestbook-editor"
    :embedded="isdarkTheme" 
    :bordered="!isdarkTheme"
  >
    <template #header>
      <n-space align="center">
        <n-avatar 
          :src="userInfo.userHead" 
          round 
          size="small"
        />
        <n-text>{{ isReply ? '发表回复' : '留言' }}</n-text>
      </n-space>
    </template>
    
    <div class="editor-content">
      <!-- 主输入框 -->
      <n-input
        v-model:value="content"
        type="textarea"
        :placeholder="placeholder || (isReply ? '写下你的回复...' : '写下你想说的话...')"
        :rows="isReply ? 3 : 4"
        :maxlength="1000"
        show-count
        @keydown="handleKeydown"
      />
      
      <!-- 表情和工具栏 -->
      <div class="editor-toolbar">
        <n-space justify="space-between" align="center">
          <n-space>
          </n-space>
          
          <n-space>
            <n-button 
              v-if="isReply" 
              @click="handleCancel"
              size="small"
            >
              取消
            </n-button>
            <n-button 
              type="primary" 
              @click="handleSubmit"
              :loading="submitting"
              :disabled="!canSubmit"
              size="small"
            >
              {{ isReply ? '回复' : '发表留言' }}
            </n-button>
          </n-space>
        </n-space>
      </div>
      
      <!-- 图片预览 -->
      <div v-if="fileList.length > 0" class="image-preview">
        <n-space>
          <div 
            v-for="(file, index) in fileList" 
            :key="index"
            class="preview-item"
          >
            <n-image
              :src="file.url || file.thumbnailUrl"
              width="80"
              height="80"
              object-fit="cover"
              style="border-radius: 4px;"
            />
            <n-button
              class="remove-btn"
              circle
              size="tiny"
              type="error"
              @click="removeImage(index)"
            >
              <template #icon>
                <n-icon :component="CloseOutline" />
              </template>
            </n-button>
          </div>
        </n-space>
      </div>
      
      <!-- 输入提示 -->
      <div v-if="content.length > 0" class="input-tips">
        <n-text depth="3" style="font-size: 12px;">
          按 Ctrl+Enter 快速发送
        </n-text>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'
import { VaeStore } from '@/store'
import { storeToRefs } from 'pinia'
import { useMessage } from 'naive-ui'
import type { UploadFileInfo, UploadCustomRequestOptions } from 'naive-ui'
import {
  HappyOutline,
  ImageOutline,
  CloseOutline
} from '@vicons/ionicons5'
import emoji from '@/assets/emoji'

const props = defineProps<{
  placeholder?: string
  isReply?: boolean
}>()

const emit = defineEmits<{
  submit: [content: string, images?: string[]]
  cancel: []
}>()

const store = VaeStore()
const { isdarkTheme, userInfo } = storeToRefs(store)
const message = useMessage()

// 状态管理
const content = ref('')
const submitting = ref(false)
const fileList = ref<UploadFileInfo[]>([])

// 表情数据
const emojiList = emoji.emojiList

// 计算属性
const canSubmit = computed(() => {
  return content.value.trim().length > 0 && !submitting.value
})

// 方法
const insertEmoji = (emojiKey: string) => {
  const textarea = document.querySelector('.n-input__textarea-el') as HTMLTextAreaElement
  if (textarea) {
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const before = content.value.substring(0, start)
    const after = content.value.substring(end)
    content.value = before + emojiKey + after
    
    // 设置光标位置
    setTimeout(() => {
      const newPosition = start + emojiKey.length
      textarea.setSelectionRange(newPosition, newPosition)
      textarea.focus()
    }, 10)
  }
}

const handleFileChange = (options: { fileList: UploadFileInfo[] }) => {
  fileList.value = options.fileList
}

const customRequest = ({ file, onFinish, onError }: UploadCustomRequestOptions) => {
  // 模拟图片上传
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    const uploadedFile = {
      id: Date.now().toString(),
      name: file.name,
      status: 'finished' as const,
      url: result,
      thumbnailUrl: result
    }
    onFinish()
  }
  reader.onerror = () => {
    onError()
  }
  reader.readAsDataURL(file.file as File)
}

const removeImage = (index: number) => {
  fileList.value.splice(index, 1)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === 'Enter') {
    handleSubmit()
  }
}

const handleSubmit = async () => {
  if (!canSubmit.value) return
  
  submitting.value = true
  
  try {
    const images = fileList.value
      .filter(file => file.status === 'finished')
      .map(file => file.url || file.thumbnailUrl)
      .filter(Boolean) as string[]
    
    // 模拟提交延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    emit('submit', content.value.trim(), images)
    
    // 清空内容
    content.value = ''
    fileList.value = []
    
    message.success(props.isReply ? '回复成功！' : '留言发表成功！')
  } catch (error) {
    message.error('发送失败，请重试')
    console.error('Submit error:', error)
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  content.value = ''
  fileList.value = []
  emit('cancel')
}
</script>

<style scoped lang="less">
.guestbook-editor {
  .editor-content {
    .editor-toolbar {
      margin-top: 12px;
      padding-top: 8px;
      border-top: 1px solid var(--n-divider-color);
    }
    
    .emoji-panel {
      width: 350px;
      max-height: 300px;
      
      .emoji-grid {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        gap: 8px;
        padding: 8px 0;
        max-height: 200px;
        overflow-y: auto;
        
        .emoji-item {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.2s;
          
          &:hover {
            background-color: var(--n-color-hover);
          }
          
          img {
            width: 24px;
            height: 24px;
          }
        }
      }
    }
    
    .image-preview {
      margin-top: 12px;
      
      .preview-item {
        position: relative;
        display: inline-block;
        
        .remove-btn {
          position: absolute;
          top: -6px;
          right: -6px;
          z-index: 1;
        }
      }
    }
    
    .input-tips {
      margin-top: 8px;
      text-align: right;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .guestbook-editor {
    .editor-content {
      .emoji-panel {
        width: 300px;
        
        .emoji-grid {
          grid-template-columns: repeat(6, 1fr);
        }
      }
    }
  }
}
</style> 