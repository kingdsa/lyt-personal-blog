<template>
  <n-card
    :style="{ width: clientWidth > 1025 ? '40%' : '96%' }"
    :bordered="false"
    size="huge"
    role="dialog"
    aria-modal="true"
  >
    <n-spin :show="showLoading">
      <n-tabs
        default-value="signin"
        size="large"
        justify-content="space-evenly"
      >
        <n-tab-pane name="signin" tab="登录">
          <n-form>
            <n-form-item-row label="用户名">
              <n-input
                ref="loginUserNameRef"
                @keydown.enter="loginBtn"
                clearable
                placeholder="请输入用户名"
                v-model:value="loginForm.username"
              />
            </n-form-item-row>
            <n-form-item-row label="密码">
              <n-input
                ref="loginUserPwdRef"
                @keydown.enter="loginBtn"
                clearable
                show-password-on="mousedown"
                placeholder="请输入密码"
                type="password"
                v-model:value="loginForm.password"
              />
            </n-form-item-row>
          </n-form>
          <n-space justify="center">
            <n-button type="error" block secondary strong>
              <template #icon>
                <n-icon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 448 512"
                  >
                    <path
                      d="M433.754 420.445c-11.526 1.393-44.86-52.741-44.86-52.741c0 31.345-16.136 72.247-51.051 101.786c16.842 5.192 54.843 19.167 45.803 34.421c-7.316 12.343-125.51 7.881-159.632 4.037c-34.122 3.844-152.316 8.306-159.632-4.037c-9.045-15.25 28.918-29.214 45.783-34.415c-34.92-29.539-51.059-70.445-51.059-101.792c0 0-33.334 54.134-44.859 52.741c-5.37-.65-12.424-29.644 9.347-99.704c10.261-33.024 21.995-60.478 40.144-105.779C60.683 98.063 108.982.006 224 0c113.737.006 163.156 96.133 160.264 214.963c18.118 45.223 29.912 72.85 40.144 105.778c21.768 70.06 14.716 99.053 9.346 99.704z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </n-icon>
              </template>
              QQ登录
            </n-button>
            <n-button type="info" block secondary strong @click="loginBtn">
              确认登录
            </n-button>
          </n-space>
        </n-tab-pane>
        <n-tab-pane name="signup" tab="注册">
          <n-form>
            <n-form-item-row
              label="用户名"
              :validation-status="inputUserNameStatus"
              :feedback="inputUserNameFeedbackVal"
            >
              <n-input
                ref="registerUserNameRef"
                @keydown.enter="register"
                placeholder="请输入用户名"
                v-model:value="registerForm.username"
                maxlength="16"
                show-count
                clearable
              />
            </n-form-item-row>
            <n-form-item-row
              label="昵称"
              :validation-status="inputUserNameStatus"
              :feedback="inputUserNameFeedbackVal"
            >
              <n-input
                ref="registerNicknameRef"
                @keydown.enter="register"
                placeholder="请输入昵称"
                v-model:value="registerForm.nickname"
                maxlength="16"
                show-count
                clearable
              />
            </n-form-item-row>
            <n-form-item-row label="邮箱">
              <n-auto-complete
                @keydown.enter="register"
                ref="registerEmailRef"
                v-model:value="registerForm.email"
                :input-props="{
                  autocomplete: 'disabled',
                }"
                :options="emailOptions"
                placeholder="请输入邮箱"
                clearable
              />
            </n-form-item-row>
            <n-form-item-row label="密码">
              <n-input
                ref="registerUserPwdRef"
                @keydown.enter="register"
                clearable
                show-password-on="mousedown"
                placeholder="请输入密码"
                v-model:value="registerForm.password"
                type="password"
              />
            </n-form-item-row>
            <n-form-item-row label="确认密码">
              <n-input
                ref="registerPwdRef"
                @keydown.enter="register"
                clearable
                show-password-on="mousedown"
                placeholder="请输入确认密码"
                v-model:value="confirmPassword"
                type="password"
              />
            </n-form-item-row>
          </n-form>
          <n-button type="primary" block secondary strong @click="register">
            注册
          </n-button>
        </n-tab-pane>
      </n-tabs>
    </n-spin>
  </n-card>
</template>

<script setup lang="ts">
import { VaeStore } from "../../store";
import { ref, computed, reactive } from "vue";
import { storeToRefs } from "pinia";
import { useMessage, InputInst } from "naive-ui";
import User_Api from '@/apis/user';
const emit = defineEmits(["setShowModal"]);
const store = VaeStore();
let { clientWidth } = storeToRefs(store);
const message = useMessage();
const confirmPassword = ref("");
const showLoading = ref(false);
const registerEmailRef = ref<InputInst | null>(null);
const registerPwdRef = ref<InputInst | null>(null);
const registerUserNameRef = ref<InputInst | null>(null);
const registerUserPwdRef = ref<InputInst | null>(null);
const loginUserNameRef = ref<InputInst | null>(null);
const loginUserPwdRef = ref<InputInst | null>(null);
const registerForm = reactive({
  email: "",
  username: "",
  password: "",
  nickname: "",
});
const loginForm = reactive({
  username: "admin",
  password: "hw123456",
});
//邮箱
const emailOptions = computed(() => {
  return ["@qq.com", "@163.com"].map((suffix) => {
    const prefix = registerForm.email.split("@")[0];
    return {
      label: prefix + suffix,
      value: prefix + suffix,
    };
  });
});
//用户登录
const loginBtn = () => {
  let { username, password } = loginForm;
  if (!username) {
    message.error("用户名不能为空！");
    loginUserNameRef.value?.focus();
    return;
  }
  if (!password) {
    message.error("密码不能为空！");
    loginUserPwdRef.value?.focus();
    return;
  }

  login_Request(username, password);
};
//登录接口
const login_Request = (username: string, password: string) => {
  showLoading.value = true;
  User_Api.login({ username, password }).then(res => {
    console.log(res);
    if (res.code === 200) {
      message.success("登录成功！");
      store.setUserInfo(res.data.user);
      store.setToken(res.data.token);
    } else {
      message.error(res.msg);
    }
  }).finally(() => {
    showLoading.value = false;
  })
  //关闭弹框，刷新页面
  emit("setShowModal");
  // location.reload();
};
//用户注册
const register = () => {
  let { email, username, password } = registerForm;
  
  // 验证用户名
  if (!username) {
    message.error("用户名不能为空！");
    registerUserNameRef.value?.focus();
    return;
  }
  
  if (username.length < 3 || username.length > 16) {
    message.error("用户名长度应在3-16个字符之间！");
    registerUserNameRef.value?.focus();
    return;
  }
  
  if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username)) {
    message.error("用户名只能包含字母、数字、下划线或中文！");
    registerUserNameRef.value?.focus();
    return;
  }
  
  if (inputUserNameStatus.value === "error") {
    message.error("用户名已存在！");
    registerUserNameRef.value?.focus();
    return;
  }
  
  // 验证邮箱
  if (!email) {
    message.error("请输入您的邮箱！");
    registerEmailRef.value?.focus();
    return;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    message.error("请输入有效的邮箱地址！");
    registerEmailRef.value?.focus();
    return;
  }
  
  // 验证密码
  if (!password) {
    message.error("请输入您的密码！");
    registerUserPwdRef.value?.focus();
    return;
  }
  
  if (password.length < 6) {
    message.error("密码长度不能少于6位！");
    registerUserPwdRef.value?.focus();
    return;
  }
  
  // 验证确认密码
  if (!confirmPassword.value) {
    message.error("请输入确认密码！");
    registerPwdRef.value?.focus();
    return;
  }
  
  if (password !== confirmPassword.value) {
    message.error("两次密码输入不一致!");
    registerUserPwdRef.value?.focus();
    return;
  }
  
  showLoading.value = true;
  
  // 发送注册请求
  registerRequest();
};

// 注册请求函数
const registerRequest = () => {
  try {
    // 这里调用注册API
    console.log("注册数据:", registerForm);
    User_Api.register(registerForm).then(res => {
      console.log(res);
      if (res.code === 200) {
        message.success("注册成功！");
        resetRegisterForm();
        emit("setShowModal");
      } else {
        message.error(res.msg);
      }
    }).finally(() => {
      showLoading.value = false;
    })
  } catch (error) {
    showLoading.value = false;
    message.error("注册失败，请重试！");
  }
};

// 重置注册表单
const resetRegisterForm = () => {
  registerForm.email = "";
  registerForm.username = "";
  registerForm.password = "";
  confirmPassword.value = "";
  inputUserNameFeedbackVal.value = undefined;
  inputUserNameStatus.value = undefined;
};

// 验证用户名是否重复
const inputUserNameFeedbackVal = ref<string | undefined>(undefined);
const inputUserNameStatus = ref<"success" | "warning" | "error" | undefined>(undefined);
const isUsernameInvalid = computed(() => inputUserNameStatus.value === "error");

</script>

<style scoped></style>
