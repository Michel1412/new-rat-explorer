import { CreateFileUseCase } from './application/use-cases/CreateFileUseCase';
import { FileSystemStorage } from './infrastructure/storage/FileSystemStorage';
import { PromptServiceOld } from './infrastructure/cli/PromptServiceOld';
import * as readline from 'readline';
import { CreateFolderUseCase } from './application/use-cases/CreateFolderUseCase';
import { DeleteNodeUseCase } from './application/use-cases/DeleteNodeUseCase';
import { AsciiArt } from './infrastructure/cli/AsciiArt';

const storage = new FileSystemStorage();
const tree = storage.load();
const createFile = new CreateFileUseCase(tree);
const createFolder = new CreateFolderUseCase(tree);
const deleteNode = new DeleteNodeUseCase(tree);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false 
});

const promptService = new PromptServiceOld(rl);

async function mainMenu() {
  console.clear();
  AsciiArt.printRat();
  console.log('Menu Principal:');
  console.log('1 - Abrir pasta raiz (navegacao)');
  console.log('2 - Criar arquivo');
  console.log('3 - Criar pasta');
  console.log('4 - Deletar pasta/arquivo');
  console.log('0 - Sair');

  const answer = await new Promise<string>(resolve => {
    rl.question('Escolha uma opção: ', resolve);
  });

  switch (answer.trim()) {
    case '1':
      const currentTree = storage.load();
      await PromptServiceOld.navigateFolder(currentTree.getRoot());
      mainMenu();
      break;

    case '2':
      const name = await new Promise<string>(resolve => {
        rl.question('Nome do arquivo: ', resolve);
      });
      const path = await new Promise<string>(resolve => {
        rl.question('Caminho (ex: /): ', resolve);
      });
      const ext = await new Promise<string>(resolve => {
        rl.question('Extensão: ', resolve);
      });

      const newTree = await createFile.execute(name, path, ext);
      storage.save(newTree);
      console.log('Arquivo criado!');
      mainMenu();
      break;

    case '3':
      const folderName = await new Promise<string>(resolve => {
        rl.question('Nome da pasta: ', resolve);
      });
      const folderPath = await new Promise<string>(resolve => {
        rl.question('Caminho (ex: /): ', resolve);
      });

      const newFolderTree = await createFolder.execute(folderName, folderPath);
      storage.save(newFolderTree);
      console.log('Pasta criada!');
      mainMenu();
      break;

    case '4':
      PromptServiceOld.printFolder(storage.load().getRoot());
      
      const deleteName = await new Promise<string>(resolve => {
        rl.question('Nome da pasta/arquivo: ', resolve);
      });
      const deletePath = await new Promise<string>(resolve => {
        rl.question('Caminho (ex: /): ', resolve);
      });

      const afterDeleteTree = await deleteNode.execute(deleteName, deletePath);
      storage.save(afterDeleteTree);
      console.log('Pasta/Arquivo deletado!');
      mainMenu();
      break;

    case '0':
      console.log('Saindo...');
      rl.close();
      process.exit(0);
      break;

    default:
      console.log('Opção inválida.');
      mainMenu();
  }
}

mainMenu().catch(error => {
  console.error('Erro:', error);
  rl.close();
  process.exit(1);
});

// Garantir que o readline seja fechado se o programa for interrompido
process.on('SIGINT', () => {
  rl.close();
  process.exit(0);
});