# workflowDesigner

类 DingTalk 审批设计
![WorkFlowDesigner示例.png](https://i.loli.net/2020/09/10/QCB2SXoFyU1pZnu.png)

## Usage

```javascript
npm i -S workflow-designer-core
yarn add workflow-designer-core
```

```javascript
//import FlowSchemeDefinition from 'workflow-designer-core'
import {NodeType,FlowSchemeDefinition} from 'workflow-designer-core'

var fs=new FlowSchemeDefinition()
fs.add({ nodeType: NodeType.审批人 })
fs.add({ nodeType: NodeType.抄送人 })
let branchNode=fs.add({ nodeType: NodeType.分支 })
branchNode.getBranch(0).add({ nodeType: NodeType.审批人 }) //往第一条分支下插入审批节点
branchNode.getBranch(0).add({ nodeType: NodeType.抄送人 })

console.log(fs.stringify())
```

## todolist

- [ ] 加入 Vue3.0 版本的设计器
- [ ] js 可插拔式实现，从而支持更多框架实现，例如 React 版本设计器
- [ ] 加入 jsDocs
