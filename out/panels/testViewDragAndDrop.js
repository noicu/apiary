"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestViewDragAndDrop = void 0;
const vscode = require("vscode");
class TestViewDragAndDrop {
    constructor(context) {
        this.dropMimeTypes = ['application/vnd.code.tree.testViewDragAndDrop'];
        this.dragMimeTypes = ['text/uri-list'];
        this._onDidChangeTreeData = new vscode.EventEmitter();
        // We want to use an array as the event type, but the API for this is currently being finalized. Until it's finalized, use any.
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.tree = {
            'a': {
                'aa': {
                    'aaa': {
                        'aaaa': {
                            'aaaaa': {
                                'aaaaaa': {}
                            }
                        }
                    }
                },
                'ab': {}
            },
            'b': {
                'ba': {},
                'bb': {}
            }
        };
        // Keep track of any nodes we create so that we can re-use the same objects.
        this.nodes = {};
        const view = vscode.window.createTreeView('testViewDragAndDrop', { treeDataProvider: this, showCollapseAll: true, canSelectMany: true, dragAndDropController: this });
        context.subscriptions.push(view);
    }
    // Tree data provider 
    getChildren(element) {
        return this._getChildren(element ? element.key : undefined).map(key => this._getNode(key));
    }
    getTreeItem(element) {
        const treeItem = this._getTreeItem(element.key);
        treeItem.id = element.key;
        return treeItem;
    }
    getParent(element) {
        return this._getParent(element.key);
    }
    dispose() {
        // nothing to dispose
    }
    // Drag and drop controller
    handleDrop(target, sources, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const transferItem = sources.get('application/vnd.code.tree.testViewDragAndDrop');
            if (!transferItem) {
                return;
            }
            const treeItems = transferItem.value;
            let roots = this._getLocalRoots(treeItems);
            // Remove nodes that are already target's parent nodes
            roots = roots.filter(r => !this._isChild(this._getTreeElement(r.key), target));
            if (roots.length > 0) {
                // Reload parents of the moving elements
                const parents = roots.map(r => this.getParent(r));
                roots.forEach(r => this._reparentNode(r, target));
                this._onDidChangeTreeData.fire([...parents, target]);
            }
        });
    }
    handleDrag(source, treeDataTransfer, token) {
        return __awaiter(this, void 0, void 0, function* () {
            treeDataTransfer.set('application/vnd.code.tree.testViewDragAndDrop', new vscode.DataTransferItem(source));
        });
    }
    // Helper methods
    _isChild(node, child) {
        if (!child) {
            return false;
        }
        for (const prop in node) {
            if (prop === child.key) {
                return true;
            }
            else {
                const isChild = this._isChild(node[prop], child);
                if (isChild) {
                    return isChild;
                }
            }
        }
        return false;
    }
    // From the given nodes, filter out all nodes who's parent is already in the the array of Nodes.
    _getLocalRoots(nodes) {
        const localRoots = [];
        for (let i = 0; i < nodes.length; i++) {
            const parent = this.getParent(nodes[i]);
            if (parent) {
                const isInList = nodes.find(n => n.key === parent.key);
                if (isInList === undefined) {
                    localRoots.push(nodes[i]);
                }
            }
            else {
                localRoots.push(nodes[i]);
            }
        }
        return localRoots;
    }
    // Remove node from current position and add node to new target element
    _reparentNode(node, target) {
        const element = {};
        element[node.key] = this._getTreeElement(node.key);
        const elementCopy = Object.assign({}, element);
        this._removeNode(node);
        const targetElement = this._getTreeElement(target === null || target === void 0 ? void 0 : target.key);
        if (Object.keys(element).length === 0) {
            targetElement[node.key] = {};
        }
        else {
            Object.assign(targetElement, elementCopy);
        }
    }
    // Remove node from tree
    _removeNode(element, tree) {
        const subTree = tree ? tree : this.tree;
        for (const prop in subTree) {
            if (prop === element.key) {
                const parent = this.getParent(element);
                if (parent) {
                    const parentObject = this._getTreeElement(parent.key);
                    delete parentObject[prop];
                }
                else {
                    delete this.tree[prop];
                }
            }
            else {
                this._removeNode(element, subTree[prop]);
            }
        }
    }
    _getChildren(key) {
        if (!key) {
            return Object.keys(this.tree);
        }
        const treeElement = this._getTreeElement(key);
        if (treeElement) {
            return Object.keys(treeElement);
        }
        return [];
    }
    _getTreeItem(key) {
        const treeElement = this._getTreeElement(key);
        // 如何在树项工具提示的 MarkdownString 中使用 codicons 的示例。
        const tooltip = new vscode.MarkdownString(`$(zap) Tooltip for ${key}`, true);
        return {
            // highlights = 标签中要突出显示的范围。 范围定义为两个数字的元组，其中第一个是包含开始索引，第二个是排他结束索引
            label: /**vscode.TreeItemLabel**/ { label: key, highlights: key.length > 1 ? [[key.length - 2, key.length - 1]] : void 0 },
            tooltip,
            collapsibleState: treeElement && Object.keys(treeElement).length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
            resourceUri: vscode.Uri.parse(`/tmp/${key}`),
            description: `123`
        };
    }
    _getTreeElement(element, tree) {
        if (!element) {
            return this.tree;
        }
        const currentNode = tree !== null && tree !== void 0 ? tree : this.tree;
        for (const prop in currentNode) {
            if (prop === element) {
                return currentNode[prop];
            }
            else {
                const treeElement = this._getTreeElement(element, currentNode[prop]);
                if (treeElement) {
                    return treeElement;
                }
            }
        }
    }
    _getParent(element, parent, tree) {
        const currentNode = tree !== null && tree !== void 0 ? tree : this.tree;
        for (const prop in currentNode) {
            if (prop === element && parent) {
                return this._getNode(parent);
            }
            else {
                const parent = this._getParent(element, prop, currentNode[prop]);
                if (parent) {
                    return parent;
                }
            }
        }
    }
    _getNode(key) {
        if (!this.nodes[key]) {
            this.nodes[key] = new Key(key);
        }
        return this.nodes[key];
    }
}
exports.TestViewDragAndDrop = TestViewDragAndDrop;
class Key {
    constructor(key) {
        this.key = key;
    }
}
//# sourceMappingURL=testViewDragAndDrop.js.map