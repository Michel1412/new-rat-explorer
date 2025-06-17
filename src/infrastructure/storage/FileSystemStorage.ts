import { Tree } from '../../domain/services/Tree';
import fs from 'fs';
import path from 'path';

export class FileSystemStorage {

  private filePath: string;

  constructor(storageDir = './storage', fileName = 'tree.json') {
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    this.filePath = path.join(storageDir, fileName);
  }

  save(tree: Tree) {
    fs.writeFileSync(this.filePath, JSON.stringify(tree), 'utf-8');
  }

  load(): Tree {
    if (!fs.existsSync(this.filePath)) {
      return new Tree();
    }

    const data = fs.readFileSync(this.filePath, 'utf-8');
    // Aqui você pode melhorar para desserializar corretamente a árvore
    return Object.assign(new Tree(), JSON.parse(data));
  }
}
