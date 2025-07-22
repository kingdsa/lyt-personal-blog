<template>
  <n-modal v-model:show="showModal">
    <n-card
      :style="{ width: clientWidth > 1025 ? '500px' : '96%' }"
      :title="isUpdate ? '正在编辑[' + updateName + ']分类' : '正在新增分类'"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <n-button tertiary @click="showModal = false">
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
          <n-button @click="showModal = false">取消</n-button>
          &nbsp;
          <n-button type="info" @click="submitBtn">确定</n-button>
        </n-space>
      </n-spin>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { CloseOutline } from "@vicons/ionicons5";
import { NButton, useMessage, InputInst } from "naive-ui";
import Dictionary_Api from '@/apis/dictionary';
import { DictInputDTO } from '@/apis/dictionary/types';
import { VaeStore } from "@/store";
import { storeToRefs } from "pinia";

// Props
interface Props {
  visible: boolean;
  isUpdate?: boolean;
  updateName?: string;
  formData?: DictInputDTO;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  isUpdate: false,
  updateName: '',
  formData: () => ({
    type: "",
    name: "",
    description: "",
    isEnable: true,
    sort: 0,
  })
});

// Emits
const emit = defineEmits<{
  'update:visible': [value: boolean];
  'success': [];
}>();

// Store
const store = VaeStore();
const { clientWidth } = storeToRefs(store);

// Refs
const editLoading = ref(false);
const labelNameRef = ref<InputInst | null>(null);
const message = useMessage();

const updateForm = ref<DictInputDTO>({
  type: "",
  name: "",
  description: "",
  isEnable: true,
  sort: 0,
});

// Computed
const showModal = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

// Watch props change
watch(() => props.formData, (newData: DictInputDTO | undefined) => {
  if (newData) {
    updateForm.value = { ...newData };
  } else {
    // 重置表单
    updateForm.value = {
      type: "",
      name: "",
      description: "",
      isEnable: true,
      sort: 0,
    };
  }
}, { immediate: true });

// Methods
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
  
  // 验证描述（可选）
  if (updateForm.value.description && updateForm.value.description.length > 255) {
    message.error("描述长度不能超过255个字符");
    return;
  }
  
  handleSubmit();
};

const handleSubmit = () => {
  editLoading.value = true;
  const fun = props.isUpdate ? Dictionary_Api.updateDictionary : Dictionary_Api.createDictionary;
  const copyData = JSON.parse(JSON.stringify(updateForm.value));
  delete copyData.createdAt;
  delete copyData.updatedAt;
  delete copyData.deletedAt;
  
  fun(copyData).then(res => {
    if (res.code === 200) {
      message.success(props.isUpdate ? "编辑成功" : "新增成功");
      showModal.value = false;
      emit('success');
    } else {
      message.error(res.msg);
    }
  }).finally(() => {
    editLoading.value = false;
  });
};
</script>

<style scoped></style>
