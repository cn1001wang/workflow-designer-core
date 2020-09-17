<!--  -->
<template>
  <div class="branch-wrap">
    <div class="branch-box-wrap">
      <div class="branch-box">
        <v-btn class="add-btn" @click="addBranch" rounded>添加条件</v-btn>
        <div
          class="col-box"
          v-for="(branchNodeInfo, index) in branchNodeInfos"
          :key="index"
          v-click-outside="() => (branchNodeInfo.isEditActive ? (branchNodeInfo.isEditActive = false) : null)"
        >
          <div class="top-left-cover-line" v-if="index === 0"></div>
          <div class="bottom-left-cover-line" v-if="index === 0"></div>
          <div class="condition-node d-flex jc-center flex-column ai-center">
            <div
              class="condition-node-box"
              v-ripple
              :class="[branchNodeInfo.isEditActive ? 'node-box_active' : '']"
              @click="branchNodeInfo.edit()"
            >
              <div class="box-title">
                <span class="grey--text">优先级{{ index + 1 }}</span>
                <v-icon class="box-close" @click.stop="branchNodeInfo.remove()">mdi-close</v-icon>
              </div>
              <div class="box-content">
                <div class="d-flex jc-between ai-center box-content_view text-ellipsis mx-100">
                  {{ branchNodeInfo.condition }}
                </div>
              </div>
            </div>
            <NodeAddBtn @add="handleAddNode($event, 0, branchNodeInfo)" />
          </div>
          <NodeList
            v-model="branchNodeInfo.subNodes"
            @add="
              (node, newNodeIndex) => {
                handleAddNode(node, newNodeIndex, branchNodeInfo);
              }
            "
          ></NodeList>
          <div class="top-right-cover-line" v-if="index === branchNodeInfos.length - 1"></div>
          <div class="bottom-right-cover-line" v-if="index === branchNodeInfos.length - 1"></div>
        </div>
      </div>
      <NodeAddBtn @add="handleAddNode($event)" />
    </div>
  </div>
</template>

<script>
import NodeAddBtn from "./NodeAddBtn";
import { scrolToRight } from "@/util";
export default {
  components: { NodeList: () => import("./NodeList"), NodeAddBtn },
  props: {
    node: Object,
    nodeType: Number,
    title: String,
  },
  data() {
    return { activeBranch: null };
  },
  computed: {
    branchNodeInfos() {
      return this.node.branchNodeInfos;
    },
  },
  methods: {
    handleAddNode(node, newNodeIndex, branchNodeInfo) {
      if (!branchNodeInfo) {
        let newIndex = this.node.parentNodes.indexOf(this.node);
        this.node.parent.add(node, newIndex + 1);
      } else {
        branchNodeInfo.add(node, newNodeIndex);
      }
      node.edit();
    },
    addBranch() {
      let branch = this.node.newBranch();
      this.$nextTick(() => {
        scrolToRight(this.$$.query(".step-item-wrap"));
      });
      return branch;
    },
    handleBranchEdit(branchNodeInfo) {
      branchNodeInfo.edit();
    },
  },
};
</script>

<style lang="scss" scoped>
.branch-box-wrap {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  min-height: 270px;
  width: 100%;
  flex-shrink: 0;
  .branch-box {
    display: flex;
    position: relative;
    border-bottom: 2px solid #ccc;
    border-top: 2px solid #ccc;
    .add-btn {
      top: -15px;
      position: absolute;
      user-select: none;
      font-size: 12px;
      padding: 0 10px;
      height: 30px;
      line-height: 30px;
      // border-radius: 15px;
      color: #0089ff;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1;
    }
  }
}

.col-box {
  flex: 1;
  position: relative;
  display: inline-flex;
  flex-direction: column;
  background: #f5f5f7;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    margin: auto;
    width: 2px;
    height: 100%;
    background-color: #cacaca;
  }

  .top-left-cover-line,
  .top-right-cover-line {
    position: absolute;
    height: 3px;
    width: 50%;
    background-color: #f5f5f7;
    top: -2px;
  }
  .bottom-left-cover-line,
  .bottom-right-cover-line {
    position: absolute;
    height: 3px;
    width: 50%;
    background-color: #f5f5f7;
    bottom: -2px;
  }
  .top-right-cover-line,
  .bottom-right-cover-line {
    right: -1px;
  }
}

.condition-node {
  padding: 0 50px;
  padding-top: 30px;
}
.condition-node-box {
  display: inline-flex;
  flex-direction: column;
  position: relative;
  width: 220px;
  min-height: 72px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  &::after {
    pointer-events: none;
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
    border-radius: 4px;
    border: 1px solid transparent;
    transition: all 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
    // box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  }

  &.node-box_active::after,
  &:hover::after {
    border: 1px solid #3296fa;
  }

  &:hover {
    box-shadow: 0 0 6px 0 rgba(50, 150, 250, 0.3);
    .box-close {
      display: block !important;
    }
  }

  .box-title {
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 16px;
    padding-right: 30px;
    width: 100%;
    height: 24px;
    line-height: 24px;
    font-size: 12px;
    text-align: left;
    border-radius: 4px 4px 0 0;
    box-shadow: 0px -1px 3px 1px rgb(0 0 0 / 0.1);
    .box-close {
      font-size: 14px;
      display: none;
      position: absolute;
      right: 16px;
    }
  }
  .box-content {
    position: relative;
    font-size: 14px;
    padding: 13px 16px;
    // padding-right: 30px;
    .box-content_view {
      height: 22px;
    }
  }
}
</style>
