import { AppDataSource } from "../data-source";
import { Workspace } from "../models/Workspace";
import { CreateWorkspaceDto } from "../dtos/CreateWorkspace.dto";

export class WorkspaceService {
    private workspaceRepo = AppDataSource.getRepository(Workspace);

    async createWorkspace(userId: string, data: CreateWorkspaceDto): Promise<Workspace>{
        // create entity instance
        const workspace = this.workspaceRepo.create({
            name: data.name,
            description: data.description,
            ownerId: userId
        });

        return await this.workspaceRepo.save(workspace);
    }

    async getWorkspaceByUser(userId: string): Promise<Workspace[]> {
        //Find where ownerId matches
        return await this.workspaceRepo.find({
            where: { ownerId: userId },
            order: { createdAt: "DESC" }
        });
    }
}