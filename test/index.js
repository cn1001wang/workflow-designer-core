"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NodeType;
(function (NodeType) {
    NodeType[NodeType["A"] = 0] = "A";
    NodeType[NodeType["B"] = 1] = "B";
    NodeType[NodeType["C"] = 2] = "C";
})(NodeType || (NodeType = {}));
var Dog = /** @class */ (function () {
    function Dog(dog) {
        console.log(dog);
        this.type = dog.type;
        switch (this.type) {
            case NodeType.A:
                this.AInfo = { value: "A" };
                break;
            case NodeType.B:
                this.BInfo = { data: 23 };
                break;
        }
    }
    Dog.prototype.say = function () {
        console.log("say");
    };
    return Dog;
}());
exports.default = Dog;
//# sourceMappingURL=index.js.map