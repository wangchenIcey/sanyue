<template>
  <div class="content">
    <!-- <el-input
      v-model="state.keys"
      placeholder="输入私钥"
    />
    <div class="buttons">
      <el-button
        type="primary"
        @click="$emit('importKeys', state.keys)"
        style="margin: 10px 20px"
        >导入私钥</el-button
      >
      <el-button
        type="primary"
        @click="$emit('clearKeys')"
        style="margin: 10px 20px"
        >清空私钥</el-button
      >
    </div> -->

    <el-form :inline="true" :model="state.formInline" class="demo-form-inline">
      <el-form-item label="私钥" style="width:600px">
        <el-input
          v-model="state.formInline.keys"
          placeholder="请输入私钥"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="$emit('importKeys', state.formInline.keys)"
          style="margin: 10px 20px"
          >导入私钥
        </el-button>
        <el-button
          type="primary"
          @click="$emit('clearKeys')"
          style="margin: 10px 20px"
          >清空私钥
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script  lang='ts'>
import { ElMessage } from "element-plus";
import { reactive } from "vue";
export default {
  emits: ["clearKeys", "importKeys"],

  setup() {
    const state = reactive({
      formInline: {
        keys: "",
      },
    });
    // console.log(ctx.$emit);
    return {
      state,
    };
  },
};
</script>
<style scoped lang='scss'>
.content {
  display: flex;
  padding: 0 20px;
}
</style>