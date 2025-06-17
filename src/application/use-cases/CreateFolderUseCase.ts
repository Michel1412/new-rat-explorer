import { Tree } from '../../domain/services/Tree';
import { Folder } from '../../domain/entities/Folder';
import { Result } from '../../domain/shared/Result';

export class CreateFolderUseCase {
  constructor(private tree: Tree) {}

  execute(name: string, path: string) {
    const folder = new Folder(name, path);
    // Aqui você pode adicionar lógica para inserir na árvore
    // Exemplo: this.tree.addFolder(folder)
    return Result.ok(folder);
  }
}
