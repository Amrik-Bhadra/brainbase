import { Request, Response } from "express";
import { WorkspaceService } from "../services/WorkspaceService";

const workspaceService = new WorkspaceService();

export const createWorkspace = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.userId;
        const workspace = await workspaceService.createWorkspace(userId, req.body);

        res.status(201).json({
            success: true,
            message: "Workspace created successfully",
            data: workspace
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getWorkspaces = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.userId;
        const workspaces = await workspaceService.getWorkspaceByUser(userId);

        res.status(200).json({
            success: true,
            data: workspaces
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};