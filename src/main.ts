import { CreateFileUseCase } from './application/use-cases/CreateFileUseCase';
import { FileSystemStorage } from './infrastructure/storage/FileSystemStorage';
import { PromptService } from './infrastructure/cli/PromptService';
import * as readline from 'readline';

const storage = new FileSystemStorage();
const tree = storage.load();
const createFile = new CreateFileUseCase(tree);

console.log('Bem-vindo ao New Rat Explorer!');

function mainMenu() {
  console.log('\nMenu Principal:');
  console.log('1 - Listar raiz');
  console.log('2 - Criar arquivo');
  console.log('3 - Sair');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Escolha uma opção: ', (answer: string) => {
    switch (answer.trim()) {
      case '1':
        PromptService.printFolder(tree.getRoot());

        rl.close();
        mainMenu();
        break;
      case '2':
        rl.question('Nome do arquivo: ', (name: string) => {
          rl.question('Caminho (ex: /): ', (path: string) => {
            rl.question('Extensão: ', async (ext: string) => {
              const newTree = await createFile.execute(name, path, ext);

              console.log(`[main] tree: ${JSON.stringify(newTree)}`);
              storage.save(newTree);
              console.log('Arquivo criado!');
  
              rl.close();
              mainMenu();
            });
          });
        });
        break;
      case '3':
        rl.close();
        console.log('Saindo...');
        process.exit(0);
        break;
      default:
        console.log('Opção inválida.');
              
        rl.close();
        mainMenu();
    }
  });
}

mainMenu();