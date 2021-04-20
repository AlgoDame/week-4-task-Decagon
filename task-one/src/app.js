import FileTree from "./fileTree";

export function createFileTree(input) {
  const fileTree = new FileTree();
  let myInput = [...input];
  let parentObj;
  for (let obj of myInput) {
    if (!obj.parentId) {
      parentObj = obj;
    }
  }
  let mainParentID = parentObj.id;
  let sortedArray = [];
  sortedArray.push(parentObj);
  let childrenArray = myInput.filter((item) => item.parentId !== undefined);
  childrenArray.forEach((child) => {
    let realChild = childrenArray.find(
      (child) => child.parentId == mainParentID
    );
    sortedArray.push(realChild);
    mainParentID = realChild.id;
  });

  for (const inputNode of sortedArray) {
    const parentNode = inputNode.parentId
      ? fileTree.findNodeById(inputNode.parentId)
      : null;

    fileTree.createNode(
      inputNode.id,
      inputNode.name,
      inputNode.type,
      parentNode
    );
  }

  return fileTree;
}
