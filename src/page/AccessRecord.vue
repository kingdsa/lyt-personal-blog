<template>
  <!-- 访问记录页面 -->
  <BackgroundPlate
    title="访问记录"
    description="每一次访问都是一场不期而遇的数字邂逅"
    color="#7c3aed"
  ></BackgroundPlate>

  <div class="access-record-container">
    <n-card class="main-card" :bordered="false">
      <!-- 统计信息 -->
      <div class="stats-section" v-if="!loading || pageData.length > 0">
        <n-space justify="space-between" align="center" class="stats-header">
          <n-h3 prefix="bar" type="primary">
            <n-icon :component="StatsChartOutline" />
            访问统计
          </n-h3>
          <n-tag type="info" size="medium" round>
            总访问量: {{ totalCount }}
          </n-tag>
        </n-space>
      </div>

      <!-- 无限滚动列表 -->
      <n-infinite-scroll 
        :distance="10" 
        @load="onLoadMore"
        :loading="loadingMore"
      >
        <n-list :show-divider="false">
          <template v-if="!loading || pageData.length > 0">
            <n-list-item v-for="(item, index) in pageData" :key="index">
              <div class="access-card" v-motion-slide-visible-bottom>
                <n-card 
                  :bordered="false" 
                  class="record-card" 
                  hoverable
                  :segmented="{
                    content: true,
                    footer: 'soft'
                  }"
                >
                  <template #header>
                    <n-space align="center" justify="space-between">
                      <n-space align="center">
                        <n-avatar 
                          :size="36" 
                          :style="{ backgroundColor: getRandomColor(index) }"
                          round
                        >
                          <n-icon :component="DesktopOutline" />
                        </n-avatar>
                        <div>
                          <n-text strong>{{ item.ip || '未知IP' }}</n-text>
                          <br>
                          <n-text depth="3" :style="{ fontSize: '11px' }">
                            {{ formatDeviceInfo(item) }}
                          </n-text>
                        </div>
                      </n-space>
                      
                      <!-- 城市信息标签 -->
                      <div v-if="getCityInfo(item)">
                        <n-tag 
                          type="success" 
                          size="small" 
                          round
                          :style="{ fontSize: '11px' }"
                        >
                          <template #icon>
                            <n-icon :component="LocationOutline" />
                          </template>
                          {{ getCityInfo(item) }}
                        </n-tag>
                      </div>
                    </n-space>
                  </template>

                  <template #default>
                    <n-space vertical :size="8">
                      <!-- 完整地理位置信息 -->
                      <div class="info-row" v-if="getLocationString(item) !== '未知位置'">
                        <n-space align="center" :size="6">
                          <n-icon :component="LocationOutline" color="#18a058" :size="14" />
                          <n-text :style="{ fontSize: '13px' }">
                            {{ getLocationString(item) }}
                          </n-text>
                        </n-space>
                      </div>

                      <!-- 系统和浏览器信息 -->
                      <n-space :size="16" style="flex-wrap: wrap;">
                        <!-- 操作系统 -->
                        <div class="info-item" v-if="item.os">
                          <n-space align="center" :size="4">
                            <n-icon :component="SettingsOutline" color="#f0a020" :size="13" />
                            <n-text :style="{ fontSize: '12px' }">{{ item.os }}</n-text>
                          </n-space>
                        </div>

                        <!-- 浏览器信息 -->
                        <div class="info-item" v-if="item.browser">
                          <n-space align="center" :size="4">
                            <n-icon :component="GlobeOutline" color="#d03050" :size="13" />
                            <n-text :style="{ fontSize: '12px' }">{{ item.browser }}</n-text>
                          </n-space>
                        </div>
                      </n-space>
                    </n-space>
                  </template>

                  <template #footer>
                    <n-space justify="space-between" align="center">
                      <n-tag 
                        :type="getDeviceTagType(item.deviceType)" 
                        size="small"
                        round
                      >
                        {{ item.deviceType || '未知设备' }}
                      </n-tag>
                      <n-text depth="3" :style="{ fontSize: '11px' }">
                        #{{ index + 1 }}
                      </n-text>
                    </n-space>
                  </template>
                </n-card>
              </div>
            </n-list-item>
          </template>

          <!-- 加载更多指示器 -->
          <template #footer>
            <div class="load-more-footer">
              <n-spin v-if="loadingMore" size="medium">
                <template #description>
                  <n-text depth="3">正在加载更多数据...</n-text>
                </template>
              </n-spin>
              
              <n-result
                v-else-if="!hasMore && !loading && pageData.length > 0"
                status="success"
                size="small"
                title="已经到底啦~"
                description="没有更多访问记录了"
              >
                <template #icon>
                </template>
              </n-result>
            </div>
          </template>
        </n-list>
      </n-infinite-scroll>

      <!-- 初始加载状态 -->
      <div v-if="loading && pageData.length === 0" class="loading-container">
        <n-space vertical align="center" :size="20">
          <n-spin size="large">
            <template #description>
              <n-text>正在加载访问记录...</n-text>
            </template>
          </n-spin>
          <n-skeleton height="100px" width="100%" :repeat="3" />
        </n-space>
      </div>

      <!-- 空状态 -->
      <n-empty 
        v-if="!loading && pageData.length === 0 && !error"
        description="暂无访问记录"
        style="margin: 60px 0"
      >
        <template #icon>
          <n-icon :component="DocumentTextOutline" />
        </template>
        <template #extra>
          <n-button @click="onRefresh" type="primary" ghost>
            刷新数据
          </n-button>
        </template>
      </n-empty>

      <!-- 错误状态 -->
      <n-result
        v-if="error"
        status="error"
        title="加载失败"
        :description="error"
      >
        <template #footer>
          <n-button @click="onRefresh" type="primary">
            重新加载
          </n-button>
        </template>
      </n-result>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMessage } from 'naive-ui';
import { 
  DesktopOutline, 
  LocationOutline, 
  SettingsOutline,
  GlobeOutline,
  DocumentTextOutline,
  StatsChartOutline
} from '@vicons/ionicons5';
import System_Settings_Api from '@/apis/system-settings';
import { AccessLogItem } from '@/apis/system-settings/types';

const message = useMessage();

// 响应式数据
const pageData = ref<AccessLogItem[]>([]);
const loading = ref(false);
const loadingMore = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const hasMore = ref(true);
const error = ref<string>('');

// 获取访问记录
const getAccessRecord = async (page: number = 1, isLoadMore: boolean = false) => {
  try {
    if (!isLoadMore) {
      loading.value = true;
      error.value = '';
    } else {
      loadingMore.value = true;
    }

    const res = await System_Settings_Api.getAccessRecord({
      page,
      limit: pageSize.value,
    });

    if (res.code === 200) {
      const { list, total } = res.data;
      
      if (isLoadMore) {
        pageData.value.push(...list);
      } else {
        pageData.value = list;
      }
      
      totalCount.value = total;
      hasMore.value = pageData.value.length < total;
      currentPage.value = page;
      
    } else {
      throw new Error(res.msg || '获取数据失败');
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : '网络错误，请重试';
    error.value = errorMsg;
    
    if (!isLoadMore) {
      message.error(errorMsg);
    } else {
      message.warning('加载更多数据失败');
    }
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

// 加载更多
const onLoadMore = async () => {
  if (!hasMore.value || loadingMore.value) return;
  await getAccessRecord(currentPage.value + 1, true);
};

// 刷新数据
const onRefresh = () => {
  currentPage.value = 1;
  hasMore.value = true;
  getAccessRecord(1, false);
};

// 格式化设备信息
const formatDeviceInfo = (item: AccessLogItem) => {
  const parts = [];
  if (item.deviceType) parts.push(item.deviceType);
  if (item.os) parts.push(item.os);
  if (item.browser) parts.push(item.browser);
  return parts.join(' · ') || '未知设备';
};

// 获取城市信息
const getCityInfo = (item: AccessLogItem) => {
  if (item.city && item.city !== '未知') {
    return item.city;
  }
  if (item.province && item.province !== '未知') {
    return item.province;
  }
  if (item.country && item.country !== '未知') {
    return item.country;
  }
  return '';
};

// 获取地理位置字符串
const getLocationString = (item: AccessLogItem) => {
  const parts = [];
  if (item.country && item.country !== '未知') parts.push(item.country);
  if (item.province && item.province !== '未知') parts.push(item.province);
  if (item.city && item.city !== '未知') parts.push(item.city);
  return parts.join(' · ') || item.region || '未知位置';
};

// 获取设备标签类型
const getDeviceTagType = (deviceType?: string) => {
  if (!deviceType) return 'default';
  const type = deviceType.toLowerCase();
  if (type.includes('mobile') || type.includes('phone')) return 'success';
  if (type.includes('tablet') || type.includes('ipad')) return 'warning';
  if (type.includes('desktop') || type.includes('computer')) return 'info';
  return 'default';
};

// 获取随机颜色
const getRandomColor = (index: number) => {
  const colors = [
    '#18a058', '#2080f0', '#f0a020', '#d03050', 
    '#722ed1', '#eb2f96', '#fa541c', '#13c2c2'
  ];
  return colors[index % colors.length];
};

onMounted(() => {
  getAccessRecord();
});
</script>

<style scoped lang="less">
.access-record-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}

.main-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.stats-section {
  margin-bottom: 16px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(239, 239, 245, 0.8);
  
  .stats-header {
    h3 {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 16px;
    }
  }
}

.access-card {
  margin-bottom: 12px;
  
  .record-card {
    border: 1px solid rgba(239, 239, 245, 0.8);
    border-radius: 10px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(5px);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
      border-color: rgba(24, 160, 88, 0.3);
    }
  }
  
  .info-row {
    padding: 2px 0;
  }
  
  .info-item {
    display: inline-flex;
    align-items: center;
  }
}

.load-more-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  min-height: 50px;
}

.loading-container {
  padding: 30px 16px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .access-record-container {
    padding: 8px;
  }
  
  .access-card .record-card {
    margin-bottom: 8px;
  }
  
  .stats-section {
    margin-bottom: 12px;
    padding: 8px 0;
    
    .stats-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
  }
}

/* 深色主题适配 */
[data-theme='dark'] {
  .main-card {
    background: rgba(16, 16, 20, 0.9);
  }
  
  .access-card .record-card {
    background: rgba(24, 24, 28, 0.8);
    border-color: rgba(255, 255, 255, 0.1);
    
    &:hover {
      border-color: rgba(24, 160, 88, 0.4);
    }
  }
}

/* 动画增强 */
.access-card {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 加载骨架屏样式 */
:deep(.n-skeleton) {
  border-radius: 8px;
}

/* 滚动条美化 */
:deep(.n-scrollbar-rail) {
  right: 2px;
}

:deep(.n-scrollbar-rail .n-scrollbar-handle) {
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.2);
}
</style>