import { useLocation } from 'react-router-dom';

function DashBoard() {
    const location = useLocation();
    const {workSpaceCode} = location.state || {};
  return (
    <div>DashBoard
        <h1>Welcome to the DashBoard</h1>
        <p>WorkSpace Code: {workSpaceCode}</p>
        
    </div>
  )
}

export default DashBoard