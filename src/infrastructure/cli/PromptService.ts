import { Folder } from '../../domain/entities/Folder';

export class PromptService {

  static printFolder(folder: Folder) {
    console.log(`Folder: ${folder.name}`);
    console.log(`Path: ${folder.path}`);
    
    console.log('Contents:');

    for (const [name, node] of folder.getLeafs()) {
      if ('extension' in node) {
        console.log(`- ${name}.${node.extension} (file)`);

      } else {
        console.log(`- ${name} (folder)`);
      }
    }
  }
}
