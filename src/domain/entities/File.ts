import { NodeType } from "../shared/enums/type-node.enum";

export class File {

  public readonly type = NodeType.FOLDER;

  constructor(
    public readonly name: string,
    public readonly path: string,
    public readonly extension: string
  ) {}
  
}
