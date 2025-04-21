import prisma from "../db";

//helper function to check the user is part of the workspace
const checkWorkspaceMemberShip = async (useRevalidator, workspaceId) => {
  const workspaceMember = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: { workspaceId, userId },
    },
  });
  return !!workspaceMember;
};

export const createMilestone = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, startDate, endDate } = req.body;
    const { emailAddresses } = req.auth;
    const email = emailAddresses?.[0]?.emailAddresses;

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

    const isMember = await checkWorkspaceMemberShip(
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
        owner: { connect: { id: user.id } },
      },
    });

    res.status(201).json(milestone);
  } catch (error) {
    console.error("Create milestone error:", error);
    res.status(500).json({ error: "Failed to create milestone" });
  }
};
