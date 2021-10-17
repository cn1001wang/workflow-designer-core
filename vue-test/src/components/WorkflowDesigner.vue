<!--  -->
<template>
  <div class="workflow-box py-3" v-if="fs">
    <NodeList :fs="fs" @add="handleAddNode"></NodeList>
    <div class="end-node">
      <div class="end-node-circle"></div>
      <div class="end-node-text grey--text fs-md mt-1">流程结束</div>
    </div>
  </div>
</template>

<script>
import FlowSchemeDefinition,{ NodeType }  from "workflow-designer-core";
import NodeList from "./NodeList.vue";

export default {
  name: "WorkFlowDesigner",
  components: { NodeList },
  props: {
    value: Object,
  },
  data() {
    return {
      fs: null,
    };
  },
  methods: {
    handleAddNode(){

    },
    initFS() {
      if (this.value?.nodes?.length) {
        this.fs = new FlowSchemeDefinition(this.value.nodes);
      } else {
        let fs = new FlowSchemeDefinition();
        fs.add({ nodeType: NodeType.开始 });
        fs.add({ nodeType: NodeType.审批人 });
        fs.add({ nodeType: NodeType.抄送人 });
        this.fs = fs;
      }
    },
  },
  created() {
    this.initFS();
  },
};
</script>
<style lang="scss">
.workflow-box {
  background: #f5f5f7;
  min-width: min-content;
  min-height: 100%;
  .end-node {
    .end-node-circle {
      width: 10px;
      height: 10px;
      margin: auto;
      border-radius: 50%;
      background: #dbdcdc;
    }
    .end-node-text {
      margin-top: 5px;
      text-align: center;
    }
  }
}
</style>
