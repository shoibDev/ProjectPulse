import Header from "../components/header/Header";
import { useParams } from "react-router-dom";
import api from '../utils/API';
import { useEffect, useState } from "react";
import { Project, User, Ticket} from "../utils/types";
import { Col } from "reactstrap";
import ProjectTeamTable from "../components/tables/ProjectTeamTable";
import ProjectTicketsTable from "../components/tables/ProjectTicketsTable";

type RouteParams = {
  id: string;  // Assuming the parameter is named 'id' in the route definition
}

const ProjectTicketPage = () => {
  const { id } = useParams<RouteParams>(); // id params is a string
  const projectId: number = parseInt(id as string, 10); // Parse the string to a number as parseInt expects a string

  const [projectData, setProjectData] = useState<Project>();
  const [projectTeam, setProjectTeam] = useState<User[]>([]); // Initialize as an empty array
  const [projectTickets, setProjectTickets] = useState<Ticket[]>([]); // Initialize as an empty array

  const [isNewMemberOpen, setIsNewMemberOpen] = useState(false);


  const toggleNewMember = () => setIsNewMemberOpen(!isNewMemberOpen);

  useEffect(() => {
    async function fetchData() {
      if (!isNaN(projectId)) {  // Check if projectId is a valid number
          const projectDataRes = await api.getProjectById(projectId);
          setProjectData(projectDataRes);
      }
    }
    fetchData().then(() => console.log("Project Data fetched"));
  }, [projectId]);

  useEffect(() => {
    async function fetchTeam() {
      if (projectData && projectData.userIds) {  // Ensure projectData and projectData.userIds are available
          const projectTeamRes = await api.getProjectUsers(projectData.userIds);
          setProjectTeam(projectTeamRes);

          const projectTicketsRes = await api.getProjectTickets(projectData.ticketIds || []);
          setProjectTickets(projectTicketsRes);
      }
    }

    fetchTeam().then(() => console.log("Project Team fetched"));
    
  }, [projectId, isNewMemberOpen, projectData]);

  return (
    <div>
      <Header title="PROJECT"/>

      <Col xl="4" className="mt-3">
              <ProjectTeamTable
                projectTeam={projectTeam}
                setProjectTeam={setProjectTeam}
                toggleNewMember={toggleNewMember}
                isNewMemberOpen={isNewMemberOpen}
                projectId={projectId}
              />
            </Col>

            <Col xl="8" className="mt-3">
              <ProjectTicketsTable
                projectId={projectId}
                projectTickets={projectTickets}
                setProjectTickets={setProjectTickets}
              />
            </Col>
    </div>
  )
}

export default ProjectTicketPage;
