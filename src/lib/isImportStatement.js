"use strict";

module.exports = function (node) {
    console.log(node.type);
    return node.type === "ObjectExpression";
};
