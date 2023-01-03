import * as vscode from 'vscode';
import { ExtensionContext } from 'vscode';
import * as path from 'path';
import { createApiaryFile, getApiaryFile, getApiaryFileList, getApiaryPath, initApiaryFolder } from './workspace';
import { readFile, stat } from '../utilities/fs';

export class SideItem extends vscode.TreeItem {
  constructor(item: HistoryItem) {
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

export class SideProvider implements vscode.TreeDataProvider<HistoryItem> {
  context: ExtensionContext;
  static instance: SideProvider;

  constructor(context: ExtensionContext) {
    this.context = context;
    return SideProvider.instance || (SideProvider.instance = this);
  }

  readonly _onDidChangeTreeData = new vscode.EventEmitter<HistoryItem | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  getTreeItem(item: HistoryItem) {

    // 创建工作区文件夹
    // 创建项目文件
    // 更新项目文件
    // 删除项目文件
    // 读取项目文件


    // 工作区文件夹
    vscode.workspace.workspaceFolders?.forEach(async (wf) => {
      // .apiary文件夹路径
      const APIARY_PATH = getApiaryPath(wf);

      try {
        // 读取.apiary文件夹下的文件
        await stat(APIARY_PATH);

        // 读取文件内容
         const APIARY_DIRECTORY = await getApiaryFileList(wf);
        for (const uri of APIARY_DIRECTORY) {
          const file = await getApiaryFile(uri);

          console.log(file.name, 'context');
        }

      } catch (error) {
        const item = await vscode.window.showWarningMessage('apiary 工作目录不存在', '创建目录', '取消');

        if (item === '创建目录') {
          // 初始化工作区文件夹
          await initApiaryFolder(wf);
        }
      }
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
    ] as any;
    // return SideProvider.getHistory()
    //   .map(item => JSON.parse(item))
    //   .sort((a, b) => b.createTime - a.createTime);
  }

  static historyKey = 'vscPostman.history';

  static getHistory(): string[] {
    return vscode.workspace.getConfiguration().get(this.historyKey)!;
  }

  static updateHistory(history: string[]) {
    return this.refresh(() => vscode.workspace.getConfiguration().update(this.historyKey, history, true));
  }

  static deleteHistoryItem(time: number) {
    const newHistory = this.getHistory()
      .filter(item => !item.includes(`${time}`));
    this.updateHistory(newHistory);
  }

  static async refresh(action?: () => void) {
    if (action) { await action(); };

    this.instance._onDidChangeTreeData.fire();
  }
}
