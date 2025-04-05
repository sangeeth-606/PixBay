import prisma from '../db.js'

export const createProject = async (req, res) => {
    try {
      const { name, description, workspaceId } = req.body;
      const {emailAddresses}= req.auth 
  
      if (!name || !workspaceId) {
        return res.status(400).json({ error: 'Project name and workspace ID are required' });
      }
  
      const user = await prisma.user.findUnique({
        where: { email:emailAddresses },
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
  
      const user = await prisma.user.findUnique({
        where: { email:emailAddresses },
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