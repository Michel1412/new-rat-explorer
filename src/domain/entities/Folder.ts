import { File } from "./File";

export class Folder {

  constructor(
    public name: string,
    public path: string,
    public leafs: Map<string, Folder | File> = new Map()
  ) {}
  
}
