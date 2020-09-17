<script>
import Box from "./Box";
import BranchNode from "./BranchNode";
import { VerifierChooseTypeMap, VerifyMethodMap } from "@/views/WorkFlow/util";
import getUsers from "@/api/user";
import getRoles from "@/api/role";

export default {
  name: "nodeList",
  components: { Box, NodeList, BranchNode },
  model: {
    prop: "nodes",
    event: "input",
  },
  props: ["nodes", "fs"],
  data() {
    return {
      users: [],
      roles: [],
    };
  },
  async mounted() {
    this.users = await getUsers();
    this.roles = await getRoles();
  },
  methods: {
    getVerifyContent({ verifyMethod, verifierChooseType, value }) {
      let method = " " + VerifyMethodMap[verifyMethod],
        content = VerifierChooseTypeMap[verifierChooseType];
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
    },
    getNodeCom({ nodeType, verifyNodeInfo, ccNodeInfo }) {
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
            attrs: { title: "审批人", content: this.getVerifyContent(verifyNodeInfo) },
          };
        case 2:
          return {
            com: "branch-node",
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
    },
  },
  // eslint-disable-next-line no-unused-vars
  render(h) {
    return (
      <div class="node-list-box">
        {this.nodes.map((node, index) => {
          let { attrs, com } = this.getNodeCom(node);
          //editNode是由分支组件第一项添加丢上来的(相当于list的Add)，list向上传的是编辑 Node
          return (
            <com
              node={node}
              nodeType={node.nodeType}
              key={node._id}
              id={node._id}
              {...{ attrs }}
              onAdd={(node) => {
                //NodeList中添加帮他直接加好1
                this.$emit("add", node, index + 1);
              }}
            ></com>
          );
        })}
      </div>
    );
  },
};

// { nodeType: NodeType.开始, _id: 0 },
// {
//   nodeType: NodeType.审批人,
//   _id: 1,
//   verifyNodeInfo: {
//     verifyMethod: VerifyMethod.会签,
//     verifierChooseType: VerifierChooseType.指定用户,
//     value: [],
//   },
// },
// {
//   nodeType: NodeType.抄送人,
//   _id: 2,
//   verifyNodeInfo: {
//     verifyMethod: VerifyMethod.会签,
//     verifierChooseType: VerifierChooseType.指定用户,
//     value: [],
//   },
// },
//   {
//     NodeType: NodeType.分支,
//     BranchNodeInfos: [
//       {
//         Condition: "ProcessTypeName=='数控铣'",
//         SubNodes:[]
//       }
//     ]
//   }
</script>
<style lang="scss" scoped>
.node-list-box {
  display: inline-flex;
  flex-direction: column;
  width: 100%;
}
</style>
