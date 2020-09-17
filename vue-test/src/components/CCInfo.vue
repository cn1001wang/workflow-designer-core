<!--  -->
<template>
  <v-card class="d-flex flex-column" style="height: 100vh;">
    <v-card-title>抄送人</v-card-title>
    <v-card-text class="mb-auto overflow-auto">
      <div>
        <label class="v-label mr-3">默认抄送人</label>
        <UserSelect v-model="value.value" multiple></UserSelect>
      </div>
      <v-checkbox v-model="value.allowAdd" label="允许发起人添加抄送人"></v-checkbox>
      <v-divider class="mt-3 mb-2"></v-divider>
      <v-switch v-model="value.required" label="抄送人必填"></v-switch>
    </v-card-text>
  </v-card>
</template>

<script>
import UserSelect from "@/components/SearchSelect/User";
export default {
  components: { UserSelect },
  props: { value: Object },
};
</script>

<style lang="scss" scoped></style>
