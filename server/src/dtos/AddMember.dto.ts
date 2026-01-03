import { WorkspaceRole } from "../models/WorkspaceMember";

export interface AddMemberDto {
    email: string;
    role: WorkspaceRole;
}