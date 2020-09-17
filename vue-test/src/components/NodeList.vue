<script>
import { h } from "vue";

/* github.com/vitejs/vite/issues/178
 *title: import *.vue file without .vue will not work
 *answer: This is by design. We will also stop supporting extension-less
 *Vue imports in vue-cli in the next major.
 */
import Box from "./Box.vue";
// import BranchNode from "./BranchNode";
// import { VerifierChooseTypeMap, VerifyMethodMap } from "@/views/WorkFlow/util";
// import getUsers from "@/api/user";
// import getRoles from "@/api/role";

export default {
  name: "nodeList",
  components: { Box },
  model: {
    prop: "nodes",
    event: "input",
  },
  setup(...args) {
    console.log(args);
    const getNodeCom = function ({ nodeType, verifyNodeInfo, ccNodeInfo }) {
      let ccvalue = ccNodeInfo && ccNodeInfo.value;
      switch (nodeType) {
        case 0:
          return {
            com: "Box",
            attrs: {},
          };
        case 1:
          return {
            com: "Box",
            attrs: {
              title: "审批人",
              content: this.getVerifyContent(verifyNodeInfo),
            },
          };
        case 2:
          return {
            com: "div",
            attrs: { title: "分支" },
          };
        case 3:
          return {
            com: "Box",
            attrs: {
              title: "抄送人",
              content:
                ccvalue && ccvalue.length
                  ? this.users
                      .filter((el) => ccvalue.includes(el.id))
                      .map((el) => el.name)
                      .join(",")
                  : "发起人自选",
            },
          };
        default:
          return {
            com: "Box",
            attrs: { title: "未捕获", content: "发起人自选" },
          };
      }
    };

    const childNodes = nodes.map((node, index) => {
      let { attrs, com } = getNodeCom(node);
      return h(com, {
        node,
        nodeType: node.nodeType,
        key: node._id,
        id: node._id,
        ...attrs,
        onAdd: (node) => {
          //将新节点插入当前节点下方
          let insertIndex = index + 1;
          let nodeIns = this.fs.add(node, insertIndex);
          this.$emit("add", nodeIns, insertIndex);
        },
      });
    });

    return () =>
      h("div", {
        class: ["node-list-box"],
        childNodes,
      });
  },
};
</script>
<style lang="scss" scoped>
.node-list-box {
  display: inline-flex;
  flex-direction: column;
  width: 100%;
}
</style>
