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
  const { id } = useParams<RouteParams>();
  const projectId = parseInt(id, 10);

  const [projectData, setProjectData] = useState<Project>();
  const [projectTeam, setProjectTeam] = useState<User[]>([]);  // Define type for projectTeam
  const [projectTickets, setProjectTickets] = useState<Ticket[]>([]);

  const [selectedTicketId, setSelectedTicketId] = useState("");
  const [selectedTicket, setSelectedTicket] = useState({});

  const [isNewMemberOpen, setIsNewMemberOpen] = useState(false);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [isEditTicketOpen, setIsEditTicketOpen] = useState(false);


  const toggleNewMember = () => setIsNewMemberOpen(!isNewMemberOpen);
  const toggleCreateTicket = () => setIsNewTicketOpen(!isNewTicketOpen);
  const toggleEditTicket = () => setIsEditTicketOpen(!isEditTicketOpen);

  useEffect(() => {
    const abortController = new AbortController();

    async function fetchData() {
      if (!isNaN(projectId)) {  // Check if projectId is a valid number
        try {
          const projectDataRes = await api.getProjectById(projectId);
          setProjectData(projectDataRes);
        } catch (err) {
          if (!abortController.signal.aborted) {
            console.log(`Error requesting project data: ${err}`);
          }
        }
      }
    }

    fetchData();
    return () => {
      abortController.abort();
    };
  }, [projectId]);

  useEffect(() => {
    const abortController = new AbortController();

    async function fetchTeam() {
      if (projectData && projectData.userIds) {  // Ensure projectData and projectData.userIds are available
        try {
          const projectTeamRes = await api.getProjectUsers(projectData.userIds);
          setProjectTeam(projectTeamRes);

          const projectTicketsRes = await api.getProjectTickets(
            projectData.ticketIds,
            
          );
          setProjectTickets(projectTicketsRes);
        } catch (err) {
          if (!abortController.signal.aborted) {
            console.log("Error fetching project team data", err);
          }
        }
      }
    }

    fetchTeam();

    return () => {
      abortController.abort();
    };
  }, [projectId, isNewMemberOpen]);

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
                //projectTeam={projectTeam}
                // selectedTicket={selectedTicket}
                // setSelectedTicketId={setSelectedTicketId}
                toggleEditTicket={toggleEditTicket}
                toggleCreateTicket={toggleCreateTicket}
                isEditTicketOpen={isEditTicketOpen}
                isNewTicketOpen={isNewTicketOpen}
                //assignedDevs={assignedDevs}
              />
            </Col>
    </div>
  )
}

export default ProjectTicketPage;
