import { Tree } from '../../domain/services/Tree';
import { File } from '../../domain/entities/File';

export class CreateFileUseCase {

  constructor(
    private tree: Tree
  ) {}

  async execute(name: string, path: string, extension: string) {
    if (!name && !path && extension) {
      throw new Error(`[CreateFileUseCase] Parametros invalidos para Criar um Arquivo`);
    }

    await this.tree.addFile(path, new File(name, path, extension));

    return this.tree;
  }
}
