import { Tree } from '../../domain/services/Tree';
import { File } from '../../domain/entities/File';
import { Result } from '../../domain/shared/Result';

export class CreateFileUseCase {

  constructor(
    private tree: Tree
  ) {}

  async execute(name: string, path: string, extension: string) {
    if (!name && !path && extension) {
      throw new Error(`[CreateFileUseCase] Parametros invalidos para Criar um Arquivo`);
    }

    const isSaved = await this.tree.addFile(path, new File(name, path, extension));

    console.log(`[CreateFileUseCase] execute: ${JSON.stringify(this.tree)}`);
    console.log(`[CreateFileUseCase] isSaved: ${JSON.stringify(isSaved)}`);
    return this.tree;
  }
}
