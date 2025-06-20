import { Tree } from '../../domain/services/Tree';
import { Folder } from '../../domain/entities/Folder';
import { Result } from '../../domain/shared/Result';

export class CreateFolderUseCase {
  constructor(private tree: Tree) {}

  async execute(name: string, path: string) {
    if (!name && !path) {
      throw new Error(`[CreateFolderUseCase] Parametros invalidos para Criar uma Pasta`);
    }

    await this.tree.addFolder(path, new Folder(name, path));

    return this.tree;
  }
}
