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
  name: string; //该分支名称
  condition: string; //该分支条件
  private _subNodes: FlowSchemeNode[]; //该分支下的节点数组
  get subNodes() {
    return this._subNodes;
  }

  parent: FlowSchemeNode; //对于父节点的引用
  get parentBranchs() {
    return this.parent.branchNodeInfos;
  }
  constructor(parent: FlowSchemeNode, condition?: string, name?: string, subNodes?: IFlowSchemeNode[]) {
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
  add(childNode: IFlowSchemeNode | FlowSchemeNode, index?: number) {
    let flowSchemeNode;
    if (childNode instanceof FlowSchemeNode) {
      flowSchemeNode = childNode;
      flowSchemeNode.parent = this;
    } else {
      flowSchemeNode = new FlowSchemeNode({ ...childNode, parent: this });
    }

    if (typeof index === "undefined") index = this.subNodes.length;
    this.subNodes.splice(index, 0, flowSchemeNode); //插入
  }
  //移除分支
  remove(): BranchNodeInfo | undefined {
    if (!this.parentBranchs) return;
    let index = this.parentBranchs.indexOf(this);
    let branch;
    if (index > -1) {
      branch = this.parentBranchs.splice(index, 1)[0];
      //需要清除整个branchNode
      if (this.parentBranchs.length === 0) {
        this.parent.remove();
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
  root: FlowSchemeDefinition;
  get parentNodes() {
    return this.parent instanceof FlowSchemeDefinition ? this.parent.nodes : this.parent.subNodes;
  }

  constructor(node: IFlowSchemeNode) {
    const { nodeType, verifyNodeInfo, branchNodeInfos, ccNodeInfo, parent } = node;

    this.nodeType = nodeType; //节点类型
    this.parent = parent;
    this.root = parent instanceof BranchNodeInfo ? parent.parent.root : parent;
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
        } else {
          let branchIndex = this.parentNodes.indexOf(this);
          let nextNodes = this.parentNodes.splice(branchIndex + 1);
          new BranchNodeInfo(this, ``, `优先级1`, nextNodes);
          new BranchNodeInfo(this, ``, `优先级2`);
        }

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

    //注册根节点传入的回调函数 ，调用方法为 只传入一个Function，用默认的cb调用，否则用用他的key作为函数的函数名
    for (let key in this.root.callbacks) {
      //在原型链上或自身已存在属性不进行修改
      if (key in this) return;
      Object.defineProperty(this, key, {
        value: this.root.callbacks[key].bind(this),
      });
    }
  }
  //移除节点 node.remove()
  remove(): FlowSchemeNode | undefined {
    let index = this.parentNodes.indexOf(this);
    let node;
    if (index > -1) {
      node = this.parentNodes.splice(index, 1)[0];
      //估计也没必要清除父节点的引用吧
      // this.parent = null;
    }
    return node;
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
}
interface FlowSchemeDefinitionCbs {
  [propName: string]: Function;
}
class FlowSchemeDefinition {
  constructor(nodes?: FlowSchemeNode[], cbs?: FlowSchemeDefinitionCbs | Function) {
    this._nodes = [];
    nodes && this.initNodes(nodes);

    //初始化 配置项 ：node.edit 回调
    if (cbs) {
      this.callbacks = typeof cbs === "function" ? { editCallback: cbs } : cbs;
    } else {
      this.callbacks = { cb: function () {} };
    }
  }
  private _nodes: FlowSchemeNode[];
  get nodes() {
    return this._nodes;
  }
  set nodes(value) {
    console.warn("禁止修改nodes的引用，但可以修改nodes的内容", value);
  }
  callbacks: FlowSchemeDefinitionCbs;

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
