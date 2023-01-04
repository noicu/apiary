//验证文件名是否合法
export const isFileName = (fileName: string) => !(/[\\\\/:*?\"<>|]/.test(fileName));
