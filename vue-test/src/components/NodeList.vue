<script lang="ts">
import { h } from "vue";

/* github.com/vitejs/vite/issues/178
 *title: import *.vue file without .vue will not work
 *answer: This is by design. We will also stop supporting extension-less
 *Vue imports in vue-cli in the next major.
 */
import Box from "./Box.vue";
import FlowSchemeDefinition, {
  UserChooseType,
  VerifyMethod,
  FlowSchemeNode,
  IVerifyNodeInfo,
  ICCNodeInfo,
} from "workflow-designer-core";
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
  props: {
    fs: FlowSchemeDefinition,
  },
  setup(props) {
    function getVerifyContent({
      verifyMethod,
      verifierChooseType,
      value,
      depth,
    }: IVerifyNodeInfo) {
      let method = " " + VerifyMethod[verifyMethod],
        content = UserChooseType[verifierChooseType];
      // TODO 给verifierChooseType制作function来满足不同要求
      // 指定角色时，value为number；意思为该角色下所有人员或签；目前只能或签
      if (verifierChooseType === UserChooseType.指定角色) {
        let role = this.roles.find((el) => el.id == value);
        return role ? role.displayName + method : content + method;
      } else if (verifierChooseType === UserChooseType.指定成员) {
        if (typeof value == "object") {
          switch (value.length) {
            case 0:
              return content + method;
            case 1:
              return this.users.find((el) => el.id === value[0])?.name;
            default:
              return value.length + "人" + method;
          }
        }
      } else if (verifierChooseType === UserChooseType.主管) {
        return `本级${depth > 1 ? " ~ " + depth + "级" : ""}` + "主管";
      } else {
        return content;
      }
    }
function getCCContent({
      value,
      depth,ccChooseType}:ICCNodeInfo){
      let         content = UserChooseType[ccChooseType];
      // TODO 给verifierChooseType制作function来满足不同要求
      // 指定角色时，value为number；意思为该角色下所有人员或签；目前只能或签
      if (ccChooseType === UserChooseType.指定角色) {
        let role = this.roles.find((el) => el.id == value);
        return role ? role.displayName : content ;
      } else if (ccChooseType === UserChooseType.指定成员) {
        if (typeof value == "object") {
          switch (value.length) {
            case 0:
              return content ;
            case 1:
              return this.users.find((el) => el.id === value[0])?.name;
            default:
              return "抄送"+ value.length + "人";
          }
        }
      } else if (ccChooseType === UserChooseType.主管) {
        return `本级${depth > 1 ? " ~ " + depth + "级" : ""}` + "主管";
      } else {
        return content;
      }

}

    const getNodeCom = function ({
      nodeType,
      verifyNodeInfo,
      ccNodeInfo,
    }: FlowSchemeNode) {
      let ccvalue = ccNodeInfo && ccNodeInfo.value;
      switch (nodeType) {
        case 0:
          return {
            com: Box,
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
              content: getCCContent(ccNodeInfo),
            },
          };
        default:
          return {
            com: "Box",
            attrs: { title: "未捕获", content: "发起人自选" },
          };
      }
    };

    const childNodes = props.fs.nodes.map((node: FlowSchemeNode, index) => {
      debugger;
      let { attrs, com } = getNodeCom(node);
      return h(com, {
        node,
        nodeType: node.nodeType,
        key: node.id,
        id: node.id,
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
