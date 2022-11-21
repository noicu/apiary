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
exports.SideProvider = exports.SideItem = void 0;
const vscode = require("vscode");
const path = require("path");
class SideItem extends vscode.TreeItem {
    constructor(item) {
        const { method, name, createTime, url } = item;
        super({
            label: `$(trash) ${name}`,
        });
        this.id = `${createTime}`;
        this.tooltip = `${method} ${url}`;
        // this.description = `${createTime}`;
        this.description = true;
        this.command = {
            title: '查看',
            command: 'vscPostmanHistory.click',
            arguments: [item],
        };
    }
}
exports.SideItem = SideItem;
class SideProvider {
    constructor(context) {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.context = context;
        return SideProvider.instance || (SideProvider.instance = this);
    }
    getTreeItem(item) {
        var _a;
        // 工作区文件夹
        (_a = vscode.workspace.workspaceFolders) === null || _a === void 0 ? void 0 : _a.forEach(folder => {
            vscode.workspace.fs.stat(folder.uri.with({ path: path.join(folder.uri.path, '.apiary') })).then(stat => {
                // 存在.apiary才会执行
                console.log(!!stat);
                vscode.workspace.fs.writeFile(folder.uri.with({ path: path.join(folder.uri.path, '.apiary', 'postman.json') }), Buffer.from(JSON.stringify(item)));
            });
        });
        // vscode.workspace.findFiles('**/.apiary/**').then((res) => {
        //   console.log(res,'context');
        // });
        // vscode.workspace.workspaceFolders?.forEach((item) => {
        //   console.log(item,'context');
        // });
        console.log(vscode.workspace.fs.writeFile, 'context');
        const Side = new SideItem(item);
        Side.iconPath = {
            light: vscode.Uri.file(path.join(this.context.extensionPath, 'assets', 'request', 'propfind.svg')),
            dark: vscode.Uri.file(path.join(this.context.extensionPath, 'assets', 'request', 'propfind.svg')),
        };
        Side.resourceUri = vscode.Uri.file(path.join(this.context.extensionPath, 'assets', 'request', 'propfind.svg'));
        return Side;
    }
    getChildren() {
        return [
            {
                "name": "csasca0",
                "method": "GET",
                "url": "acsasca",
                "headers": "{\n\"a\":\"1\"\n}",
                createTime: +new Date(),
            },
            {
                "name": "csasca1",
                "method": "GET",
                "url": "acsasca",
                "headers": "{\n\"a\":\"1\"\n}",
                createTime: +new Date() + 10,
            },
        ];
        // return SideProvider.getHistory()
        //   .map(item => JSON.parse(item))
        //   .sort((a, b) => b.createTime - a.createTime);
    }
    static getHistory() {
        return vscode.workspace.getConfiguration().get(this.historyKey);
    }
    static updateHistory(history) {
        return this.refresh(() => vscode.workspace.getConfiguration().update(this.historyKey, history, true));
    }
    static deleteHistoryItem(time) {
        const newHistory = this.getHistory()
            .filter(item => !item.includes(`${time}`));
        this.updateHistory(newHistory);
    }
    static refresh(action) {
        return __awaiter(this, void 0, void 0, function* () {
            if (action) {
                yield action();
            }
            ;
            this.instance._onDidChangeTreeData.fire();
        });
    }
}
exports.SideProvider = SideProvider;
SideProvider.historyKey = 'vscPostman.history';
//# sourceMappingURL=side.js.map