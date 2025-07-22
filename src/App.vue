<template>
  <div style="height: 100vh; position: relative">
    <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
      <n-dialog-provider>
        <StarportCarrier>
          <n-notification-provider placement="top">
            <n-loading-bar-provider>
              <n-message-provider>
                <n-config-provider :theme="isdarkTheme ? darkTheme : null">
                  <n-layout position="absolute">
                    <Header @goPath="goPath"></Header>
                    <n-layout has-sider position="absolute" style="top: 64px">
                      <n-scrollbar ref="scrollbarRef" @scroll="scroll">
                        <Content ref="scrollbarRef2">
                          <RouterView v-slot="{ Component }">
                            <keep-alive>
                              <component
                                :is="Component"
                                :key="$route.name"
                                v-if="$route.meta.keepAlive"
                              />
                            </keep-alive>
                            <component
                              :is="Component"
                              v-if="!$route.meta.keepAlive"
                              :key="$route.name"
                            />
                          </RouterView>
                        </Content>
                        <Footer v-if="showLoading"></Footer>
                        <n-back-top :right="30" />
                      </n-scrollbar>
                    </n-layout>
                  </n-layout>
                </n-config-provider>
              </n-message-provider>
            </n-loading-bar-provider>
          </n-notification-provider>
        </StarportCarrier>
      </n-dialog-provider>
    </n-config-provider>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick, provide, onBeforeMount } from "vue";
import { StarportCarrier } from "vue-starport";
import Header from "@/Layout/components/Header.vue";
import Content from "@/Layout/components/Content.vue";
import Footer from "@/Layout/components/Footer.vue";
import { VaeStore } from "@/store";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { darkTheme, useMessage } from "naive-ui";
import { zhCN, dateZhCN } from "naive-ui";
const store = VaeStore();
const scrollbarRef2 = ref<HTMLElement | undefined>(undefined);
import { useDark, useToggle } from "@vueuse/core";
import System_Settings_Api from "@/apis/system-settings";
const showLoading = ref(false);
const isDark = useDark();
const toggleDark = useToggle(isDark);
setTimeout(() => {
  showLoading.value = true;
}, 500);
//解构
let { isdarkTheme } = storeToRefs(store);
//滚动
const scrollbarRef = ref<any>(null);
const scroll = (e: any) => {
  nextTick(() => {
    const distanceToBottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight;
    store.setdistanceToBottom(distanceToBottom);
    store.setdistanceToTop(e.target.scrollTop);
  });
};
const onGetToken = async () => {
  if (localStorage.getItem("accessToken")) {
    return;
  }
  const res = await System_Settings_Api.getToken({
    sub: "123456789",
  });
  if (res.code === 200) {
    // 添加访客记录
    onAddAccessRecord();
    // 设置token
    localStorage.setItem("accessToken", res.data.accessToken);
  }
};

const onAddAccessRecord = () => {
  System_Settings_Api.addAccessRecord();
};

const scrollByTop = (x: number) => {
  scrollbarRef.value.scrollTo({
    top: x,
  });
};
//传递给子级
provide("scrollBy", scrollByTop);

// 生命周期，实时获取屏幕大小
onMounted(() => {
  // 使用 nextTick 确保 message provider 已经完全渲染
  nextTick(() => {
    // 初始化一些naiveui的东西
    (window as any).$message = useMessage();
  });
  getWindowResize();
  window.addEventListener("resize", getWindowResize);
  // 获取token
  onGetToken();
});
// 获取屏幕尺寸
const getWindowResize = function () {
  store.setclientWidth(window.innerWidth);
  store.setclientHeight(window.innerHeight);
};

const $r = useRouter();
//跳转页面
const goPath = (key: string) => {
  $r.push({ name: key });
};
</script>

<style lang="less">
#darkComment {
  .u-comment {
    background: none !important;
  }
}
[v-cloak] {
  display: none;
}
</style>
