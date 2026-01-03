import { AppDataSource } from "../data-source";
import { Workspace } from "../models/Workspace";
import { CreateWorkspaceDto } from "../dtos/CreateWorkspace.dto";
import { WorkspaceMember, WorkspaceRole } from "../models/WorkspaceMember";
import { User } from "../models/User";
import { AddMemberDto } from "../dtos/AddMember.dto";

export class WorkspaceService {
    private workspaceRepo = AppDataSource.getRepository(Workspace);
    private memberRepo = AppDataSource.getRepository(WorkspaceMember);
    private userRepo = AppDataSource.getRepository(User);

    async createWorkspace(userId: string, data: CreateWorkspaceDto): Promise<Workspace>{
        // create entity instance
        const workspace = this.workspaceRepo.create({
            name: data.name,
            description: data.description,
            ownerId: userId
        });

        const savedWorkspace = await this.workspaceRepo.save(workspace)

        // automatically add the creator as an ADMIN member
        const member = this.memberRepo.create({
            workspaceId: savedWorkspace.id,
            userId: userId,
            role: WorkspaceRole.ADMIN
        });

        await this.memberRepo.save(member);

        return savedWorkspace;
    }

    async getWorkspaceByUser(userId: string): Promise<Workspace[]> {
        //Find where ownerId matches
        return await this.workspaceRepo.find({
            where: { ownerId: userId },
            order: { createdAt: "DESC" }
        });
    }

    async addMember(requesterId: string, workspaceId: string, data: AddMemberDto): Promise<WorkspaceMember> {
        // Permission Check: is requester admin of the workspace
        const requesterMembership = await this.memberRepo.findOne({
            where: { userId: requesterId, workspaceId: workspaceId }
        });

        if(!requesterMembership || requesterMembership.role !== WorkspaceRole.ADMIN){
            throw new Error("Only Admins can invite new members")
        }

        // find the user to invite
        const userToInvite = await this.userRepo.findOneBy({ email: data.email });
        if(!userToInvite){
            throw new Error("User with this email does not exist");
        }

        // check duplicate
        const existingMember = await this.memberRepo.findOne({
            where: { userId: userToInvite.id, workspaceId: workspaceId }
        });
        if(existingMember){
            throw new Error("User is already a member of this workspace");
        }

        // Add member
        const newMember = this.memberRepo.create({
            workspaceId,
            userId: userToInvite.id,
            role: data.role
        });

        return await this.memberRepo.save(newMember);
    }
}