import { Folder } from '../entities/Folder';
import { File } from '../entities/File';

export class Tree {

  root: Folder;

  constructor() {
    this.root = new Folder('/', '/');
  }

  // Busca um nó (pasta ou arquivo) pelo caminho absoluto
  getNode(path: string): Folder | File | undefined {
    console.log(`[Tree] getRoot: ${JSON.stringify(path)}`);
    if (path === '/' || path === '') 
        return this.root as Folder;

    const parts = path.split('/').filter(Boolean);
    let current: Folder | File = this.root;

    console.log(`[Tree] getRoot: current => ${JSON.stringify(current)}`);
    for (const part of parts) {
      if (current instanceof Folder && current.leafs.has(part)) {
        current = current.leafs.get(part)!;

      } else {
        console.log(`[Tree] getRoot: undefined`);
        return undefined;
      }
    }

    return current;
  }

  // Adiciona uma pasta em um caminho
  addFolder(path: string, folder: Folder): boolean {
    const parent = this.getNode(path);

    if (parent instanceof Folder) {
      parent.leafs.set(folder.name, folder);
      return true;
    }

    return false;
  }

  // Adiciona um arquivo em um caminho
  async addFile(path: string, file: File): Promise<boolean> {
    const parent = this.getNode(path);

    console.log(`[Tree] addFile: ${JSON.stringify(parent)}`);

    if (parent instanceof Folder) {
      console.log(`[Tree] addFile: ${JSON.stringify(parent)}`);
      parent.leafs.set(file.name, file);
      return true;
    }

    return false;
  }

  // Remove um nó pelo caminho
  removeNode(path: string): boolean {
    const parts = path.split('/').filter(Boolean);

    if (parts.length === 0) 
        return false;

    const name = parts.pop()!;
    const parentPath = '/' + parts.join('/');
    const parent = this.getNode(parentPath);

    if (parent instanceof Folder && parent.leafs.has(name)) {
      parent.leafs.delete(name);
      return true;
    }
    
    return false;
  }

  getRoot(): Folder {
    return this.root;
  }
}