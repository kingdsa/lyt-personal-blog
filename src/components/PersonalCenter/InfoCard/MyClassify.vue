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
            <n-h2 prefix="bar" class="margin-bottom0px" align-text>分类管理</n-h2>
          </template>
          <template #header-extra>
            <n-button strong secondary @click="router.back()">返回</n-button>
          </template>
        </n-card>

        <!-- 左右布局 -->
        <n-card :embedded="isdarkTheme" :bordered="!isdarkTheme">
          <n-layout has-sider>
            <!-- 左侧树形结构 -->
            <n-layout-sider :width="200" :collapsed-width="0" :show-trigger="false" bordered>
              <n-card size="small" :bordered="false">
                <n-spin :show="treeLoading">
                  <n-tree
                    ref="treeRef"
                    :data="treeData"
                    :node-props="nodeProps"
                    :render-label="renderLabel"
                    block-line
                    expand-on-click
                    selectable
                    @update:selected-keys="handleTreeSelect"
                  />
                </n-spin>
              </n-card>
            </n-layout-sider>

            <!-- 右侧内容区域 -->
            <n-layout>
              <n-card size="small" :bordered="false">
                <template #header>
                  <n-space align="center" justify="space-between">
                    <n-space align="center">
                      <n-icon :size="18">
                        <ListOutline />
                      </n-icon>
                      <span>
                        {{
                          selectedCategory ? `${selectedCategory.name} - 数据管理` : "全部数据管理"
                        }}
                      </span>
                    </n-space>
                    <n-button type="primary" @click="handleTableAdd">
                      <template #icon>
                        <n-icon>
                          <AddOutline />
                        </n-icon>
                      </template>
                      新增数据
                    </n-button>
                  </n-space>
                </template>

                <!-- 搜索区域 -->
                <n-space style="margin-bottom: 16px" align="center">
                  <n-input
                    v-model:value="searchKeyword"
                    placeholder="搜索名称、类型或描述..."
                    style="width: 200px"
                    clearable
                    @keyup.enter="handleSearch"
                  >
                    <template #prefix>
                      <n-icon :size="16">
                        <DocumentTextOutline />
                      </n-icon>
                    </template>
                  </n-input>
                  <n-button type="primary" @click="handleSearch">搜索</n-button>
                  <n-button @click="clearSearch">重置</n-button>
                </n-space>

                <!-- 数据表格 -->
                <n-data-table
                  :columns="tableColumns"
                  :data="paginatedData"
                  :loading="tableLoading"
                  :row-key="(row: DictInputDTO) => row.id"
                  :scroll-x="1200"
                  size="small"
                  striped
                  bordered
                />

                <!-- 分页 -->
                <n-space justify="end" style="margin-top: 16px">
                  <n-pagination
                    v-model:page="tablePage"
                    v-model:page-size="tablePageSize"
                    :item-count="filteredTableData.length"
                    :page-sizes="[10, 20, 50, 100]"
                    show-size-picker
                    show-quick-jumper
                  >
                    <template #prefix="{ itemCount }">总共 {{ itemCount }} 条</template>
                  </n-pagination>
                </n-space>
              </n-card>
            </n-layout>
          </n-layout>
        </n-card>
      </n-gi>
    </n-grid>

    <!-- 右键菜单 -->
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="contextMenuX"
      :y="contextMenuY"
      :options="contextMenuOptions"
      :show="showContextMenu"
      :on-clickoutside="onContextMenuClickoutside"
      @select="handleContextMenuSelect"
    />

    <!-- 编辑左侧分类组件 -->
    <MyClassifyContent
      v-model:visible="editModalVisible"
      :is-update="isUpdate"
      :update-name="updateName"
      :form-data="selectedFormData"
      @success="handleEditSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { VaeStore } from "@/store";
import BackgroundPlate from "@/components/background/BackgroundPlate.vue";
import MyClassifyContent from "./components/MyClassifyContent.vue";
import { storeToRefs } from "pinia";
import { reactive, ref, h, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  ListOutline,
  DocumentTextOutline,
  AddOutline,
  CreateOutline,
  TrashOutline,
} from "@vicons/ionicons5";

import { NButton, useMessage, useDialog, TreeOption, DropdownOption } from "naive-ui";
import Dictionary_Api from "@/apis/dictionary";
import { DictInputDTO, QueryDictionaryDto } from "@/apis/dictionary/types";

// Refs
const treeLoading = ref(false);
const tableLoading = ref(false);
const editModalVisible = ref(false);
const isUpdate = ref(false);
const updateName = ref("");
const selectedFormData = ref<DictInputDTO | undefined>(undefined);
const selectedCategory = ref<DictInputDTO | null>(null);

// Context Menu
const showContextMenu = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);
const contextMenuNode = ref<DictInputDTO | null>(null);

const message = useMessage();
const router = useRouter();
const dialog = useDialog();

const queryData = reactive<QueryDictionaryDto>({
  type: "",
  keyword: "",
  isEnable: true,
  page: 1,
  pageSize: 100, // 树形数据加载更多
});

const store = VaeStore();
let { clientWidth, isdarkTheme } = storeToRefs(store);

// Tree Data
const treeData = ref<TreeOption[]>([]);
const tableData = ref<DictInputDTO[]>([]);
const filteredTableData = ref<DictInputDTO[]>([]);
const searchKeyword = ref("");
const tablePage = ref(1);
const tablePageSize = ref(10);

// 获取所有数据
const onGetLeftTreeList = async () => {
  treeLoading.value = true;
  const copyData = JSON.parse(JSON.stringify(queryData));
  Object.keys(copyData).forEach((key) => {
    if (copyData[key] === null || copyData[key] === undefined || copyData[key] === "") {
      delete copyData[key];
    }
  });
  const res = await Dictionary_Api.getDictionary(copyData);
  if (res.code === 200) {
    tableData.value = res.data.list;
    // 转换为树形数据
    convertToTreeData(res.data.list);
    // 更新筛选后的表格数据
    updateFilteredTableData();
  } else {
    message.error(res.msg);
  }
  treeLoading.value = false;
};

// 将表格数据转换为树形数据
const convertToTreeData = (data: DictInputDTO[]) => {
  const rootNode: TreeOption = {
    key: "all",
    label: "全部分类",
    children: [],
  };

  data.forEach((item) => {
    rootNode.children?.push({
      key: item.id || item.type,
      label: item.name,
      data: item,
    });
  });

  treeData.value = [rootNode];
};

// 树节点属性
const nodeProps = ({ option }: { option: TreeOption }) => {
  return {
    onContextmenu(e: MouseEvent): void {
      e.preventDefault();
      contextMenuNode.value = (option.data as DictInputDTO) || null;
      showContextMenu.value = true;
      contextMenuX.value = e.clientX;
      contextMenuY.value = e.clientY;
    },
  };
};

// 渲染树节点标签
const renderLabel = ({ option }: { option: TreeOption }) => {
  if (option.key === "all") {
    return h("span", { style: { fontWeight: "bold", color: "#1890ff" } }, option.label as string);
  }
  return option.label;
};

// 右键菜单选项
const contextMenuOptions = computed((): DropdownOption[] => {
  const isRootNode = contextMenuNode.value === null;

  if (isRootNode) {
    return [
      {
        label: "新增分类",
        key: "add",
        icon: () =>
          h(AddOutline, {
            style: {
              color: "#18a058",
              fontSize: "12px",
              transition: "all 0.2s ease",
            },
          }),
      },
    ];
  } else {
    return [
      {
        label: "编辑分类",
        key: "edit",
        icon: () =>
          h(CreateOutline, {
            style: {
              color: "#2080f0",
              fontSize: "12px",
              transition: "all 0.2s ease",
            },
          }),
      },
      {
        label: "删除分类",
        key: "delete",
        icon: () =>
          h(TrashOutline, {
            style: {
              color: "#d03050",
              fontSize: "16px",
              transition: "all 0.2s ease",
            },
          }),
      },
    ];
  }
});

// 处理树节点选择
const handleTreeSelect = (keys: Array<string | number>) => {
  if (keys.length > 0) {
    const key = keys[0];
    if (key === "all") {
      selectedCategory.value = null;
    } else {
      const foundItem = tableData.value.find((item) => (item.id || item.type) === key);
      selectedCategory.value = foundItem || null;
    }
    updateFilteredTableData();
  }
};

// 更新筛选后的表格数据
const updateFilteredTableData = () => {
  let filtered = [...tableData.value];

  // 根据选中的分类筛选
  if (selectedCategory.value) {
    filtered = filtered.filter((item) => item.type === selectedCategory.value!.type);
  }

  // 根据搜索关键词筛选
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        (item.name && item.name.toLowerCase().includes(keyword)) ||
        (item.type && item.type.toLowerCase().includes(keyword)) ||
        (item.description && item.description.toLowerCase().includes(keyword))
    );
  }

  filteredTableData.value = filtered;
  tablePage.value = 1; // 重置分页
};

// 搜索处理
const handleSearch = () => {
  updateFilteredTableData();
};

// 清除搜索
const clearSearch = () => {
  searchKeyword.value = "";
  updateFilteredTableData();
};

// 表格列定义
const tableColumns = [
  {
    title: "ID",
    key: "id",
    width: 80,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: "字典类型",
    key: "type",
    width: 120,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: "字典名称",
    key: "name",
    width: 150,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: "字典值",
    key: "value",
    width: 120,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: "描述",
    key: "description",
    width: 200,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: "状态",
    key: "isEnable",
    width: 80,
    render: (row: DictInputDTO) => {
      return h(
        "n-tag",
        {
          type: row.isEnable ? "success" : "error",
          size: "small",
        },
        () => (row.isEnable ? "启用" : "禁用")
      );
    },
  },
  {
    title: "排序",
    key: "sort",
    width: 80,
    sorter: (row1: DictInputDTO, row2: DictInputDTO) => (row1.sort || 0) - (row2.sort || 0),
  },
  {
    title: "创建时间",
    key: "createdAt",
    width: 150,
    render: (row: DictInputDTO) => {
      return row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "";
    },
  },
  {
    title: "操作",
    key: "actions",
    width: 150,
    fixed: "right" as const,
    render: (row: DictInputDTO) => {
      return h("n-space", { size: "small" }, () => [
        h(
          NButton,
          {
            size: "small",
            type: "primary",
            secondary: true,
            onClick: () => handleTableEdit(row),
          },
          () => "编辑"
        ),
        h(
          NButton,
          {
            size: "small",
            type: "error",
            secondary: true,
            onClick: () => handleTableDelete(row),
          },
          () => "删除"
        ),
      ]);
    },
  },
];

// 表格操作方法
const handleTableEdit = (item: DictInputDTO) => {
  selectedFormData.value = { ...item };
  editModalVisible.value = true;
  isUpdate.value = true;
  updateName.value = item.name;
};

const handleTableDelete = (item: DictInputDTO) => {
  dialog.error({
    title: `删除字典项`,
    content: `是否删除[${item.name}]字典项？`,
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      return new Promise((resolve) => {
        Dictionary_Api.deleteDictionary(item.id!)
          .then((res) => {
            if (res.code === 200) {
              message.success("删除成功");
              onGetLeftTreeList();
              resolve(true);
            } else {
              message.error(res.msg);
              resolve(false);
            }
          })
          .catch(() => {
            resolve(false);
          });
      });
    },
  });
};

const handleTableAdd = () => {
  selectedFormData.value = selectedCategory.value
    ? {
        type: selectedCategory.value.type,
        name: "",
        value: "",
        description: "",
        isEnable: true,
        sort: 0,
      }
    : {
        type: "",
        name: "",
        value: "",
        description: "",
        isEnable: true,
        sort: 0,
      };
  editModalVisible.value = true;
  isUpdate.value = false;
  updateName.value = "";
};

// 分页数据
const paginatedData = computed(() => {
  const start = (tablePage.value - 1) * tablePageSize.value;
  const end = start + tablePageSize.value;
  return filteredTableData.value.slice(start, end);
});

// 处理右键菜单选择
const handleContextMenuSelect = (key: string) => {
  showContextMenu.value = false;

  switch (key) {
    case "add":
      handleTableAdd();
      break;
    case "edit":
      if (contextMenuNode.value) {
        handleTableEdit(contextMenuNode.value);
      }
      break;
    case "delete":
      if (contextMenuNode.value) {
        handleTableDelete(contextMenuNode.value);
      }
      break;
  }
};

// 右键菜单点击外部
const onContextMenuClickoutside = () => {
  showContextMenu.value = false;
};

// 编辑成功回调
const handleEditSuccess = () => {
  onGetLeftTreeList();
};
onMounted(() => {
  onGetLeftTreeList();
});
</script>

<style scoped lang="less">
:deep(.n-layout-sider-scroll-container) {
  padding: 0 !important;
}
</style>
