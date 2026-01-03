export interface CreateNoteDto {
    title: string;
    content?: string;
    tags?: string[];
    workspaceId: string;
}