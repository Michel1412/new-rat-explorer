import { Tree } from '../../domain/services/Tree';
import { Folder } from '../../domain/entities/Folder';
import { Result } from '../../domain/shared/Result';

export class DeleteNodeUseCase {
  constructor(private tree: Tree) {}

  async execute(name: string, path: string) {
    if (!name && !path) {
      throw new Error(`[DeleteNodeUseCase] Parametros invalidos para deletar um elemento`);
    }

    const absolutePath = `${path}/${name}`;

    await this.tree.removeNode(absolutePath);

    return this.tree;
  }
}
