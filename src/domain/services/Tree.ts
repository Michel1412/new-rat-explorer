import { Folder } from '../entities/Folder';
import { File } from '../entities/File';

export class Tree {

  root: Folder;

  constructor() {
    this.root = new Folder('/', '/', new Map());
  }

  // Busca um nó (pasta ou arquivo) pelo caminho absoluto
  async getNode(path: string): Promise<Folder | File | undefined> {
    console.log(`[Tree] getRoot: ${JSON.stringify(path)}`);
    if (path === '/' || path === '') 
        return this.root as Folder;

    const parts = path.split('/').filter(Boolean);
    let current: Folder | File = this.root;

    console.log(`[Tree] getRoot: current => ${JSON.stringify(current)}`);
    for (const part of parts) {
      if (current instanceof Folder && current.getLeafs().has(part)) {
        current = current.getLeafs().get(part)!;

      } else {
        console.log(`[Tree] getRoot: undefined`);
        return undefined;
      }
    }

    return current;
  }

  // Adiciona uma pasta em um caminho
  async addFolder(path: string, folder: Folder): Promise<Folder> {
    const parent: Folder = await this.getNode(path) as Folder;

    if (parent instanceof Folder) {
      parent.getLeafs().set(folder.name, folder);
    }

    return parent;
  }

  // Adiciona um arquivo em um caminho
  async addFile(path: string, file: File): Promise<Folder> {
    const parent: Folder = await this.getNode(path) as Folder;

    if (parent instanceof Folder) {
      parent.getLeafs().set(file.name, file);
    }

    return parent;
  }

  // Remove um nó pelo caminho
  async removeNode(path: string): Promise<boolean> {
    const parts = path.split('/').filter(Boolean);

    if (parts.length === 0) 
        return false;

    const name = parts.pop()!;
    const parentPath = '/' + parts.join('/');
    const parent = await this.getNode(parentPath);

    if (parent instanceof Folder && parent.getLeafs().has(name)) {
      parent.deleteLeaf(name);

      return true;
    }
    
    return false;
  }

  getRoot(): Folder {
    return this.root;
  }
}