declare enum NodeType {
    开始 = 0,
    审批人 = 1,
    分支 = 2,
    抄送人 = 3
}
declare enum VerifyMethod {
    依次审批 = 0,
    会签 = 1,
    或签 = 2
}
declare enum UserChooseType {
    发起人自选 = 0,
    指定成员 = 1,
    指定角色 = 2,
    主管 = 3,
    项目经理 = 4,
    其他待扩展 = 5
}
declare class BranchNodeInfo {
    name: string;
    condition: string;
    private _subNodes;
    get subNodes(): FlowSchemeNode[];
    parent: FlowSchemeNode;
    get parentBranchs(): BranchNodeInfo[] | undefined;
    constructor(parent: FlowSchemeNode, condition?: string, name?: string, subNodes?: IFlowSchemeNode[]);
    add(childNode: IFlowSchemeNode | FlowSchemeNode, index?: number): void;
    remove(): BranchNodeInfo | undefined;
}
interface IFlowSchemeNode {
    nodeType: NodeType;
    verifyNodeInfo?: IVerifyNodeInfo;
    ccNodeInfo?: ICCNodeInfo;
    branchNodeInfos?: BranchNodeInfo[];
    parent: FlowSchemeDefinition | BranchNodeInfo;
}
interface IVerifyNodeInfo {
    verifierChooseType: UserChooseType;
    verifyMethod: VerifyMethod;
    value: number | number[];
    required: boolean;
    depth: number;
}
interface ICCNodeInfo {
    ccChooseType: UserChooseType;
    required: boolean;
    value: number | number[];
    allowAdd: boolean;
    depth: number;
}
declare class FlowSchemeNode {
    static nid: number;
    id: number;
    nodeType: NodeType;
    verifyNodeInfo?: IVerifyNodeInfo;
    ccNodeInfo?: ICCNodeInfo;
    branchNodeInfos?: BranchNodeInfo[];
    parent: FlowSchemeDefinition | BranchNodeInfo;
    root: FlowSchemeDefinition;
    get parentNodes(): FlowSchemeNode[];
    constructor(node: IFlowSchemeNode);
    remove(): FlowSchemeNode | undefined;
    getBranch(i: number): BranchNodeInfo | {
        add(): never;
    };
}
interface FlowSchemeDefinitionCbs {
    [propName: string]: Function;
}
declare class FlowSchemeDefinition {
    constructor(nodes?: FlowSchemeNode[], cbs?: FlowSchemeDefinitionCbs | Function);
    private _nodes;
    get nodes(): FlowSchemeNode[];
    set nodes(value: FlowSchemeNode[]);
    callbacks: FlowSchemeDefinitionCbs;
    add(nodeOps: IFlowSchemeNode, index?: number): FlowSchemeNode;
    private initNodes;
    stringify(): void;
}
export { IFlowSchemeNode, IVerifyNodeInfo, ICCNodeInfo, FlowSchemeDefinitionCbs };
export { NodeType, VerifyMethod, UserChooseType, FlowSchemeNode, FlowSchemeDefinition };
export default FlowSchemeDefinition;
