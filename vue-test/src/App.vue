<template>
  <div class="workflow-box py-3">
    <!-- <NodeList v-model="fs.nodes" :fs="fs" @add="handleAddNode"></NodeList> -->
    <div class="end-node">
      <div class="end-node-circle"></div>
      <div class="end-node-text grey--text fs-md mt-1">流程结束</div>
    </div>
  </div>
</template>

<script>
// import { FlowSchemeDefinition } from "workflow-designer-core";
import {NodeType} from "workflow-designer-core";
import NodeList from "./components/NodeList.vue";
import { reactive } from "vue";

export default {
  name: "App",
  components: { NodeList },
  methods: {
    init() {},
  },
  setup() {
    let fs
    // let fs = new FlowSchemeDefinition();
    console.log(NodeType)
    // fs.add({ nodeType: NodeType.开始 });
    // fs.add({ nodeType: NodeType.审批人 });
    // fs.add({ nodeType: NodeType.抄送人 });

    // const handleAddNode = function (node, newNodeIndex) {
    //   fs.add(node, newNodeIndex);
    //   node.edit();
    // };

    // return {
    //   fs,
    //   handleAddNode,
    // };
  },
};
</script>
<style lang="scss">
.btn-header {
  position: absolute;
  right: 10px;
  z-index: 1;
  top: 5px;
}
.step-item-wrap {
  height: calc(100vh - 50px);
  overflow: auto;
}
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
