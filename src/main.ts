import { CreateFileUseCase } from './application/use-cases/CreateFileUseCase';
import { FileSystemStorage } from './infrastructure/storage/FileSystemStorage';
import { PromptService } from './infrastructure/cli/PromptService';
import * as readline from 'readline';
import { CreateFolderUseCase } from './application/use-cases/CreateFolderUseCase';
import { DeleteNodeUseCase } from './application/use-cases/DeleteNodeUseCase';

const storage = new FileSystemStorage();
const tree = storage.load();
const createFile = new CreateFileUseCase(tree);
const createFolder = new CreateFolderUseCase(tree);DeleteNodeUseCase
const deleteNode = new DeleteNodeUseCase(tree);

console.log('Bem-vindo ao New Rat Explorer!');

function mainMenu() {
  console.log('\nMenu Principal:');
  console.log('1 - Listar raiz');
  console.log('2 - Criar arquivo');
  console.log('3 - Criar pasta');
  console.log('4 - Deletar pasta/arquivo');
  console.log('5 - Sair');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  }); 

  rl.question('Escolha uma opção: ', (answer: string) => {
    switch (answer.trim()) {
      case '1':
        const tree = storage.load();
        PromptService.printFolder(tree.getRoot());

        rl.close();
        mainMenu();
        break;
      case '2':
        rl.question('Nome do arquivo: ', (name: string) => {
          rl.question('Caminho (ex: /): ', (path: string) => {
            rl.question('Extensão: ', async (ext: string) => {
              const newTree = await createFile.execute(name, path, ext);

              storage.save(newTree);
              console.log('Arquivo criado!');
  
              rl.close();
              mainMenu();
            });
          });
        });
        break;
      case '3':
        rl.question('Nome da pasta: ', (name: string) => {
          rl.question('Caminho (ex: /): ', async (path: string) => {
            const newTree = await createFolder.execute(name, path);

            storage.save(newTree);
            console.log('Pasta criada!');

            rl.close();
            mainMenu();
          });
        });
        break;
      case '4':
        PromptService.printFolder(storage.load().getRoot());

        rl.question('Nome da pasta/arquivo: ', (name: string) => {
          rl.question('Caminho (ex: /): ', async (path: string) => {
            const newTree = await deleteNode.execute(name, path);

            storage.save(newTree);
            console.log('Pasta/Arquivo deletado!');

            rl.close();
            mainMenu();
          });
        });
        break;
      case '5':
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