<!--  -->
<template>
  <v-card class="d-flex flex-column" style="height: 100vh;">
    <v-card-title>审核人</v-card-title>
    <v-card-text class="mb-auto overflow-auto">
      <v-radio-group v-model="editInfo.verifierChooseType" row dense hide-details @change="handleChooseTypeChange">
        <v-row no-gutters>
          <v-col v-for="(value, key) in VerifierChooseType" :key="key" cols="4" class="mb-4">
            <v-radio :label="key" :value="value" :disabled="value == 3"></v-radio>
          </v-col>
        </v-row>
      </v-radio-group>
      <UserSelect v-if="editInfo.verifierChooseType === 1" v-model="editInfo.value" multiple></UserSelect>
      <RoleSelect v-if="editInfo.verifierChooseType === 2" v-model="editInfo.value"></RoleSelect>
      <v-divider class="mt-3 mb-2"></v-divider>
      <template v-if="isShowMethod">
        <p class="text-dark-1">多人审批时采用的审批方式</p>
        <v-subheader class="fs-sm" v-if="editInfo.verifierChooseType === 2">
          指定角色时，只需该角色下有一人同意或拒绝即可
        </v-subheader>
        <v-radio-group v-model="editInfo.verifyMethod" dense hide-details :disabled="editInfo.verifierChooseType === 2">
          <v-radio label="依次审批" :value="0" class="mb-3"></v-radio>
          <v-radio label="会签（须所有审批人同意）" :value="1" class="mb-3"></v-radio>
          <v-radio label="或签（一名审批人同意或拒绝即可）" :value="2" class="mb-3"></v-radio>
        </v-radio-group>
      </template>
      <template v-if="editInfo.verifierChooseType === 0">
        <v-divider class="mt-3 mb-2"></v-divider>
        <v-switch v-model="editInfo.required" label="审核人必填"></v-switch>
      </template>
    </v-card-text>
    <v-divider></v-divider>
    <!-- <v-card-actions class="mb-3">
      <v-spacer></v-spacer>
      <v-btn dark color="deep-purple accent-3" @click="$emit('input', editInfo)">
        保存
      </v-btn>
      <v-btn text @click="$emit('cancel')">
        取消
      </v-btn>
    </v-card-actions> -->
  </v-card>
</template>

<script>
import { NodeType, VerifyMethod, VerifierChooseType } from "@/views/WorkFlow/util";
import UserSelect from "@/components/SearchSelect/User";
import RoleSelect from "@/components/SearchSelect/Role";
export default {
  components: { UserSelect, RoleSelect },
  model: {
    prop: "editInfo",
    event: "input",
  },
  props: { editInfo: Object },
  data() {
    return { VerifierChooseType, VerifyMethod, NodeType };
  },
  computed: {
    isShowMethod() {
      return [0, 1, 2].includes(this.editInfo.verifierChooseType);
    },
  },
  methods: {
    handleChooseTypeChange(type) {
      //如果不需要显示审批方式就设为null
      if (!this.isShowMethod) {
        this.editInfo.verifyMethod = VerifyMethod.依次审批;
      } else if (type === 2) {
        this.editInfo.verifyMethod = VerifyMethod.或签;
      } else {
        this.editInfo.verifyMethod = VerifyMethod.依次审批;
      }
    },
  },
  mounted() {
    // this.editInfo = this.$$.jsonCopy(this.value);
  },
};
</script>

<style lang="scss" scoped></style>
