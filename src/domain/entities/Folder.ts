import { File } from "./File";

export class Folder {

  public readonly leafs: Map<string, Folder | File> = new Map();

  constructor(
    public name: string,
    public path: string
  ) {}
  
}
