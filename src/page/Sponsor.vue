<template>
  <!--  赞赏页面-->
  <BackgroundPlate
    title="赞 赏"
    description="并非乞讨者，但也不拒绝赞赏，感谢您对本站的支持！"
    color="#e53935"
  ></BackgroundPlate>
  <n-grid :cols="8">
    <n-gi
      style="min-height: 100vh"
      :offset="clientWidth > 1075 ? 1 : 0"
      :span="clientWidth > 1075 ? 6 : 8"
    >
      <n-card :embedded="isdarkTheme" :bordered="!isdarkTheme">
        <n-thing>
          <template #header-extra>
            <n-button strong secondary size="small" @click="router.back()">
              返回
            </n-button>
          </template>
          <template #avatar>
            <Starport
              port="my-id"
              style="width: 50px; height: 50px; background: none"
            >
              <myImg></myImg>
            </Starport>
          </template>
          <template #header>
            <n-text tag="div">刘阳涛</n-text>
          </template>
          <template #description>
            🧣感谢您对本站的喜爱和支持，您的赞赏将是本站不断前进的动力！
          </template>
          打赏赞助时请尽量留下备注，以让我知道你是谁~如果当时忘记加备注，可在本博客留言说明。
          赞赏名单不定期手动更新，可能有延迟。如长时间未更新可在本博客留言提醒，感谢您的支持❤️。
        </n-thing>
        <template #action>
          <n-space>
            <n-popover trigger="click">
              <template #trigger>
                <n-button size="small" type="info" strong secondary
                  >支付宝赞赏</n-button
                >
              </template>
              <n-image
                width="100"
                src="https://lyt-oss-web.oss-cn-beijing.aliyuncs.com/zfb-pay.JPG"
              />
            </n-popover>
            <n-popover trigger="click">
              <template #trigger>
                <n-button size="small" type="success" strong secondary
                  >微信赞赏</n-button
                >
              </template>
              <n-image
                width="100"
                src="https://lyt-oss-web.oss-cn-beijing.aliyuncs.com/wx-pay.JPG"
              />
            </n-popover>
          </n-space>
        </template>
      </n-card>
      <br />
      <n-card :embedded="isdarkTheme" :bordered="!isdarkTheme">
        <template #header>
          <n-h2 prefix="bar" class="margin-bottom0px" align-text>
            赞赏名单
          </n-h2>
        </template>
      </n-card>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import BackgroundPlate from "@/components/background/BackgroundPlate.vue";
import { VaeStore } from "@/store";
import { storeToRefs } from "pinia";
import { inject, } from "vue";
import {
  NButton,
} from "naive-ui";
import { useRouter } from "vue-router";
const store = VaeStore();
let { clientWidth, isdarkTheme } = storeToRefs(store);
const router = useRouter();
//滚动条回到原位
const scrollBy = inject<Function>("scrollBy");

scrollBy ? scrollBy(0) : "";
</script>

<style scoped></style>
