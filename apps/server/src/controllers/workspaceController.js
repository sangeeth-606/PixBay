import prisma from "../db.js";

export const createWorkspace = async (req, res) => {
  try {
    console.log("createWorkspace called", req.body, req.auth);
    const { name } = req.body;
    const { emailAddresses } = req.auth; // will be getting aftewr clerk middleware check
    const email = emailAddresses?.[0]?.emailAddress;

    if (!name) {
      return res.status(400).json({ error: "Give a Name to Workspace" });
    }
    if (!emailAddresses) {
      return res.status(400).json({ error: "Please sign in again" });
    }
    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return res.status(400).json({ error: "User Not Found " });
    }

    const Workspace = await prisma.workspace.create({
      data: {
        name,
        members: {
          create: {
            userId: user.id,
            role: "ADMIN", // Creator gets ADMIN role
          },
        },
      },
    });
    

    const room = await prisma.room.create({
      data: {
        name,
        ownerId: user.id,
      },
    });

    // Respond with success
    res.status(201).json({ message: "Room created successfully", room });
  } catch (error) {
    console.error("Error creating workspace:", error);
    res.status(500).json({ error: "failed to create workspace" });
  }
};
// to join existing workspace
export const joinWorkspace = async (req, res) => {
  try {
    const { workspaceName } = req.body;
    const { emailAddresses } = req.auth;
    const email = emailAddresses?.[0]?.emailAddress;

    if (!workspaceName) {
      return res.status(400).json({ error: "Workspace name is required" });
    }
    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const workspace = await prisma.workspace.findFirst({
      where: { name: workspaceName },
    });
    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    // / Check if user is already a member
    const existingMember = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: { workspaceId: workspace.id, userId: user.id },
      },
    });

    if (existingMember) {
      return res.status(400).json({ error: "User is already a member" });
    }
    const member = await prisma.workspaceMember.create({
      data: {
        workspaceId: workspace.id, // Use the found workspace’s ID
        userId: user.id,
        role: "MEMBER", // Joiner gets MEMBER role
      },
    });
    res.status(200).json({ message: "Joined workspace successfully", member });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to join workspace" });
  }
};
// Get user's workspaces
export const getUserWorkspaces = async (req, res) => {
  try {
    const { emailAddresses } = req.auth;
    const email = emailAddresses?.[0]?.emailAddress;

    const user = await prisma.user.findFirst({
      where: { email: email },
      include: { workspaces: { include: { workspace: true } } },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(
      user.workspaces.map((wm) => ({
        id: wm.workspace.id,
        name: wm.workspace.name,
        role: wm.role,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch workspaces" });
  }
};
export const workSpaceMembers = async (req, res) => {
  try {
    const { name } = req.params;
    console.log("Workspace name received:", name);

    if (!name) {
      return res.status(400).json({ error: "Workspace name is required" });
    }

    // Find the workspace by name
    const workspace = await prisma.workspace.findFirst({
      where: { name },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        projects: {
          select: {
            id: true,
            name: true,
            key: true,
            status: true,
            progress: true,
          },
        },
      },
    });

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    // Format the response
    const workspaceDetails = {
      id: workspace.id,
      name: workspace.name,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
      members: workspace.members.map((member) => ({
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        role: member.role,
        joinedAt: member.joinedAt,
      })),
      projects: workspace.projects,
      memberCount: workspace.members.length,
      projectCount: workspace.projects.length,
    };

    res.status(200).json(workspaceDetails);
  } catch (error) {
    console.error("Error fetching workspace members:", error);
    res.status(500).json({ error: "Failed to fetch workspace members" });
  }
};

// Get workspace by name
export const getWorkspaceByName = async (req, res) => {
  try {
    const { name } = req.params;
    
    if (!name) {
      return res.status(400).json({ error: "Workspace name is required" });
    }

    // Find the workspace by name
    const workspace = await prisma.workspace.findFirst({
      where: { name },
    });

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    res.status(200).json(workspace);
  } catch (error) {
    console.error("Error fetching workspace:", error);
    res.status(500).json({ error: "Failed to fetch workspace" });
  }
};
