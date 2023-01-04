import * as vscode from 'vscode';
import * as path from 'path';
import { createDirectory, readDirectory, writeFile, del, readFile } from '../utilities/fs';


export const getApiaryPath = (wf: vscode.WorkspaceFolder, ...arg: string[]) => wf.uri.with({ path: path.join(wf.uri.path, '.apiary', ...arg) });

export const getApiaryCollectionPath = (wf: vscode.WorkspaceFolder, ...arg: string[]) => getApiaryPath(wf, 'collections', ...arg);


/**
 * @description 初始化工作区文件夹
 */
export const initApiaryFolder = async (wf: vscode.WorkspaceFolder) => {
  // .apiary文件夹路径
  const APIARY_PATH = getApiaryPath(wf);

  try {
    // 读取.apiary文件夹状态
    const res = await readDirectory(APIARY_PATH);

    // 如果文件夹存在，直接返回
    return res;
  } catch (error) {
    // 如果目录异常 则 创建目录
    await createDirectory(APIARY_PATH);

    // 读取.apiary文件夹状态
    const res = await readDirectory(APIARY_PATH);

    return res;
  }
};

/**
 * @description 初始化工作区合集文件夹
 */
export const initApiaryCollectionFolder = async (wf: vscode.WorkspaceFolder) => {
  // .apiary文件夹路径
  const APIARY_COLLECTION_PATH = getApiaryCollectionPath(wf);

  try {
    // 读取.apiary文件夹状态
    const res = await readDirectory(APIARY_COLLECTION_PATH);

    // 如果文件夹存在，直接返回
    return res;
  } catch (error) {
    // 如果目录异常 则 创建目录
    await createDirectory(APIARY_COLLECTION_PATH);

    // 读取.apiary文件夹状态
    const res = await readDirectory(APIARY_COLLECTION_PATH);

    return res;
  }
};


/**
 * @description 创建项目文件
 * @param {string} fileName 项目文件名称
 * @param {ApiaryConfig} config 项目描述
 * @param {vscode.WorkspaceFolder} wf 工作区文件夹
 * @returns {Promise<vscode.Uri>}
 * @example
 * const uri = await createApiaryFile('test', 'test', wf);
 * console.log(uri.path, 'uri');
 * // /Users/xxx/xxx/xxx/.apiary/test.json
 */
export const createApiaryFile = async (fileName: string, config: ApiaryConfig, wf: vscode.WorkspaceFolder) => {
  // 文件路径
  const uriPath = getApiaryCollectionPath(wf, fileName + '.json');

  try {
    // 初始化工作区文件夹
    await initApiaryFolder(wf);
    // 初始化合集文件夹
    await initApiaryCollectionFolder(wf);
    // 写入文件
    await writeFile(uriPath, Buffer.from(JSON.stringify(config)));

    return uriPath;
  } catch (error) {
    console.log(error);

    return null;
  }
};


/**
 * @description 更新项目文件
 * @param {string} fileName 项目文件名称
 * @param {ApiaryConfig} config 项目配置
 * @param {vscode.WorkspaceFolder} wf 工作区文件夹
 * @returns {Promise<vscode.Uri>}
 * @example
 * const uri = await updateApiaryFile(config, wf);
 * console.log(uri.path, 'uri');
 * // /Users/xxx/xxx/xxx/.apiary/test.json
 */
export const updateApiaryFile = async (fileName: string, config: ApiaryConfig, wf: vscode.WorkspaceFolder) => createApiaryFile(fileName, config, wf);


/**
 * @description 删除项目文件
 * @param {string} fileName 项目文件名称
 * @param {vscode.WorkspaceFolder} wf 工作区文件夹
 * @returns {Promise<boolean>}
 * @example
 * const res = await deleteApiaryFile('test', wf);
 * console.log(res, 'res');
 * // true
 */
export const deleteApiaryFile = async (fileName: string, wf: vscode.WorkspaceFolder) => {
  const uriPath = getApiaryCollectionPath(wf, fileName + '.json');

  try {
    // 删除文件
    await del(uriPath);

    return true;
  } catch (error) {
    console.log(error);

    return false;
  }
};

/**
 * @description 获取项目文件
 * @param {vscode.Uri} uri 项目文件路径
 * @returns {Promise<ApiaryConfig>}
 * @example
 * const res = await getApiaryFile('test', wf);
 * console.log(res, 'res');
 */
export const getApiaryFile = async (uri: vscode.Uri) => {
  // 读取文件
  const file = await readFile(uri);

  return JSON.parse(file.toString()) as ApiaryConfig;
};


/** 
 * @description 获取项目文件列表
 * @param {vscode.WorkspaceFolder} wf 工作区文件夹
 * @returns {Promise<vscode.Uri[]>}
 * @example
 * const res = await getApiaryFileList(wf);
 * console.log(res, 'res');
 * // [Uri]
 */
export const getApiaryFileList = async (wf: vscode.WorkspaceFolder) => {
  try {
    // 读取文件夹
    const res = await readDirectory(getApiaryCollectionPath(wf));

    return res.map(([name]) => getApiaryCollectionPath(wf, name));

  } catch (error) {
    console.log(error);

    return [];
  }
};
