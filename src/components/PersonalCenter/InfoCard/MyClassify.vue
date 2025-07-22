<template>
  <div>
    <BackgroundPlate title="分类管理" color="#f4511e" height="150px"></BackgroundPlate>
    <n-grid :cols="8">
      <n-gi
        style="min-height: 100vh"
        :offset="clientWidth > 1075 ? 1 : 0"
        :span="clientWidth > 1075 ? 6 : 8"
      >
        <n-card class="margin-bottom10" :embedded="isdarkTheme" :bordered="!isdarkTheme">
          <template #header>
            <n-h2 prefix="bar" class="margin-bottom0px" align-text>分类列表</n-h2>
          </template>

          <template #header-extra>
            <n-button strong secondary @click="router.back()">返回</n-button>
          </template>
        </n-card>
        <n-card :embedded="isdarkTheme" :bordered="!isdarkTheme">
          <!--     搜索条件-->
          <n-form label-placement="left">
            <n-space>
              <n-form-item label="关键字">
                <n-input
                  clearable
                  v-model:value="queryData.keyword"
                  placeholder="请输入分类名称"
                />
              </n-form-item>
              <n-form-item>
                <n-button type="info" @click="searchBtn">查询</n-button>
                &nbsp;
                <n-button type="success" @click="addBtn">新增</n-button>
              </n-form-item>
            </n-space>
          </n-form>

          <n-spin :show="tableShow">
            <n-data-table
              :bordered="false"
              :single-line="false"
              :columns="columns"
              :data="tableData"
              :pagination="false"
              :scroll-x="1000"
            />
            <br />
            <n-pagination
              v-model:page="queryData.page"
              v-model:page-size="queryData.pageSize"
              :item-count="total"
              show-size-picker
              @update:page="pageChange"
              @update-page-size="pageSizeChange"
              :page-sizes="[
                {
                  label: '10 每页',
                  value: 10,
                },
                {
                  label: '20 每页',
                  value: 20,
                },
                {
                  label: '50 每页',
                  value: 50,
                },
                {
                  label: '100 每页',
                  value: 100,
                },
              ]"
            >
              <template #suffix>共 {{ total }} 条</template>
            </n-pagination>
          </n-spin>
        </n-card>
      </n-gi>
    </n-grid>
    <!--  编辑-->
    <n-modal v-model:show="editShowModal">
      <n-card
        :style="{ width: clientWidth > 1025 ? '500px' : '96%' }"
        :title="isUpdate ? '正在编辑[' + updateName + ']分类' : '正在新增分类'"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <template #header-extra>
          <n-button tertiary @click="editShowModal = false">
            <template #icon>
              <n-icon size="22">
                <CloseOutline />
              </n-icon>
            </template>
          </n-button>
        </template>
        <n-spin :show="editLoading">
          <n-form label-width="80px" label-placement="left">
            <n-form-item-row label="字典类型" required>
              <n-input
                v-model:value="updateForm.type"
                placeholder="请输入字典类型（1-50个字符）"
                maxlength="50"
                show-count
              />
            </n-form-item-row>
            <n-form-item-row label="字典名称" required>
              <n-input
                ref="labelNameRef"
                v-model:value="updateForm.name"
                placeholder="请输入字典名称（1-100个字符）"
                maxlength="100"
                show-count
              />
            </n-form-item-row>
            <n-form-item-row label="字典值">
              <n-input
                v-model:value="updateForm.value"
                placeholder="请输入字典值（最多100个字符）"
                maxlength="100"
                show-count
              />
            </n-form-item-row>
            <n-form-item-row label="描述">
              <n-input
                ref="labelDescribeRef"
                v-model:value="updateForm.description"
                placeholder="请输入描述（最多255个字符）"
                type="textarea"
                maxlength="255"
                show-count
                :autosize="{
                  minRows: 2,
                  maxRows: 5,
                }"
              />
            </n-form-item-row>
            <n-form-item-row label="启用状态">
              <n-switch
                v-model:value="updateForm.isEnable"
                :checked-value="true"
                :unchecked-value="false"
              >
                <template #checked>启用</template>
                <template #unchecked>禁用</template>
              </n-switch>
            </n-form-item-row>
            <n-form-item-row label="排序">
              <n-input-number
                v-model:value="updateForm.sort"
                placeholder="请输入排序数字"
                :min="0"
                :step="1"
              />
            </n-form-item-row>
          </n-form>
          <n-space justify="center">
            <n-button @click="editShowModal = false">取消</n-button>
            &nbsp;
            <n-button type="info" @click="submitBtn">确定</n-button>
          </n-space>
        </n-spin>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { VaeStore } from "@/store";
import BackgroundPlate from "@/components/background/BackgroundPlate.vue";
import { storeToRefs } from "pinia";
import { inject, onActivated, reactive, ref, h } from "vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { CloseOutline } from "@vicons/ionicons5";

import {
  NButton,
  useMessage,
  NGradientText,
  useDialog,
  InputInst,
} from "naive-ui";
import Dictionary_Api from '@/apis/dictionary';
import { DictInputDTO, QueryDictionaryDto } from '@/apis/dictionary/types';
import dayjs from 'dayjs';

const tableShow = ref(false);
const editLoading = ref(false);
const editShowModal = ref(false);
const isUpdate = ref(false);
const deleteLoading = ref(false);
const updateName = ref("");
const total = ref(0);

const updateForm = ref<DictInputDTO>({
  type: "",
  name: "",
  value: "",
  description: "",
  isEnable: true,
  sort: 0,
});
const message = useMessage();

const labelNameRef = ref<InputInst | null>(null);

const router = useRouter();
const dialog = useDialog();

const queryData = reactive<QueryDictionaryDto>({
  type: "",
  keyword: "",
  isEnable: true,
  page: 1,
  pageSize: 10,
});
const store = VaeStore();
let { clientWidth, distanceToBottom, distanceToTop, userInfo, isdarkTheme } = storeToRefs(store);

//清空
const emptyBtn = () => {
  queryData.keyword = "";
  queryData.type = "";
  queryData.isEnable = true;
  queryData.page = 1;
  queryData.pageSize = 10;
};

const pageChange = (page: number) => {
  queryData.page = page;
  get_AdminLabelsAll();
};
const pageSizeChange = (limit: number) => {
  queryData.page = limit;
  queryData.page = 1;
  get_AdminLabelsAll();
};

const columns = [
  {
    title: "分类名称",
    ellipsis: true,
    width: "170",
    key: "name",
  },
  {
    title: "描述",
    ellipsis: true,
    key: "description",
  },
  {
    title: "创建时间",
    width: "180",
    key: "createdAt",
    render(row: DictInputDTO) {
      return dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss");
    },
  },

  {
    title: "操作",
    key: "actions",
    fixed: "right",
    width: 160,
    render(row: any) {
      return [
        h(
          NButton,
          {
            style: "margin:0px 5px",
            type: "info",
            strong: true,
            secondary: true,
            size: "small",
            onClick: () => {
              editBtn(row);
            },
          },
          { default: () => "编辑" }
        ),
        h(
          NButton,
          {
            style: "margin:0px 5px",
            type: "error",
            strong: true,
            secondary: true,
            size: "small",
            onClick: () => {
              deleteBtn(row);
            },
          },
          { default: () => "删除" }
        ),
      ];
    },
  },
];

const tableData = ref<DictInputDTO[]>([]);
//查询
const searchBtn = () => {
  queryData.page = 1;
  get_AdminLabelsAll();
};
//获取所有
const get_AdminLabelsAll = async () => {
  tableShow.value = true;
  const copyData = JSON.parse(JSON.stringify(queryData));
  Object.keys(copyData).forEach(key => {
    if (copyData[key] === null || copyData[key] === undefined || copyData[key] === '') {
      delete copyData[key];
    }
  });
  const res = await Dictionary_Api.getDictionary(copyData);
  if (res.code === 200) {
    tableData.value = res.data.list;
    total.value = res.data.total;
  } else {
    message.error(res.msg);
  }
  tableShow.value = false;
};
get_AdminLabelsAll();

//新增
const addBtn = () => {
  updateForm.value.type = "";
  updateForm.value.name = "";
  updateForm.value.value = "";
  updateForm.value.description = "";
  updateForm.value.isEnable = true;
  updateForm.value.sort = 0;
  editShowModal.value = true;
  isUpdate.value = false;
};
//编辑
const editBtn = (row: DictInputDTO) => {
  updateName.value = row.name;
  updateForm.value = { ...row };
  editShowModal.value = true;
  isUpdate.value = true;
};
//确认
const submitBtn = () => {
  let { type, name } = updateForm.value;
  
  // 验证字典类型
  if (!type || type.trim() === '') {
    message.error("字典类型不能为空");
    return;
  }
  if (type.length > 50) {
    message.error("字典类型长度应在1-50个字符之间");
    return;
  }
  
  // 验证字典名称
  if (!name || name.trim() === '') {
    message.error("字典名称不能为空");
    labelNameRef.value?.focus();
    return;
  }
  if (name.length > 100) {
    message.error("字典名称长度应在1-100个字符之间");
    return;
  }
  
  // 验证字典值（可选）
  if (updateForm.value.value && updateForm.value.value.length > 100) {
    message.error("字典值长度不能超过100个字符");
    return;
  }
  
  // 验证描述（可选）
  if (updateForm.value.description && updateForm.value.description.length > 255) {
    message.error("描述长度不能超过255个字符");
    return;
  }
  
  handleSubmit();
};
const handleSubmit = () => {
  editLoading.value = true;
  const fun = isUpdate.value ? Dictionary_Api.updateDictionary : Dictionary_Api.createDictionary;
  const copyData = JSON.parse(JSON.stringify(updateForm.value));
  delete copyData.createdAt;
  delete copyData.updatedAt;
  delete copyData.deletedAt;
  fun(copyData).then(res => {
    if (res.code === 200) {
      message.success(isUpdate.value ? "编辑成功" : "新增成功");
      editShowModal.value = false;
      get_AdminLabelsAll();
    } else {
      message.error(res.msg);
    }
  }).finally(() => {
    editLoading.value = false;
  })
};

//删除
const deleteBtn = (row: DictInputDTO) => {
  let { name, id } = row;
  dialog.error({
    title: `删除分类`,
    content: `是否删除[${name}]分类？`,
    positiveText: "确定",
    negativeText: "取消",
    loading: deleteLoading.value,
    onPositiveClick: () => {
      deleteLoading.value = true;
      Dictionary_Api.deleteDictionary(id!).then(res => {
        if (res.code === 200) {
          message.success("删除成功");
          get_AdminLabelsAll();
          return true;
        } else {
          message.error(res.msg);
        }
      }).finally(() => {
        deleteLoading.value = false;
      });
      return false;
    },
  });
};

//滚动条回到原位
const scrollBy = inject<Function>("scrollBy");
const rememberScroll = ref(0);
// 跳转路由守卫
onBeforeRouteLeave((to, from, next) => {
  // 将当前位置进行一个状态保存
  rememberScroll.value = distanceToTop.value;
  next();
});
//   组件激活
onActivated(() => {
  scrollBy ? scrollBy(rememberScroll.value) : "";
});
</script>

<style scoped></style>
