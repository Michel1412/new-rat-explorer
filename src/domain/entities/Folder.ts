import { NodeType } from "../shared/enums/type-node.enum";
import { File } from "./File";

export class Folder {

  public readonly type = NodeType.FOLDER;
  public readonly name: string;
  public readonly path: string;

  private leafs: Map<string, File | Folder> = new Map();
  
  constructor(name: string, path: string, leafs?: Map<string, File | Folder>) {
    this.name = name;
    this.path = path;
    this.leafs = leafs ?? new Map();
  }
  
  getLeafs() {
    return this.leafs;
  }

  deleteLeaf(nodeName: string) {
    this.leafs.delete(nodeName);
    console.log(`[Folder - ${this.name}] - Elemento: ${nodeName} removido!`);
  }

}
