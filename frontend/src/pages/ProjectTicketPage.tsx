import Header from "../components/header/Header";
import { useParams } from "react-router-dom";
import api from '../utils/API';
import { useEffect, useState } from "react";
import { Project, User, Ticket } from "../utils/types";
import ProjectTeamTable from "../components/tables/ProjectTeamTable";
import ProjectTicketsTable from "../components/tables/ProjectTicketsTable";
import SelectedTicket from "../components/tables/SelectedTicket";
import { Col, Row, Container } from "reactstrap";

type RouteParams = {
    id: string;  // Assuming the parameter is named 'id' in the route definition
}

const ProjectTicketPage = () => {
    const { id } = useParams<RouteParams>();
    const projectId = parseInt(id as string, 10);

    const [projectData, setProjectData] = useState<Project>();
    const [projectTeam, setProjectTeam] = useState<User[]>([]);
    const [projectTickets, setProjectTickets] = useState<Ticket[]>([]);
    const [selectedTicketId, setSelectedTicketId] = useState<number>();

    const [isNewMemberOpen, setIsNewMemberOpen] = useState(false);
    const toggleNewMember = () => setIsNewMemberOpen(!isNewMemberOpen);
    const [render, setRender] = useState(0);
    const forceUpdate = () => setRender(render => render + 1);

    useEffect(() => {
        async function fetchData() {
            if (!isNaN(projectId)) {
                const projectDataRes = await api.getProjectById(projectId);
                setProjectData(projectDataRes);
            }
        }
        fetchData().then(() => console.log("Project Data fetched"));
    }, [projectId, render]);

    useEffect(() => {
        async function fetchTeam() {
            if (projectData && projectData.userIds) {
                const projectTeamRes = await api.getProjectUsers(projectData.userIds);
                setProjectTeam(projectTeamRes);

                const projectTicketsRes = await api.getProjectTickets(projectData.ticketIds || []);
                setProjectTickets(projectTicketsRes);
            }
        }

        fetchTeam().then(() => console.log("Project Team and Tickets fetched"));
    }, [projectId, isNewMemberOpen, projectData]);

    return (
        <div className="d-flex flex-column h-100">
            <Header title="PROJECT" />
            <Container fluid className="flex-grow-1 d-flex">
                <div className="w-1/3">
                    <ProjectTeamTable
                        projectTeam={projectTeam}
                        setProjectTeam={setProjectTeam}
                        toggleNewMember={toggleNewMember}
                        isNewMemberOpen={isNewMemberOpen}
                        projectId={projectId}
                        render={forceUpdate}
                    />
                </div>
                <div className="w-2/3 pl-6">
                    <ProjectTicketsTable
                        projectId={projectId}
                        projectTickets={projectTickets}
                        setProjectTickets={setProjectTickets}
                        setSelectedTicketId={setSelectedTicketId}
                        render={forceUpdate}
                    />
                </div>
            </Container>
            <div className="mt-auto w-100">
                <SelectedTicket ticketId={selectedTicketId} />
            </div>
        </div>
    );
}

export default ProjectTicketPage;
