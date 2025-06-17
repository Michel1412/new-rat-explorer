export class Path {
  constructor(public readonly value: string) {
    if (!value.startsWith('/')) throw new Error('Path inválido');
  }
}
