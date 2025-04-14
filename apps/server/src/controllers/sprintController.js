import prisma from '../db.js'

export const createSprint = async (req, res) => {
  try {
    const { name, goal, startDate, endDate, projectId } = req.body;
    const {emailAddresses}= req.auth 
    const email = emailAddresses?.[0]?.emailAddress;

    if (!name || !projectId) {
      return res.status(400).json({ error: "Name and project ID are required" });
    }

    // Verify project exists and user has access
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { workspace: { include: { members: true } } },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if user is a member of the workspace
    // const isMember = project.workspace.members.some(
    //   (member) => member.userId === userId
    // );
    // if (!isMember) {
    //   return res.status(403).json({ error: "Unauthorized to create sprint in this project" });
    // }
    const workspaceMember = await prisma.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId, userId: user.id } },
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
        owner: { connect: { id: userId } },
      },
    });

    res.status(201).json(sprint);
  } catch (error) {
    console.error("Create sprint error:", error);
    res.status(500).json({ error: "Failed to create sprint" });
  }
};

// Get a single sprint
export const getSprint = async (req, res) => {
  try {
    const { sprintId } = req.params;

    const sprint = await prisma.sprint.findUnique({
      where: { id: sprintId },
      include: {
        project: true,
        owner: true,
        tasks: { select: { id: true, title: true, status: true } },
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

// Get all sprints for a project
export const getAllSprints = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const sprints = await prisma.sprint.findMany({
      where: { projectId },
      include: {
        owner: { select: { id: true, name: true } },
        tasks: { select: { id: true, title: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(sprints);
  } catch (error) {
    console.error("Get all sprints error:", error);
    res.status(500).json({ error: "Failed to fetch sprints" });
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