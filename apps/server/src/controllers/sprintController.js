

import prisma from '../db.js';

export const getSprint = async (req, res) => {
  try {
    const { sprintId } = req.params;

    const sprint = await prisma.sprint.findUnique({
      where: { id: sprintId },
      include: {
        project: { select: { id: true, key: true, name: true } },
        owner: { select: { id: true, name: true } },
        tasks: {
          include: {
            assignee: { select: { id: true, name: true } },
            tags: true,
            parent: { select: { id: true, title: true } },
            subtasks: {
              include: {
                assignee: { select: { id: true, name: true } },
                tags: true,
                parent: { select: { id: true, title: true } },
                subtasks: true // Nested subtasks for hierarchy
              }
            }
          }
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

// Other existing controller functions remain unchanged
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

    const user = await prisma.user.findFirst({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { workspace: { include: { members: true } } },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const workspaceId = project.workspaceId;
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

export const getAllSprints = async (req, res) => {
  try {
    const workspaceName = req.params.workspaceId;

    if (!workspaceName) {
      return res.status(400).json({ error: 'Workspace name is required' });
    }

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

    const { emailAddresses } = req.auth;
    const email = emailAddresses?.[0]?.emailAddress;

    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const workspaceMember = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: workspace.id, userId: user.id } },
    });

    if (!workspaceMember) {
      return res.status(403).json({ error: 'User is not a member of this workspace' });
    }

    const projectIds = workspace.projects.map(project => project.id);

    if (projectIds.length === 0) {
      return res.status(200).json([]);
    }

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


export const createTask = async (req, res) => {
  try {
    const { title, description, type, status, priority, storyPoints, dueDate, projectId, sprintId, assigneeId } = req.body;
    const { emailAddresses } = req.auth;
    const email = emailAddresses?.[0]?.emailAddress;

    if (!email) return res.status(401).json({ error: "Authentication required" });
    if (!title || !projectId) return res.status(400).json({ error: "Title and project ID are required" });

    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { workspace: { include: { members: true } } },
    });
    if (!project) return res.status(404).json({ error: "Project not found" });

    const workspaceMember = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: project.workspaceId, userId: user.id } },
    });
    if (!workspaceMember) return res.status(403).json({ error: "User is not a member of this workspace" });

    const taskData = {
      title,
      description,
      type: type || "TASK",
      status: status || "TODO",
      priority: priority || "MEDIUM",
      storyPoints: storyPoints ? parseInt(storyPoints) : null,
      dueDate: dueDate ? new Date(dueDate) : null,
      project: { connect: { id: projectId } },
      creator: { connect: { id: user.id } },
    };

    if (sprintId) taskData.sprint = { connect: { id: sprintId } };
    if (assigneeId) taskData.assignee = { connect: { id: assigneeId } };

    const task = await prisma.task.create({ data: taskData });
    res.status(201).json(task);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
};