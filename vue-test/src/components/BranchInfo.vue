<!--  -->
<template>
  <v-card class="d-flex flex-column" style="height: 100vh;">
    <v-card-title class="d-flex ai-center jc-between">
      <v-chip class="ma-2" color="primary">条件{{ branchIndex }}</v-chip>
      <!-- <v-chip class="ma-2" color="" small>优先级{{ branchIndex }}</v-chip> -->
      <v-subheader>优先级{{ branchIndex }}</v-subheader>
    </v-card-title>
    <v-card-text class="mb-auto overflow-auto">
      <el-input v-model="value.condition" class="mb-2"></el-input>

      <BranchInfoSchedulerTask v-if="isSchedulerTask" v-model="value.condition"></BranchInfoSchedulerTask>
    </v-card-text>
  </v-card>
</template>

<script>
import BranchInfoSchedulerTask from "./BranchInfoSchedulerTask";
export default {
  props: { value: Object, formKey: String },
  components: { BranchInfoSchedulerTask },
  data() {
    return {};
  },
  computed: {
    branchIndex() {
      return this.value.parentBranchs.indexOf(this.value) + 1;
    },
    isSchedulerTask() {
      return this.formKey === "SchedulerTask";
    },
  },
};
</script>

<style lang="scss" scoped></style>
