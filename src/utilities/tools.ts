export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


export function itemToTree(item: Array<ApiaryGroup | ApiaryRequest>) {
  const tree: ApiaryConfigTree[] = [];

  item.forEach((item) => {
    if ('request' in item) {
      tree.push({
        _key: uuid(),
        label: item.name,
        type: 'request',
        method: item.request.method,
        description: item.description,
        children: [],
      });
    } else if ('children' in item) {
      tree.push({
        _key: uuid(),
        label: item.name,
        type: 'group',
        description: item.description,
        children: itemToTree(item.children),
      });
    }
  });
  return tree;
}

export function collectionToTree(collection: ApiaryConfig[]) {
  const tree: ApiaryConfigTree[] = [];
  collection.forEach((item) => {
    tree.push({
      _key: uuid(),
      label: item.name,
      type: 'collection',
      children: itemToTree(item.children),
    });
  });
  return tree;
}

// 展平树
export function flattenTree(tree: ApiaryConfigTree[]) {
  let flat: ApiaryConfigTree[] = [];
  tree.forEach((item) => {
    flat.push(item);
    if (item.children.length > 0) {
      flat = flat.concat(flattenTree(item.children));
    }
  });
  return flat;
}
