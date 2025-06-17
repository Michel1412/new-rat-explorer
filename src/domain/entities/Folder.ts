export class Folder {

  public readonly leafs: Map<string, Folder | import('./File').File> = new Map();

  constructor(
    public readonly name: string,
    public readonly path: string
  ) {}
  
}
