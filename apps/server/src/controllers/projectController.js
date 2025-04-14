import prisma from '../db.js'

export const createProject = async (req, res) => {
    try {
      const { name, description, workspaceName } = req.body;
      const {emailAddresses}= req.auth 
      const email = emailAddresses?.[0]?.emailAddress;
  
      if (!name || !workspaceName) {
        return res.status(400).json({ error: 'Project name and workspace name are required' });
      }
      const workspace = await prisma.workspace.findFirst({
        where: { name: workspaceName },
      });
      if (!workspace) {
        return res.status(404).json({ error: 'Workspace not found' });
      }
      const workspaceId= workspace.id;

  
      const user = await prisma.user.findFirst({
        where: { email:email },
      });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Check if user is a workspace member
      const workspaceMember = await prisma.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId, userId: user.id } },
      });
  
      if (!workspaceMember) {
        return res.status(403).json({ error: 'User is not a member of this workspace' });
      }
  
      const project = await prisma.project.create({
        data: {
          name,
          description: description || null,
          workspaceId,
          key: name.slice(0, 3).toUpperCase(),
        },
      });
  
      res.status(201).json({ message: 'Project created successfully', project });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create project' });
    }
  };
export const getUserProjects = async (req, res) => {
    try {
        const {emailAddresses}= req.auth 
        const email = emailAddresses?.[0]?.emailAddress;
  
      const user = await prisma.user.findFirst({
        where: { email:email},
        include: {
          workspaces: {
            include: { workspace: { include: { projects: true } } },
          },
        },
      });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const projects = user.workspaces.flatMap(wm =>
        wm.workspace.projects.map(project => ({
          id: project.id,
          name: project.name,
          workspaceId: project.workspaceId,
        }))
      );
  
      res.status(200).json(projects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  };

export const getProjectInfo = async(req, res) => {
  try {
    const { projectId } = req.params;
    
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }
    
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        workspace: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  }
                }
              }
            }
          }
        }
      }
    });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Count workspace members and add to response
    const memberCount = project.workspace.members.length;
    
    // Format the response
    const projectData = {
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      progress: project.progress,
      teamMembers: memberCount,
      // Add other project properties as needed
    };
    
    res.status(200).json(projectData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch project information' });
  }
};