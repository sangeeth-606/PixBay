import prisma from '../db.js'

export const createSprint = async (req, res) => {
  try {
    const { name, goal, startDate, endDate, projectId } = req.body;
    const { emailAddresses } = req.auth;
    const email = emailAddresses?.[0]?.emailAddress;

    if (!email) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!name || !projectId) {
      return res.status(400).json({ error: "Name and project ID are required" });
    }

    // Find user by email
    const user = await prisma.user.findFirst({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify project exists and user has access
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { workspace: { include: { members: true } } },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Extract workspace ID from project
    const workspaceId = project.workspaceId;

    // Check if user is a member of the workspace
    const workspaceMember = await prisma.workspaceMember.findUnique({
      where: { 
        workspaceId_userId: { 
          workspaceId, 
          userId: user.id 
        } 
      },
    });

    if (!workspaceMember) {
      return res.status(403).json({ error: 'User is not a member of this workspace' });
    }

    const sprint = await prisma.sprint.create({
      data: {
        name,
        goal,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        project: { connect: { id: projectId } },
        owner: { connect: { id: user.id } },
      },
    });

    res.status(201).json(sprint);
  } catch (error) {
    console.error("Create sprint error:", error);
    res.status(500).json({ error: "Failed to create sprint" });
  }
};

// Get a single sprint
// controllers/sprintController.js
export const getSprint = async (req, res) => {
  try {
    const { sprintId } = req.params;

    const sprint = await prisma.sprint.findUnique({
      where: { id: sprintId },
      include: {
        project: { select: { id: true, key: true } },
        owner: { select: { id: true, name: true } },
        tasks: {
          select: {
            id: true,
            title: true,
            type: true,
            status: true,
            priority: true,
            storyPoints: true,
            assignee: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!sprint) {
      return res.status(404).json({ error: "Sprint not found" });
    }

    res.status(200).json(sprint);
  } catch (error) {
    console.error("Get sprint error:", error);
    res.status(500).json({ error: "Failed to fetch sprint" });
  }
};

// Get all sprints for a project or workspace
export const getAllSprints = async (req, res) => {
  try {
    // const { workspaceName } = req.params;
    const workspaceName = req.params.workspaceId;


    if (!workspaceName) {
      return res.status(400).json({ error: 'Workspace name is required' });
    }

    // Find the workspace by name
    const workspace = await prisma.workspace.findFirst({
      where: { name: workspaceName },
      include: {
        projects: {
          select: {
            id: true,
            name: true,
            workspaceId: true,
          }
        }
      }
    });

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    // Verify the user has access to this workspace
    const { emailAddresses } = req.auth;
    const email = emailAddresses?.[0]?.emailAddress;

    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is a workspace member
    const workspaceMember = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: workspace.id, userId: user.id } },
    });

    if (!workspaceMember) {
      return res.status(403).json({ error: 'User is not a member of this workspace' });
    }

    // Get all projects in the workspace
    const projectIds = workspace.projects.map(project => project.id);

    if (projectIds.length === 0) {
      return res.status(200).json([]); // No projects, no sprints
    }

    // Find all sprints in those projects
    const sprints = await prisma.sprint.findMany({
      where: {
        projectId: { in: projectIds },
      },
      include: {
        owner: { select: { id: true, name: true } },
        tasks: { select: { id: true, title: true, status: true } },
        project: { select: { id: true, name: true, key: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    return res.status(200).json(sprints);

  } catch (error) {
    console.error("Get all sprints error:", error);
    return res.status(500).json({ error: 'Failed to fetch sprints' });
  }
};


// Update a sprint
export const updateSprint = async (req, res) => {
  try {
    const { sprintId } = req.params;
    const { name, goal, status, startDate, endDate, progress } = req.body;

    const sprint = await prisma.sprint.findUnique({
      where: { id: sprintId },
    });

    if (!sprint) {
      return res.status(404).json({ error: "Sprint not found" });
    }

    const updatedSprint = await prisma.sprint.update({
      where: { id: sprintId },
      data: {
        name,
        goal,
        status,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        progress,
      },
    });

    res.status(200).json(updatedSprint);
  } catch (error) {
    console.error("Update sprint error:", error);
    res.status(500).json({ error: "Failed to update sprint" });
  }
};

// Delete a sprint
export const deleteSprint = async (req, res) => {
  try {
    const { sprintId } = req.params;

    const sprint = await prisma.sprint.findUnique({
      where: { id: sprintId },
    });

    if (!sprint) {
      return res.status(404).json({ error: "Sprint not found" });
    }

    await prisma.sprint.delete({
      where: { id: sprintId },
    });

    res.status(200).json({ message: "Sprint deleted successfully" });
  } catch (error) {
    console.error("Delete sprint error:", error);
    res.status(500).json({ error: "Failed to delete sprint" });
  }
};