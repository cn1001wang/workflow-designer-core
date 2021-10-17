var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
// 节点类型
var NodeType;
(function (NodeType) {
    NodeType[NodeType["\u5F00\u59CB"] = 0] = "\u5F00\u59CB";
    NodeType[NodeType["\u5BA1\u6279\u4EBA"] = 1] = "\u5BA1\u6279\u4EBA";
    NodeType[NodeType["\u5206\u652F"] = 2] = "\u5206\u652F";
    NodeType[NodeType["\u6284\u9001\u4EBA"] = 3] = "\u6284\u9001\u4EBA";
})(NodeType || (NodeType = {}));
// 审批方式
var VerifyMethod;
(function (VerifyMethod) {
    VerifyMethod[VerifyMethod["\u4F9D\u6B21\u5BA1\u6279"] = 0] = "\u4F9D\u6B21\u5BA1\u6279";
    VerifyMethod[VerifyMethod["\u4F1A\u7B7E"] = 1] = "\u4F1A\u7B7E";
    VerifyMethod[VerifyMethod["\u6216\u7B7E"] = 2] = "\u6216\u7B7E";
})(VerifyMethod || (VerifyMethod = {}));
// 审批人选择类型
var UserChooseType;
(function (UserChooseType) {
    UserChooseType[UserChooseType["\u53D1\u8D77\u4EBA\u81EA\u9009"] = 0] = "\u53D1\u8D77\u4EBA\u81EA\u9009";
    UserChooseType[UserChooseType["\u6307\u5B9A\u6210\u5458"] = 1] = "\u6307\u5B9A\u6210\u5458";
    UserChooseType[UserChooseType["\u6307\u5B9A\u89D2\u8272"] = 2] = "\u6307\u5B9A\u89D2\u8272";
    UserChooseType[UserChooseType["\u4E3B\u7BA1"] = 3] = "\u4E3B\u7BA1";
    UserChooseType[UserChooseType["\u9879\u76EE\u7ECF\u7406"] = 4] = "\u9879\u76EE\u7ECF\u7406";
    UserChooseType[UserChooseType["\u5176\u4ED6\u5F85\u6269\u5C55"] = 5] = "\u5176\u4ED6\u5F85\u6269\u5C55";
})(UserChooseType || (UserChooseType = {}));
var BranchNodeInfo = /** @class */ (function () {
    function BranchNodeInfo(parent, condition, name, subNodes) {
        var _this = this;
        var _a;
        this.condition = condition !== null && condition !== void 0 ? condition : '请设置条件';
        this.name = name !== null && name !== void 0 ? name : '请设置条件';
        this.parent = parent;
        this._subNodes = [];
        (_a = this.parentBranchs) === null || _a === void 0 ? void 0 : _a.push(this);
        //直接给subNodes重新创建
        if (subNodes) {
            subNodes.forEach(function (childNode) {
                _this.add(childNode);
            });
        }
    }
    Object.defineProperty(BranchNodeInfo.prototype, "subNodes", {
        get: function () {
            return this._subNodes;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BranchNodeInfo.prototype, "parentBranchs", {
        get: function () {
            return this.parent.branchNodeInfos;
        },
        enumerable: false,
        configurable: true
    });
    //新增Node到第index条分支
    BranchNodeInfo.prototype.add = function (childNode, index) {
        var flowSchemeNode;
        if (childNode instanceof FlowSchemeNode) {
            flowSchemeNode = childNode;
            flowSchemeNode.parent = this;
        }
        else {
            flowSchemeNode = new FlowSchemeNode(__assign(__assign({}, childNode), { parent: this }));
        }
        if (typeof index === 'undefined')
            index = this.subNodes.length;
        this.subNodes.splice(index, 0, flowSchemeNode); //插入
    };
    //移除分支
    BranchNodeInfo.prototype.remove = function () {
        if (!this.parentBranchs)
            return;
        var index = this.parentBranchs.indexOf(this);
        var branch;
        if (index > -1) {
            branch = this.parentBranchs.splice(index, 1)[0];
            //需要清除整个branchNode
            if (this.parentBranchs.length === 0) {
                this.parent.remove();
            }
        }
        return branch;
    };
    return BranchNodeInfo;
}());
var FlowSchemeNode = /** @class */ (function () {
    function FlowSchemeNode(node) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var nodeType = node.nodeType, verifyNodeInfo = node.verifyNodeInfo, branchNodeInfos = node.branchNodeInfos, ccNodeInfo = node.ccNodeInfo, parent = node.parent;
        this.nodeType = nodeType; //节点类型
        this.parent = parent;
        this.root = parent instanceof BranchNodeInfo ? parent.parent.root : parent;
        this.id = FlowSchemeNode.nid++;
        switch (nodeType) {
            case NodeType.审批人:
                this.verifyNodeInfo = {
                    verifyMethod: (_a = verifyNodeInfo === null || verifyNodeInfo === void 0 ? void 0 : verifyNodeInfo.verifyMethod) !== null && _a !== void 0 ? _a : VerifyMethod.依次审批,
                    verifierChooseType: (_b = verifyNodeInfo === null || verifyNodeInfo === void 0 ? void 0 : verifyNodeInfo.verifierChooseType) !== null && _b !== void 0 ? _b : UserChooseType.发起人自选,
                    value: (_c = verifyNodeInfo === null || verifyNodeInfo === void 0 ? void 0 : verifyNodeInfo.value) !== null && _c !== void 0 ? _c : [],
                    required: (_d = verifyNodeInfo === null || verifyNodeInfo === void 0 ? void 0 : verifyNodeInfo.required) !== null && _d !== void 0 ? _d : false,
                    depth: (_e = verifyNodeInfo === null || verifyNodeInfo === void 0 ? void 0 : verifyNodeInfo.depth) !== null && _e !== void 0 ? _e : 1,
                };
                break;
            case NodeType.分支:
                this.branchNodeInfos = [];
                if (branchNodeInfos) {
                    branchNodeInfos.forEach(function (branch) {
                        //new 分支时候 会自动将 分支加入 当前节点下
                        new BranchNodeInfo(_this, branch.condition, branch.name, branch.subNodes);
                    });
                }
                else {
                    var branchIndex = this.parentNodes.indexOf(this);
                    var nextNodes = this.parentNodes.splice(branchIndex + 1);
                    new BranchNodeInfo(this, "", "\u4F18\u5148\u7EA71", nextNodes);
                    new BranchNodeInfo(this, "", "\u4F18\u5148\u7EA72");
                }
                break;
            case NodeType.抄送人:
                this.ccNodeInfo = {
                    ccChooseType: (_f = ccNodeInfo === null || ccNodeInfo === void 0 ? void 0 : ccNodeInfo.ccChooseType) !== null && _f !== void 0 ? _f : UserChooseType.发起人自选,
                    allowAdd: (_g = ccNodeInfo === null || ccNodeInfo === void 0 ? void 0 : ccNodeInfo.allowAdd) !== null && _g !== void 0 ? _g : true,
                    value: (_h = ccNodeInfo === null || ccNodeInfo === void 0 ? void 0 : ccNodeInfo.value) !== null && _h !== void 0 ? _h : [],
                    required: (_j = ccNodeInfo === null || ccNodeInfo === void 0 ? void 0 : ccNodeInfo.required) !== null && _j !== void 0 ? _j : false,
                    depth: (_k = ccNodeInfo === null || ccNodeInfo === void 0 ? void 0 : ccNodeInfo.depth) !== null && _k !== void 0 ? _k : 1,
                };
                break;
            default:
                break;
        }
        //注册根节点传入的回调函数 ，调用方法为 只传入一个Function，用默认的cb调用，否则用用他的key作为函数的函数名
        for (var key in this.root.callbacks) {
            //在原型链上或自身已存在属性不进行修改
            if (key in this)
                return;
            Object.defineProperty(this, key, {
                value: this.root.callbacks[key].bind(this),
            });
        }
    }
    Object.defineProperty(FlowSchemeNode.prototype, "parentNodes", {
        get: function () {
            return this.parent instanceof FlowSchemeDefinition ? this.parent.nodes : this.parent.subNodes;
        },
        enumerable: false,
        configurable: true
    });
    //移除节点 node.remove()
    FlowSchemeNode.prototype.remove = function () {
        var index = this.parentNodes.indexOf(this);
        var node;
        if (index > -1) {
            node = this.parentNodes.splice(index, 1)[0];
            //估计也没必要清除父节点的引用吧
            // this.parent = null;
        }
        return node;
    };
    FlowSchemeNode.prototype.getBranch = function (i) {
        var defaultErr = {
            add: function () {
                throw new Error('请先挂载实例到flowSchemeDefinition上，再进行添加');
            },
        };
        if (!this.branchNodeInfos)
            return defaultErr;
        var branch = this.branchNodeInfos[i];
        return branch || defaultErr;
    };
    FlowSchemeNode.nid = 0;
    return FlowSchemeNode;
}());
var FlowSchemeDefinition = /** @class */ (function () {
    function FlowSchemeDefinition(nodes, cbs) {
        this._nodes = [];
        nodes && this.initNodes(nodes);
        //初始化 配置项 ：node.edit 回调
        if (cbs) {
            this.callbacks = typeof cbs === 'function' ? { editCallback: cbs } : cbs;
        }
        else {
            this.callbacks = { cb: function () { } };
        }
    }
    Object.defineProperty(FlowSchemeDefinition.prototype, "nodes", {
        get: function () {
            return this._nodes;
        },
        set: function (value) {
            console.warn('禁止修改nodes的引用，但可以修改nodes的内容', value);
        },
        enumerable: false,
        configurable: true
    });
    FlowSchemeDefinition.prototype.add = function (nodeOps, index) {
        if (typeof index === 'undefined')
            index = this.nodes.length; //不传index插入最后一位
        var node = new FlowSchemeNode(__assign(__assign({}, nodeOps), { parent: this }));
        this.nodes.splice(index, 0, node);
        // //如果是分支类型，在添加完parentNodes之后需要进行init操作
        // if (node.nodeType === NodeType.分支 && !node.branchNodeInfos?.length) {
        //   node.initBranch();
        // }
        return node;
    };
    FlowSchemeDefinition.prototype.initNodes = function (nodes) {
        var _this = this;
        nodes.forEach(function (node) {
            _this.add(node);
        });
    };
    // 适用于最后提交到后台
    FlowSchemeDefinition.prototype.stringify = function () { };
    return FlowSchemeDefinition;
}());
export { NodeType, VerifyMethod, UserChooseType, FlowSchemeNode, FlowSchemeDefinition };
export default FlowSchemeDefinition;
//# sourceMappingURL=index.js.map