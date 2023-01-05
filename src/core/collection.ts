import * as vscode from 'vscode';
import { stat } from '../utilities/fs';
import { itemToTree, uuid } from "../utilities/tools";
import { onDidChangeCollection } from "./events";
import { getApiaryCollectionPath, getApiaryFile, getApiaryFileList, getApiaryPath, initApiaryCollectionFolder, initApiaryFolder } from "./workspace";

export const collections: ApiaryConfigTree[] = [];


export default collections;

export const getApiaryConfig = async (wf: vscode.WorkspaceFolder) => {
  // 检测步骤
  let steps: string = '';

  // .apiary文件夹路径
  const APIARY_PATH = getApiaryPath(wf);

  const APIARY_COLLECTION_PATH = getApiaryCollectionPath(wf);

  const c: ApiaryConfigTree[] = [];

  try {
    steps = '.apiary';
    // 读取.apiary文件夹下的文件
    await stat(APIARY_PATH);
    steps = 'collections';
    // 读取collection文件夹下的文件
    await stat(APIARY_COLLECTION_PATH);

    // 读取文件内容
    const APIARY_DIRECTORY = await getApiaryFileList(wf);
    // 生成树
    for (const uri of APIARY_DIRECTORY) {
      const file = await getApiaryFile(uri);
      c.push({
        _key: uuid(),
        label: file.name,
        type: "collection",
        description: file.description,
        children: itemToTree(file.children),
      });
    }
  } catch (error) {
    const item = await vscode.window.showWarningMessage(`${wf.name} 文件夹 ${steps} 不存在`, '创建', '取消');

    if (item === '创建') {
      // 初始化工作区文件夹
      await initApiaryFolder(wf);

      // 初始化collection文件夹
      await initApiaryCollectionFolder(wf);
    }
  } finally {
    return c;
  }
};

export const initCollections = async () => {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  let cc: ApiaryConfigTree[] = [];
  if (workspaceFolders) {
    if (workspaceFolders.length > 1) {
      for (const wf of workspaceFolders) {
        const workspace: ApiaryConfigTree = {
          _key: uuid(),
          label: wf.name,
          type: "workspace",
          children: [],
        };

        workspace.children = await getApiaryConfig(wf);

        cc.push(workspace);
      }
    } else {
      cc = await getApiaryConfig(workspaceFolders[0]);
    }

    collections.push(...cc);

    // 更新视图
    onDidChangeCollection.fire(undefined);
  }
};




