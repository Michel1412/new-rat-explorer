import { Tree } from '../../domain/services/Tree';
import { File } from '../../domain/entities/File';
import { Result } from '../../domain/shared/Result';

export class CreateFileUseCase {

  constructor(
    private tree: Tree
  ) {}

  execute(name: string, path: string, extension: string) {
    const file = new File(name, path, extension);
    // Aqui você pode adicionar lógica para inserir na árvore
    // Exemplo: this.tree.addFile(file)
    return Result.ok(file);
  }
}
