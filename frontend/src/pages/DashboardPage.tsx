import Header from '../components/header/Header';
import ProjectsTable from '../components/tables/ProjectsTable'

const DashboardPage: React.FC = () => {



    return (
        <div>
            <Header title='DASHBOARD'/>
            <ProjectsTable />
        </div>
    );
};

export default DashboardPage;
