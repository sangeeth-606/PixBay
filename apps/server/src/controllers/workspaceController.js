import prisma from '../db.js'

export const createWorkspace= async(req  , res)=>{
    try {
        const {name}=req.body
        const {emailAddresses}= req.auth // will be getting aftewr clerk middleware check

        if (!name){
            return res.status(400).json({error:"Give a Name to Workspace"})
        }
        if (!emailAddresses){
            return res.status(400).json({error:"Please sign in again"})
        }
        const user= await prisma.user.findFirst({
            where:{email:emailAddresses}
        })

        if (!user){
            return res.status(400).json({error:"User Not Found "})
        }

        const Workspace= await prisma.workspace.create({
            data:{
                name,
                members:{
                    create:{
                        userId:user.id,
                        role:'ADMIN'
                    }
                }
            }
        });
        res.status(201).json({message:"Workspace created successfully", Workspace})
    } catch (error) {
        console.error('Error creating workspace:', error);
        res.status(500).json({error:"failed to create workspace"});
    }
}
// to join existing workspace
export const joinWorkspace= async( req  , res)=>{
    try {
        const {workspaceName}= req.body;
        const {emailAddresses}= req.auth;

        if (!workspaceName){
            return res.status(400).json({error:"Workspace name is required"})
        }
        const user= await prisma.user.findFirst({
            where:{email:emailAddresses}
        })

        if (!user){
            return res.status(404).json({error:"User not found"});
        }

        const workspace= await prisma.workspace.findFirst({
            where:{name:workspaceName}
        })
        if (!workspace){
            return res.status(404).json({error:"Workspace not found"})
        }
        
        // / Check if user is already a member
        const existingMember = await prisma.workspaceMember.findUnique({
            where: { workspaceId_userId: { workspaceId: workspace.id, userId: user.id } },
        });

        if (existingMember) {
            return res.status(400).json({ error: 'User is already a member' });
        }
        const member = await prisma.workspaceMember.create({
            data: {
              workspaceId: workspace.id, // Use the found workspace’s ID
              userId: user.id,
              role: 'MEMBER',
            },
          });
        res.status(200).json({ message: 'Joined workspace successfully', member });


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to join workspace' });
        
    }
}
// Get user's workspaces 
export const getUserWorkspaces = async (req, res) => {
  try {
    const {emailAddresses}= req.auth;

    const user = await prisma.user.findUnique({
      where: { email:emailAddresses },
      include: { workspaces: { include: { workspace: true } } },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(
      user.workspaces.map(wm => ({
        id: wm.workspace.id,
        name: wm.workspace.name,
        role: wm.role,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch workspaces' });
  }
};