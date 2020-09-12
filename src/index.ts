// 节点类型
enum NodeType {
  开始,
  审批人,
  分支,
  抄送人,
}
// 审批方式
enum VerifyMethod {
  依次审批,
  会签,
  或签,
}
// 审批人选择类型
enum VerifierChooseType {
  发起人自选,
  指定成员,
  指定角色,
  部门主管,
  项目经理,
  模具组长,
}
class BranchNodeInfo {
  name: string;
  condition: string; //该分支条件
  private _subNodes: FlowSchemeNode[]; //该分支下的节点数组
  get subNodes() {
    return this._subNodes;
  }
  parent: FlowSchemeNode; //对于父节点的引用
  get parentBranchs() {
    return this.parent.branchNodeInfos;
  }
  constructor(parent: FlowSchemeNode, condition?: string, name?: string, subNodes?: FlowSchemeNode[]) {
    this.condition = condition ?? "请设置条件";
    this.name = name ?? "请设置条件";
    this.parent = parent;
    this._subNodes = [];
    this.parentBranchs?.push(this);

    //直接给subNodes重新创建
    if (subNodes) {
      subNodes.forEach((childNode) => {
        this.add(childNode);
      });
    }
  }
  //新增Node到第index条分支
  add(childNode: IFlowSchemeNode, index?: number) {
    let flowSchemeNode = new FlowSchemeNode({ ...childNode, parent: this });

    if (typeof index === "undefined") index = this.subNodes.length;
    this.subNodes.splice(index, 0, flowSchemeNode); //插入
  }
  //移除分支
  remove() {
    let index = this.parentBranchs.indexOf(this);
    let branch = null;
    if (index > -1) {
      branch = this.parentBranchs.splice(index, 1);
      if (this.parentBranchs.length === 0) {
        this.parent.remove();
        //需要清除整个branchNode
      }
    }
    return branch;
  }
}

interface IFlowSchemeNode {
  nodeType: NodeType;
  verifyNodeInfo?: IVerifyNodeInfo;
  ccNodeInfo?: ICCNodeInfo;
  branchNodeInfos?: BranchNodeInfo[];
  parent: FlowSchemeDefinition | BranchNodeInfo;
}
interface IVerifyNodeInfo {
  verifierChooseType: VerifierChooseType; // 审批人选择类型
  verifyMethod: VerifyMethod; // 审批方式
  value: number | number[];
  required: boolean;
}
interface ICCNodeInfo {
  required: boolean; //提交时抄送人是否必填
  value: number | number[]; //默认抄送人
  allowAdd: boolean; //允许发起人添加抄送人
}

class FlowSchemeNode {
  static nid = 0;
  private _id: number;
  nodeType: NodeType;
  verifyNodeInfo?: IVerifyNodeInfo;
  ccNodeInfo?: ICCNodeInfo;
  branchNodeInfos?: BranchNodeInfo[];

  parent: FlowSchemeDefinition | BranchNodeInfo;
  get parentNodes() {
    return this.parent.nodes;
  }

  constructor(node: IFlowSchemeNode) {
    const { nodeType, verifyNodeInfo, branchNodeInfos, ccNodeInfo, parent } = node;

    this.nodeType = nodeType; //节点类型
    this.parent = parent;
    this._id = FlowSchemeNode.nid++;

    switch (nodeType) {
      case NodeType.审批人:
        this.verifyNodeInfo = {
          verifyMethod: verifyNodeInfo?.verifyMethod ?? VerifyMethod.依次审批,
          verifierChooseType: verifyNodeInfo?.verifierChooseType ?? VerifierChooseType.发起人自选,
          value: verifyNodeInfo?.value ?? [],
          required: verifyNodeInfo?.required ?? false,
        };
        break;
      case NodeType.分支:
        this.branchNodeInfos = [];
        if (branchNodeInfos) {
          branchNodeInfos.forEach((branch) => {
            //new 分支时候 会自动将 分支加入 当前节点下
            new BranchNodeInfo(this, branch.condition, branch.name, branch.subNodes);
          });
        }else{
          let branchIndex = this.parentNodes.indexOf(this);
          let nextNodes = this.parentNodes.splice(branchIndex + 1);
          new BranchNodeInfo(this, ``, `优先级1`, branch.subNodes);
          new BranchNodeInfo(this,``, , branch.subNodes);

        }
        //如果是分支类型，在添加完parentNodes之后需要进行init操作
        this.initBranch();

        break;
      case NodeType.抄送人:
        this.ccNodeInfo = {
          allowAdd: ccNodeInfo?.allowAdd ?? true,
          value: ccNodeInfo?.value ?? [],
          required: ccNodeInfo?.required ?? false,
        };
        break;
      default:
        break;
    }
  }
  remove() {
    let index = this.parentNodes.indexOf(this);
    let node = null;
    if (index > -1) {
      [node] = this.parentNodes.splice(index, 1);
      node.clearParent();
    }
    return node;
  }
  edit() {
    this.isEditActive = true;
    Vue.prototype.$bus.$emit("FlowSchemeNodeEdit", this);
  }
  getBranch(i: number) {
    let defaultErr = {
      add() {
        throw new Error("请先挂载实例到flowSchemeDefinition上，再进行添加");
      },
    };
    if (!this.branchNodeInfos) return defaultErr;
    let branch = this.branchNodeInfos[i];
    return branch || defaultErr;
  }
  // //新增分支
  // newBranch({ condition, subNodes } = {}) {
  //   let branchNodeInfo = new BranchNodeInfo(condition, this);

  //   let _subNodes = [];
  //   Object.defineProperty(branchNodeInfo, "subNodes", {
  //     enumerable: true,
  //     configurable: true,
  //     get() {
  //       // - //用this是因为get会让vue失去响应式，vue实际响应的是_subNodes
  //       // + //使用configurable让subNodes能够被改变 ，才能被Vue的defineReactive所监听
  //       return _subNodes;
  //     },
  //     set(value) {
  //       console.warn("禁止修改分支的subNodes的引用，但可以修改subNodes的内容", value);
  //     },
  //   });
  //   this.branchNodeInfos.push(branchNodeInfo);
  //   //直接给subNodes重新创建
  //   if (subNodes) {
  //     subNodes.forEach((childNode) => {
  //       let newChildNode = new FlowSchemeNode(childNode);
  //       branchNodeInfo.add(newChildNode);
  //     });
  //   }
  //   return branchNodeInfo;
  // }
  initBranch() {
    let branchIndex = this.parentNodes.indexOf(this);
    let nextNodes = this.parentNodes.splice(branchIndex + 1);
    this.branchNodeInfos.subNodes=nextNodes;

    this.newBranch({ subNodes: nextNodes });
    this.newBranch();
  }
  clearParent() {
    this.parentNodes = null;
    this.parent = null;
  }
}

class FlowSchemeDefinition {
  constructor(nodes?: FlowSchemeNode[]) {
    this._nodes = [];
    nodes && this.initNodes(nodes);
  }
  private _nodes: FlowSchemeNode[];
  get nodes() {
    return this._nodes;
  }
  set nodes(value) {
    console.warn("禁止修改nodes的引用，但可以修改nodes的内容", value);
  }

  add(nodeOps: IFlowSchemeNode, index?: number) {
    if (typeof index === "undefined") index = this.nodes.length; //不传index插入最后一位
    let node: FlowSchemeNode = new FlowSchemeNode({ ...nodeOps, parent: this });

    this.nodes.splice(index, 0, node);

    // //如果是分支类型，在添加完parentNodes之后需要进行init操作
    // if (node.nodeType === NodeType.分支 && !node.branchNodeInfos?.length) {
    //   node.initBranch();
    // }
    return node;
  }
  private initNodes(nodes: FlowSchemeNode[]) {
    nodes.forEach((node) => {
      this.add(node);
    });
  }
}

// FlowSchemeNode
export { NodeType, VerifyMethod, VerifierChooseType, FlowSchemeDefinition };
export default FlowSchemeDefinition;
