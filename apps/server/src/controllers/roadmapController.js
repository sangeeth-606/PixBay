import prisma from "../db.js";

const checkWorkspaceMembership = async (userId, workspaceId) => {
  const workspaceMember = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: { workspaceId, userId }, // Ensure userId is defined
    },
  });
  return !!workspaceMember; // Returns true if the user is a member
};

export const createMilestone = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, startDate, endDate } = req.body;
    const { emailAddresses } = req.auth;
    const email = emailAddresses?.[0]?.emailAddress;

    if (!email) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!title || !projectId) {
      return res
        .status(400)
        .json({ error: "Title and project ID are required" });
    }

    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { workspace: true },
    });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const isMember = await checkWorkspaceMembership(
      user.id,
      project.workspaceId
    );
    if (!isMember) {
      return res
        .status(403)
        .json({ error: "User is not a member of this workspace" });
    }

    const milestone = await prisma.milestone.create({
      data: {
        title,
        description,
        status: status || "UPCOMING",
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        project: { connect: { id: projectId } },
        owner: { connect: { id: user.id } }, // Owner set to authenticated user
      },
    });

    res.status(201).json(milestone);
  } catch (error) {
    console.error("Create milestone error:", error);
    res.status(500).json({ error: "Failed to create milestone" });
  }
};

export const getMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;

    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: {
        project: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true } },
        dependencies: {
          include: { dependsOn: { select: { id: true, title: true } } },
        },
        dependents: {
          include: { milestone: { select: { id: true, title: true } } },
        },
      },
    });

    if (!milestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    res.status(200).json(milestone);
  } catch (error) {
    console.error("Get milestone error:", error);
    res.status(500).json({ error: "Failed to fetch milestone" });
  }
};

export const getMilestonesByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { emailAddresses } = req.auth;
    const email = emailAddresses?.[0]?.emailAddress;

    if (!email) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { workspace: true },
    });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const isMember = await checkWorkspaceMembership(
      user.id,
      project.workspaceId
    );
    if (!isMember) {
      return res
        .status(403)
        .json({ error: "User is not a member of this workspace" });
    }

    const milestones = await prisma.milestone.findMany({
      where: { projectId },
      include: {
        owner: { select: { id: true, name: true } },
        dependencies: {
          include: { dependsOn: { select: { id: true, title: true } } },
        },
        dependents: {
          include: { milestone: { select: { id: true, title: true } } },
        },
      },
    });

    res.status(200).json(milestones);
  } catch (error) {
    console.error("Get milestones error:", error);
    res.status(500).json({ error: "Failed to fetch milestones" });
  }
};

export const getMilestonesByWorkspace = async (req, res) => {
  try {
    const { workspaceName } = req.params;
    const { emailAddresses } = req.auth;
    const email = emailAddresses?.[0]?.emailAddress;

    if (!email) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find workspace by name
    const workspace = await prisma.workspace.findUnique({
      where: { name: workspaceName },
    });

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    // Check if user is a member of the workspace
    const isMember = await checkWorkspaceMembership(user.id, workspace.id);
    if (!isMember) {
      return res
        .status(403)
        .json({ error: "User is not a member of this workspace" });
    }

    // Get all projects in the workspace
    const projects = await prisma.project.findMany({
      where: { workspaceId: workspace.id },
      select: { id: true, name: true, key: true },
    });

    const projectIds = projects.map((project) => project.id);

    // Get all milestones for these projects
    const milestones = await prisma.milestone.findMany({
      where: {
        projectId: { in: projectIds },
      },
      include: {
        project: { select: { id: true, name: true, key: true } },
        owner: { select: { id: true, name: true } },
        dependencies: {
          include: { dependsOn: { select: { id: true, title: true } } },
        },
        dependents: {
          include: { milestone: { select: { id: true, title: true } } },
        },
      },
    });

    res.status(200).json(milestones);
  } catch (error) {
    console.error("Get milestones by workspace error:", error);
    res.status(500).json({ error: "Failed to fetch milestones for workspace" });
  }
};

export const updateMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { title, description, status, progress, startDate, endDate } =
      req.body;

    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
    });

    if (!milestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    const updatedMilestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        title,
        description,
        status,
        progress,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });

    res.status(200).json(updatedMilestone);
  } catch (error) {
    console.error("Update milestone error:", error);
    res.status(500).json({ error: "Failed to update milestone" });
  }
};

export const deleteMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;

    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
    });

    if (!milestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    await prisma.milestone.delete({
      where: { id: milestoneId },
    });

    res.status(200).json({ message: "Milestone deleted successfully" });
  } catch (error) {
    console.error("Delete milestone error:", error);
    res.status(500).json({ error: "Failed to delete milestone" });
  }
};

export const createDependency = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { milestoneId, dependsOnId } = req.body;
    const { emailAddresses } = req.auth;
    const email = emailAddresses?.[0]?.emailAddress;

    if (!email) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!milestoneId || !dependsOnId) {
      return res
        .status(400)
        .json({ error: "Milestone ID and dependsOn ID are required" });
    }

    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { workspace: true },
    });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const isMember = await checkWorkspaceMembership(
      user.id,
      project.workspaceId
    );
    if (!isMember) {
      return res
        .status(403)
        .json({ error: "User is not a member of this workspace" });
    }

    const milestone = await prisma.milestone.findFirst({
      where: { id: milestoneId, projectId },
    });
    const dependsOn = await prisma.milestone.findFirst({
      where: { id: dependsOnId, projectId },
    });

    if (!milestone || !dependsOn) {
      return res
        .status(404)
        .json({ error: "One or both milestones not found in the project" });
    }

    const existingDependency = await prisma.milestoneDependency.findUnique({
      where: {
        milestoneId_dependsOnId: { milestoneId, dependsOnId },
      },
    });
    if (existingDependency) {
      return res.status(400).json({ error: "Dependency already exists" });
    }

    const dependency = await prisma.milestoneDependency.create({
      data: {
        milestone: { connect: { id: milestoneId } },
        dependsOn: { connect: { id: dependsOnId } },
      },
    });

    res.status(201).json(dependency);
  } catch (error) {
    console.error("Create dependency error:", error);
    res.status(500).json({ error: "Failed to create dependency" });
  }
};

export const deleteDependency = async (req, res) => {
  try {
    const { dependencyId } = req.params;

    const dependency = await prisma.milestoneDependency.findUnique({
      where: { id: dependencyId },
    });

    if (!dependency) {
      return res.status(404).json({ error: "Dependency not found" });
    }

    await prisma.milestoneDependency.delete({
      where: { id: dependencyId },
    });

    res.status(200).json({ message: "Dependency deleted successfully" });
  } catch (error) {
    console.error("Delete dependency error:", error);
    res.status(500).json({ error: "Failed to delete dependency" });
  }
};

export const getTasksForMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { project: true },
    });
    if (!milestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }
    const tasks = await prisma.task.findMany({
      where: {
        projectId: milestone.projectId,
        dueDate: {
          gte: milestone.startDate,
          lte: milestone.endDate,
        },
      },
      include: {
        assignee: { select: { id: true, name: true } },
        tags: true,
      },
    });
    // Generate project keys client-side or here (e.g., "PX-201" from project.key + task.id)
    const tasksWithKeys = tasks.map((task) => ({
      ...task,
      key: `${milestone.project.key}-${task.id}`,
    }));
    res.status(200).json(tasksWithKeys);
  } catch (error) {
    console.error("Get tasks for milestone error:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};
