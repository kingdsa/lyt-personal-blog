<template>
  <!--  关于页面-->
  <BackgroundPlate
    title="关 于"
    description="比一个人旅行更寂寞的是，一个人，没钱旅行。"
    color="#546e7a"
  ></BackgroundPlate>
  <n-grid :cols="8" id="message">
    <n-gi
      style="min-height: 100vh"
      :offset="clientWidth > 1075 ? 1 : 0"
      :span="clientWidth > 1075 ? 6 : 8"
    >
      <n-card :embedded="isdarkTheme" :bordered="!isdarkTheme">
        <n-thing>
          <template #avatar>
            <Starport
              port="my-id"
              style="width: 100px; height: 100px; background: none"
            >
              <myImg></myImg>
            </Starport>
          </template>
          <template #header>
            <n-text tag="div"> 刘阳涛 </n-text>
          </template>

          <template #description>
            目前工作：前端开发🎗<br />
            联系邮箱：310485385@qq.com<br />
            这个人很简单，没什么好说的。
          </template>
          <template #header-extra>
            <n-space>
              <n-popover trigger="click">
                <template #trigger>
                  <n-button size="small" type="success" strong secondary
                    >我的微信号</n-button
                  >
                </template>
                <n-image
                  width="100"
                  src="https://lyt-oss-web.oss-cn-beijing.aliyuncs.com/lyt-wx.JPG"
                />
              </n-popover>
            </n-space>
          </template>
        </n-thing>
      </n-card>
      <br />
      <n-card :embedded="isdarkTheme" :bordered="!isdarkTheme">
        <template #header>
          <n-h2 class="margin-bottom0" prefix="bar" type="success">
            关于本站
          </n-h2>
        </template>
        <template #header-extra>
          <router-link to="/sponsor">
            <n-button strong secondary
              ><n-icon :size="16"><HeartOutline></HeartOutline></n-icon
              >赞赏</n-button
            >
          </router-link>
        </template>
        <n-h5 class="margin-bottom-top"
          >前端：<n-gradient-text type="error"
            >Vue3.5+Vite7+Ts+NaiveUI2.42， </n-gradient-text
          >后端：<n-gradient-text type="info">Nest.js</n-gradient-text
          >，数据库：<n-gradient-text type="info">MySQL</n-gradient-text
          >；前端部署：cloudflare；后端部署：render。</n-h5
        >
        <n-h5 class="margin-bottom-top"
          >本站的编写纯属个人兴趣爱好，前后端均独立完成；主要用来记录自己工作、生活、学习上的笔记。</n-h5
        >
        <n-h5 class="margin-bottom-top"
          >本站任何用户注册登录，获取权限后都可发布文章等操作。</n-h5
        >
        <n-h5 class="margin-bottom-top"
          >本站前端代码，未考虑IE等低版本浏览器的兼容性。</n-h5
        >
        <n-h5 class="margin-bottom-top"
          >本站发布的文章或其他信息如有侵权，请邮件联系我及时删除，谢谢。</n-h5
        >
      </n-card>
      <br />
      <n-card :embedded="isdarkTheme" :bordered="!isdarkTheme">
        <template #header>
          <n-h2 class="margin-bottom0" prefix="bar" type="success">
            本站源码
          </n-h2>
        </template>
        <n-card embedded :bordered="false">
          本站前端代码已发布到码云：：<n-a
            href="https://github.com/kingdsa/lyt-personal-blog"
            target="_blank"
            >https://github.com/kingdsa/lyt-personal-blog</n-a
          >。需要的可前往下载。<br />
          如果您觉得本站还不错，可以通过点击右上角的赞赏按钮来支持本站，🧣感谢您的支持！
        </n-card>
      </n-card>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import BackgroundPlate from "@/components/background/BackgroundPlate.vue";
import { HeartOutline } from "@vicons/ionicons5";
import { VaeStore } from "@/store";
import { Starport } from "vue-starport";
import { storeToRefs } from "pinia";
import { inject } from "vue";
const store = VaeStore();
let { clientWidth, isdarkTheme } = storeToRefs(store);
//滚动条回到原位
const scrollBy = inject<Function>("scrollBy");
scrollBy ? scrollBy(0) : "";
</script>

<style scoped></style>
