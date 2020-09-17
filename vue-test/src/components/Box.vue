<!--  -->
<template>
  <div>box</div>
  <!-- <div class="node-box-wrap">
    <div class="node-box" :class="[node.isEditActive ? 'node-box_active' : '', nodeType === 0 ? 'node-box_start' : '']">
      <template v-if="nodeType === 0">
        <div class="box-title">流程发起人</div>
        <div class="box-content">
          <slot name="content">
            <div class="d-flex jc-center ai-center box-content_view fs-md">流程发起人</div>
          </slot>
        </div>
      </template>
      <template v-else>
        <div class="box-title d-flex" :class="boxtitleColor">
          <v-icon x-small light color="white" class="mr-2">{{ NodeTypeIcons[nodeType] }}</v-icon>
          <div class="flex-1" @click="titleClick" v-click-outside="onClickOutside">
            <span v-if="!titleActive">{{ title }}</span>
            <input v-else class="title-input px-2" type="text" v-model="title" ref="titleInput" />
          </div>
          <div class="box-close-wrap" @click="node.remove()">
            <v-icon class="box-close">mdi-close</v-icon>
          </div>
        </div>
        <div class="box-content" v-ripple @click="node.edit()">
          <slot name="content">
            <div class="d-flex jc-between ai-center box-content_view">
              {{ content }}

              <v-btn v-if="content" small icon>
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </div>
          </slot>
        </div>
      </template>
    </div>
    <NodeAddBtn v-on="$listeners" />
  </div> -->
</template>

<script>
// import NodeAddBtn from "./NodeAddBtn";
// import { NodeTypeIcons } from "@/views/WorkFlow/util";
export default {
  // components: { NodeAddBtn },
  props: {
    title: String,
    content: String,
    node: Object,
    nodeType: {
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return [0, 1, 3].includes(value);
      },
    },
  },
  data() {
    return {
      NodeTypeIcons,
      titleActive: false,
    };
  },
  computed: {
    boxtitleColor() {
      switch (this.nodeType) {
        case 1:
          return ["amber darken-3"];
        case 3:
          return ["blue"];
        default:
          return ["indigo"];
      }
    },
  },
  methods: {
    titleClick() {
      this.titleActive = true;
      this.$nextTick(() => {
        this.$refs.titleInput.focus();
        this.$refs.titleInput.select();
      });
    },
    onClickOutside() {
      this.titleActive = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.node-box-wrap {
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  padding: 0 50px;
  position: relative;
  width: 100%;
  .node-box {
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
    // border: 1px solid transparent;
    &::before {
      content: "";
      position: absolute;
      top: -12px;
      left: 50%;
      -webkit-transform: translateX(-50%);
      transform: translateX(-50%);
      width: 0;
      height: 4px;
      border-style: solid;
      border-width: 8px 6px 4px;
      border-color: #cacaca transparent transparent;
      background: #f5f5f7;
    }
    &.node-box_start::before {
      display: none;
    }

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
      padding-right: 16px;
      width: 100%;
      height: 24px;
      line-height: 24px;
      font-size: 12px;
      color: #fff;
      text-align: left;
      background: #576a95;
      border-radius: 4px 4px 0 0;
      .box-close-wrap {
        width: 14px;
        .box-close {
          font-size: 14px;
          display: none;
        }
      }
    }
    .box-content {
      position: relative;
      font-size: 14px;
      padding: 16px;
      // padding-right: 30px;
      .box-content_view {
        height: 28px;
      }
    }
  }
}

.title-input {
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 20px;
  line-height: 20px;
  outline: none;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
}
</style>
