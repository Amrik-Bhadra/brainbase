import { AppDataSource } from "../data-source";
import { Note } from "../models/Notes";
import { Workspace } from "../models/Workspace";
import { CreateNoteDto } from "../dtos/CreateNote.dto";

export class NoteService {
    private noteRepo = AppDataSource.getRepository(Note);
    private workspaceRepo = AppDataSource.getRepository(Workspace);

    async createNote(userId: string, data: CreateNoteDto): Promise<Note>{
        // verify workspace exists and belongs to the user
        const workspace = await this.workspaceRepo.findOne({
            where: { id: data.workspaceId, ownerId: userId }
        });

        if(!workspace){
            throw new Error("Workspace not found or access denied");
        }

        const note = this.noteRepo.create({
            title: data.title,
            content: data.content,
            tags: data.tags,
            workspaceId: data.workspaceId
        });

        return await this.noteRepo.save(note);
    }


    async getNotesByWorkspace(userId: string, workspaceId: string): Promise<Note[]> {
        // Verify access again (Security!)
        const workspace = await this.workspaceRepo.findOne({
            where: { id: workspaceId, ownerId: userId }
        });

        if (!workspace) {
            throw new Error("Workspace not found or access denied");
        }

        // Fetch notes
        return await this.noteRepo.find({
            where: { workspaceId },
            order: { updatedAt: "DESC" }
        });
    }
}