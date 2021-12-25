<template>
  <div class="content">
    <el-card>
      <div class="key">
        <el-collapse v-model="state.hasKeys">
          <el-collapse-item style="padding: 0 10px" title=" 私钥管理" name="1">
            <keys @importKeys="importKeys" @clearKeys="clearKeys" />
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>

    <el-card
      style="margin-top: 20px"
      class="box-card"
      v-loading="state.Contentloading"
      :element-loading-text="state.ContentLoadingText"
    >
      <template #header>
        <div class="card-header">
          <span>一键训练</span>
          <el-button class="button" type="primary" @click="start"
            >开始训练</el-button
          >
        </div>
      </template>
      <el-table
        :data="state.myShips"
        style="width: 100%"
        border
        v-loading="state.loading"
        :element-loading-text="state.loadingText"
      >
        <el-table-column prop="id" label="id" />
        <el-table-column prop="level" label="等级" />
        <el-table-column prop="exp" label="经验" />
        <el-table-column prop="oil" label="油量" />
        <el-table-column prop="power" label="power" />
        <el-table-column prop="speed" label="speed" />
        <el-table-column prop="star" label="star" />
        <el-table-column prop="steering" label="steering" />
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ethers } from "ethers";
import { getSign, authWallet, getShipsOrMe, startXunlian } from "~/api/index";
import keys from "./key.vue";
import { ElMessage } from "element-plus";
import { reactive } from "vue-demi";

const state = reactive({
  user: {},
  loading: false,
  myShips: [],
  loadingText: "",
  Contentloading: false,
  ContentLoadingText: "",
  hasKeys: "1",
  wallet: <any>{},
});

const sleep10s = async () => {
  return new Promise(async (res, rej) => {
    await setTimeout(() => {
      res(true);
    }, 15000);
  });
};
const timerFun = async (index) => {
  let flag = await tryStart(state.myShips[index].id);
  if (flag) {
    await getDataList();
    await sleep10s();
    if (state.myShips[index].oil >= 15) {
      await timerFun(index);
    } else {
      state.Contentloading = false;
      state.ContentLoadingText = "";
    }
  }
};
const start = async () => {
  let length = state.myShips.length;
  for (let index = 0; index < length; index++) {
    state.Contentloading = true;
    state.ContentLoadingText = `正在训练第${index + 1}的船`;
    if (state.myShips[index].oil >= 15) {
      await timerFun(index);
    } else {
      state.Contentloading = false;
      state.ContentLoadingText = "";
    }
  }
  ElMessage.success("训练完成");
};
const tryStart = async (id: string) => {
  let res;
  try {
    res = await startXunlian(id);
    return true;
  } catch {
    return false;
  }
};
const provider = new ethers.providers.JsonRpcProvider(
  "https://bsc-dataseed4.binance.org"
);
// 获取otp
const getOpt = async () => {
  return await getSign({
    walletAddress: state.wallet.address,
  });
};
// 获取签名
const getUserSign = async () => {
  let signature = await state.wallet.signMessage(
    `I am signing to CryptoShips | OTP: ${state.user.nonce}`
  );
  let data = {
    walletAddress: state.wallet.address,
    signature,
  };
  return await authWallet(data);
};
// 获取船的数量
const getDataList = async () => {
  state.loading = true;
  state.loadingText = "更新列表中";
  let res;
  try {
    res = await getShipsOrMe();
  } catch {}
  state.loading = false;
  state.loadingText = "";

  console.log(res);
  state.myShips = res.data;
};
const init = async () => {
  let isLogin = localStorage.getItem("token") || false;
  let myKey = localStorage.getItem("oilKey") || false;
  if (!myKey) {
    ElMessage.error("请导入私钥。");
    localStorage.removeItem("token");
    state.hasKeys = "1";
    return;
  } else {
    state.hasKeys = "0";
  }
  if (!isLogin) {
    let data = await getOpt();
    state.user = data.data;
    let sign = await getUserSign();
    // sign.token
    localStorage.setItem("token", sign.data.token);
  }
  await getDataList();
};
init();

const importKeys = (keys: string) => {
  try {
    state.wallet = new ethers.Wallet(keys, provider);
    localStorage.setItem("oilKey", keys);
    ElMessage.success("导入私钥成功");
    state.loading = true;
    state.loadingText = "更新船信息。";
    init();
  } catch {
    ElMessage.error("导入私钥失败，请重新添加！");
    localStorage.removeItem("oilKey");
    localStorage.removeItem("token");
    state.hasKeys = "1";
  }
};
const clearKeys = () => {
  localStorage.removeItem("oilKey");
  localStorage.removeItem("token");
  ElMessage.success("清除成功。");
  location.reload();
};
</script>

<style lang="scss">
.content {
  padding: 20px 3%;
}
.card-header {
  display: flex;
  justify-content: space-between;
  span {
    display: inline-block;
  }
}
</style>