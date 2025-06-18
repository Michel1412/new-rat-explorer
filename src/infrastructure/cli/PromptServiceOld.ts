import { Folder } from '../../domain/entities/Folder';
import { Interface as ReadlineInterface } from 'readline';
import * as readline from 'readline'; 
import { File } from '../../domain/entities/File';
import { NodeType } from '../../domain/shared/enums/type-node.enum';

export class PromptServiceOld {
  private static currentIndex = 0;
  private static items: Array<[string, any]> = [];
  private static rl: ReadlineInterface;
  private static navigationHistory: Folder[] = []; 

  constructor(readline: ReadlineInterface) {
    PromptServiceOld.rl = readline;
  }

  static async navigateFolder(folder: Folder, parentFolder?: Folder): Promise<void> {
    if (!this.rl) {
      throw new Error('PromptService precisa ser inicializado com readline');
    }

    if (parentFolder) {
      this.navigationHistory.push(parentFolder);
    }
    
    this.updateItems(folder);
    this.currentIndex = 0;

    this.rl.pause(); 
    process.stdin.setRawMode(true);
    process.stdin.resume();
    await Promise.resolve(readline.emitKeypressEvents(process.stdin));

    this.renderList(folder);

    return new Promise((resolve) => {
      const keypressListener = async (str: string, key: any) => {
        if (key.name === 'q') {
          console.clear();
          await Promise.resolve(process.stdin.removeListener('keypress', keypressListener));
          
          const previousFolder = this.navigationHistory.pop();
          if (previousFolder) {
            this.updateItems(previousFolder);
            process.stdin.setRawMode(true);
            await this.navigateFolder(previousFolder);
          } else {
            // Se não existe, volta ao menu principal
            process.stdin.setRawMode(false);
            process.stdin.pause();
            this.rl.resume();
            this.navigationHistory = []; // Limpa o histórico
            resolve();
          }
          return;
        }

        switch (key.name) {
          case 'up':
            this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
            break;
          case 'right':
          case 'enter':
            const [name, node] = this.items[this.currentIndex];
            const element = node as Folder | File;

            if (element.type === NodeType.FOLDER) {
              console.clear(); 
              await Promise.resolve(process.stdin.removeListener('keypress', keypressListener));
              await this.navigateFolder(element as Folder);
              
              this.renderList(folder);

            } else {
              console.log(`Nao é possivel abrir arquivos no momento.`);
              console.log(`Arquivo selecionado: ${name}.${(node as File).extension} ...`);
              
              await Promise.resolve(process.stdin.removeListener('keypress', keypressListener));
              await new Promise(timeoutResolve => setTimeout(timeoutResolve, 2000));
              await Promise.resolve(process.stdin.on('keypress', keypressListener));
              this.renderList(folder);
            }

            break;
          case 'down':
            this.currentIndex = (this.currentIndex + 1) % this.items.length;
            break;
        }

        this.renderList(folder);
      };

      process.stdin.on('keypress', keypressListener);
    });
  }

  private static updateItems(folder: Folder): void {
    this.items = Array.from(folder.getLeafs());
  }

  private static renderList(folder: Folder): void {
    console.clear();
    console.log(`Folder: ${folder.name}`);
    console.log(`Path: ${folder.path}\n`);
    console.log('Contents:');

    this.items.forEach(([name, node], index) => {
      const prefix = index === this.currentIndex ? '→ ' : '  ';
      if ('extension' in node) {
        console.log(`${prefix}${name}.${node.extension}`);
      } else {
        console.log(`${prefix}/${name}`);
      }
    });

    console.log('\nUse ↑↓ para navegar, → ou enter para abrir a pasta, Q para voltar ao menu');
  }

  static printFolder(folder: Folder) {
    console.clear();
    console.log(`Pasta: ${folder.name}`);
    console.log(`Caminho: ${folder.path}`);
    
    if (this.navigationHistory.length > 0) {
      console.log('(Q para voltar à pasta anterior)\n');
    }

    console.log('Conteudo:');

    for (const [name, node] of folder.getLeafs()) {
      if ('extension' in node) {
        console.log(`- ${name}.${node.extension}`);
      } else {
        console.log(`- /${name}`);
      }
    }
  }
}