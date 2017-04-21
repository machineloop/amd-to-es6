"use strict";

const walk = require("acorn/dist/walk");
const isDefineWithDependencies = require("./isDefineWithDependencies");
const isDefineWithObjectExpression = require("./isDefineWithObjectExpression");
const getDefineCallbackArguments = require("./getDefineCallbackArguments");

module.exports = function (ast) {
    var body = [];
    var prebody = [];
    walk.simple(ast, {
        ImportDeclaration: function (node) {
            prebody.unshift(node);
        },
        CallExpression: function (node) {
            if (isDefineWithDependencies(node)) {
                let define = getDefineCallbackArguments(node);
                if (define.body.type === "BlockStatement") {
                    body = define.body.body;
                } else {
                    body = [{ type: 'ReturnStatement', argument: define.body }];  
                } 
            } else if (isDefineWithObjectExpression(node)) {
                body = [getDefineCallbackArguments(node)];
            }
        }
    });
    return {prebody: prebody, body: body};
};
