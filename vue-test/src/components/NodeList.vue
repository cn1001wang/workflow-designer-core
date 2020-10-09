<script>
import { h } from "vue";

/* github.com/vitejs/vite/issues/178
 *title: import *.vue file without .vue will not work
 *answer: This is by design. We will also stop supporting extension-less
 *Vue imports in vue-cli in the next major.
 */
import Box from "./Box.vue";
import { VerifierChooseType, VerifyMethod } from "workflow-designer-core";
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
  setup(props) {
    console.log(args);

    function getVerifyContent({ verifyMethod, verifierChooseType, value }) {
      let method = " " + VerifyMethod[verifyMethod],
        content = VerifierChooseType[verifierChooseType];
      if ([0, 3, 4, 5].includes(verifierChooseType)) return content;
      if (verifierChooseType === 2) {
        let role = this.roles.find((el) => el.id == value);
        return role ? role.displayName + method : content + method;
      } else if (verifierChooseType === 1) {
        if (typeof value !== "object") return content + method;
        switch (value.length) {
          case 0:
            return content + method;
          case 1:
            return this.users.find((el) => el.id === value[0])?.name;
          default:
            return value.length + "人" + method;
        }
      }
    }
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
              content: getVerifyContent(verifyNodeInfo),
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
