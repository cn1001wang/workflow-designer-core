<!--  -->
<template>
  <div>
    <el-checkbox-group v-model="checkList" @change="checkChange">
      <el-table
        :data="tableData"
        class="mb-2"
        height="calc(100vh - 160px)"
        row-key="id"
        border
        default-expand-all
        size="mini"
        ref="table"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column label="请选择任务名称">
          <template v-slot="{ row }">
            <el-checkbox v-if="!row.isParent" :label="row.id">{{ row.name }}</el-checkbox>
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  props: {
    value: String,
  },
  data() {
    return {
      tableData: [],
      checkList: [],
    };
  },
  methods: {
    checkChange() {
      this.$emit("input", `[${this.checkList.toString()}].includes(d.relType)`);
    },
  },
  watch: {
    value: {
      handler() {
        let result = /\[(.*)\]/.exec(this.value);
        if (result && result[1]) {
          this.checkList = result[1]?.split(",") ?? [];
        }
      },
      immediate: true,
    },
  },
  async mounted() {
    let res = await this.$ajax(`/api/services/app/Template/GetDefaultTemplate?templateType=ProjectScheduler`);
    try {
      if (!res || !res.templateContent) return this.$message({ type: "warning", message: "请先前往添加默认进度模板" });
      this.tableData = JSON.parse(res.templateContent);
    } catch (e) {
      this.$message({ type: "error", message: "模板有误，请编辑删除默认进度模板" });
    }
  },
};
</script>

<style lang="scss" scoped></style>
