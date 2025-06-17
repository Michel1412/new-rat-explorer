import { Tree } from '../../domain/services/Tree';
import fs from 'fs';
import path from 'path';
import { FolderAdapter } from '../../application/adapter/folder.adapter';

export class FileSystemStorage {

  private filePath: string;

  constructor(storageDir = './storage', fileName = 'tree.json') {
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    this.filePath = path.join(storageDir, fileName);
  }

  save(tree: Tree) {
    const serializedTree = {
        root: FolderAdapter.serializeFolder(tree.root)
    };
    
    fs.writeFileSync(this.filePath, JSON.stringify(serializedTree), 'utf-8');
  }

  load(): Tree {
    if (!fs.existsSync(this.filePath)) {
      return new Tree();
    }

    const data = fs.readFileSync(this.filePath, 'utf-8');
    // Aqui você pode melhorar para desserializar corretamente a árvore
    const tree = Object.assign(new Tree(), JSON.parse(data));
    tree.root = FolderAdapter.reviveFolder(tree.root);
    
    return tree;
  }
}
