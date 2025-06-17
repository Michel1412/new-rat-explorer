
import { File } from "../../domain/entities/File";
import { Folder } from "../../domain/entities/Folder";
import { NodeType } from "../../domain/shared/enums/type-node.enum";

export class FolderAdapter {

    static reviveFolder(obj: any): Folder {
        const folder = new Folder(obj.name, obj.path);
        const listMap: [string, File | Folder][] = Object.entries(obj.leafs || new Map()) as [string, File | Folder][];

        for (let [key, value] of listMap) {
            if ((value as { type: NodeType }).type === NodeType.FILE) {
                value = value as File;
                // É um arquivo
                folder.getLeafs().set(key, new File(value.name, value.path, value.extension));
            } else {
                // É uma pasta
                folder.getLeafs().set(key, FolderAdapter.reviveFolder(value));
            }
        }

        return folder;
    }
    
    static serializeFolder(folder: Folder): any {
        const serializedLeafs: { [key: string]: any } = {};
        
        for (const [key, value] of folder.getLeafs()) {
            if (value instanceof File) {
                // Serializa arquivo
                serializedLeafs[key] = {
                    name: value.name,
                    path: value.path,
                    extension: value.extension,
                    type: NodeType.FILE
                };
            } else if (value instanceof Folder) {
                // Serializa pasta recursivamente
                serializedLeafs[key] = {
                    ...this.serializeFolder(value),
                    type: NodeType.FOLDER
                };
            }
        }

        return {
            name: folder.name,
            path: folder.path,
            leafs: serializedLeafs
        };
    }
}