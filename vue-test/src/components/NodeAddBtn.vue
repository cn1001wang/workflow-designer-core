<!--  -->
<template>
  <div class="node-add">
    <v-menu v-model="addMenuVisible" close-on-content-click :nudge-width="200" offset-x close-on-click>
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="node-add-btn" fab dark x-small color="indigo" v-bind="attrs" v-on="on">
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
      </template>

      <v-list dense>
        <v-list-item
          v-for="(item, index) in addItems"
          :key="index"
          @click="handleAddNode(item.nodeType)"
          v-ripple="{ class: `primary--text` }"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { NodeTypeIcons, FlowSchemeNode } from "@/views/WorkFlow/util";
export default {
  data() {
    return {
      addMenuVisible: false,
      addItems: [
        { title: "审核人", icon: NodeTypeIcons[1], nodeType: 1 },
        { title: "条件分支", icon: NodeTypeIcons[2], nodeType: 2 },
        { title: "抄送人", icon: NodeTypeIcons[3], nodeType: 3 },
      ],
    };
  },
  methods: {
    handleAddNode(newNodeType) {
      let node = new FlowSchemeNode({ nodeType: newNodeType });
      this.$emit("add", node);
    },
  },
};
</script>

<style lang="scss" scoped>
.node-add {
  width: 220px;
  text-align: center;
  position: relative;
  // border: 1px solid green;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 2px;
    height: 100%;
    background-color: #cacaca;
  }
  .node-add-btn {
    margin: 20px 0 35px;
  }
}
</style>
