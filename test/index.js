

const FlowSchemeDefinition= require('../dist/index').default;

let fs = new FlowSchemeDefinition();
fs.add(new FlowSchemeNode({ nodeType: NodeType.开始 }));
fs.add(new FlowSchemeNode({ nodeType: NodeType.审批人 }));
fs.add(new FlowSchemeNode({ nodeType: NodeType.抄送人 }));
let branchNode = new FlowSchemeNode({ nodeType: NodeType.分支 });
fs.add(branchNode);
branchNode.getBranch(0).add(new FlowSchemeNode({ nodeType: NodeType.审批人 }));
branchNode.getBranch(0).add(new FlowSchemeNode({ nodeType: NodeType.抄送人 }));


  // public class FlowSchemeNode
  // {
  //     /// <summary>
  //     /// 节点类型
  //     /// </summary>
  //     public NodeType NodeType { get; set; }
  //     /// <summary>
  //     /// 审批人数据
  //     /// </summary>
  //     public VerifyNodeInfo VerifyNodeInfo { get; set; }
  //     /// <summary>
  //     /// 抄送人数据
  //     /// </summary>
  //     public CCNodeInfo CCNodeInfo { get; set; }
  //     /// <summary>
  //     /// 分支数据
  //     /// </summary>
  //     public List<BranchNodeInfo> BranchNodeInfos { get; set; }
  // }
  
  // public class BranchNodeInfo
  // {
  //     /// <summary>
  //     /// 分支条件
  //     /// </summary>
  //     public string Condition { get; set; }
  //     /// <summary>
  //     /// 分支各节点
  //     /// </summary>
  //     public List<FlowSchemeNode> SubNodes { get; set; }
  // }
  
  // public class VerifyNodeInfo
  // {
  //     /// <summary>
  //     /// 审批方式
  //     /// </summary>
  //     public VerifyMethod VerifyMethod { get; set; }
  //     /// <summary>
  //     /// 审批人选择类型
  //     /// </summary>
  //     public VerifierChooseType VerifierChooseType { get; set; }
  //     /// <summary>
  //     /// 审批人数据
  //     /// </summary>
  //     public string Value { get; set; }
  // }
  
  // public class CCNodeInfo
  // {
  //     public boolean AllowAdd { get; set; }
  //     public string Value { get; set; }
  // }
  
  // const nodes = [
  //   { NodeType: NodeType.开始 },
  //   {
  //     NodeType: NodeType.审批人,
  //     VerifyNodeInfo: {
  //       VerifyMethod: VerifyMethod.会签,
  //       VerifierChooseType: VerifierChooseType.指定用户,
  //       Value: [],
  //     },
  //   },
  //   {
  //     NodeType: NodeType.分支,
  //     BranchNodeInfos: [
  //       {
  //         Condition: "ProcessTypeName=='数控铣'",
  //         SubNodes: [
  //           {
  //             NodeType: NodeType.审批人,
  //             VerifyNodeInfo: {
  //               VerifyMethod: VerifyMethod.会签,
  //               VerifierChooseType: VerifierChooseType.指定用户,
  //               Value: "1,2,3",
  //             },
  //           },
  //           {
  //             NodeType: NodeType.审批人,
  //             VerifyNodeInfo: {
  //               VerifyMethod: VerifyMethod.依次审批,
  //               VerifierChooseType: VerifierChooseType.指定角色,
  //               Value: "1,2,3",
  //             },
  //           },
  //         ],
  //       },
  //       {
  //         Condition: "ProcessTypeName=='数控铣'",
  //         SubNodes: [
  //           {
  //             NodeType: NodeType.审批人,
  //             VerifyNodeInfo: {
  //               VerifyMethod: VerifyMethod.会签,
  //               VerifierChooseType: VerifierChooseType.指定用户,
  //               Value: "1,2,3",
  //             },
  //           },
  //           {
  //             NodeType: NodeType.审批人,
  //             VerifyNodeInfo: {
  //               VerifyMethod: VerifyMethod.依次审批,
  //               VerifierChooseType: VerifierChooseType.指定角色,
  //               Value: "1,2,3",
  //             },
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // ];
  // console.log(nodes);
  