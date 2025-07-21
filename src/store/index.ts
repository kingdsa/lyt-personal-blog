import { defineStore } from "pinia";
import { Names } from "./store-name";

export const VaeStore = defineStore(Names.StoreName, {
  state: () => {
    return {
      clientWidth: 0, //屏幕宽
      isdarkTheme: localStorage.getItem("vueuse-color-scheme") == "dark", //主题，白 黑
      isPC: false, //是否pc端
      clientHeight: 0, //屏幕高
      distanceToBottom: 0, //滚动条距离底部
      distanceToTop: 0, //滚动条距离上部
      activeKey: "", //当前页面
      address: "未知", //当前用户地址
      accessToken: localStorage.getItem("accessToken") || "", //token
      userInfo: {
        username: "",
        email: "",
        nickname: "",
        avatar: "",
        role: "user",
        isActive: false,
        lastLoginAt: new Date(),
      } as User,
    };
  },
  //类似computed 修饰一些值
  getters: {
    getClientWidth(): number {
      return this.clientWidth;
    },
  },
  //methods 可以同步异步 提交state
  actions: {
    setAddress(address: string) {
      this.address = address;
    },
    setclientWidth(num: number) {
      this.clientWidth = num;
      this.isPC = num > 1025 ? true : false;
    },
    setdistanceToBottom(num: number) {
      this.distanceToBottom = num;
    },
    setdistanceToTop(num: number) {
      this.distanceToTop = num;
    },
    setclientHeight(num: number) {
      this.clientHeight = num;
    },
    setActiveKey(key: string) {
      this.activeKey = key;
    },
    setDarkTheme(darkTheme: boolean) {
      this.isdarkTheme = darkTheme;
    },
    setUserInfo(obj: User) {
      localStorage.setItem("userInfo", JSON.stringify(obj));
      this.userInfo = obj;
    },
    setToken(token: string) {
      this.accessToken = token;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        // 自定义存储的 key，默认是 store.$id
        key: "userInfo",
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
        storage: localStorage,
        // state 中的字段名，按组打包储存
      },
    ],
  },
});
