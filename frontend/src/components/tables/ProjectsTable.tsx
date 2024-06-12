// React imports
import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";

// Component imports
import CreateProject from '../forms/CreateProject';
import UpdateProject from "../forms/UpdateProject";
import UserCell from "./UserCell.tsx";
import PaginationComponent from "./PaginationComponent";

// Utility and API imports
import api from '../../utils/API';
import { Project } from '../../utils/types';

// Reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    Button,
    CardFooter,
    Table,
    Media,
    DropdownToggle,
    DropdownMenu,
    UncontrolledDropdown,
    DropdownItem,
    Modal,
    ModalHeader,
    Container,
} from "reactstrap";

import { ToastContainer, toast } from 'react-toastify';


// ProjectsTable: Manages the display and interaction with the project list
const ProjectsTable = () => {
    // State management for project data and modals
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<number>();
    const [selectedProjectData, setSelectedProjectData] = useState<Project>();
    const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
    const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
    const [totalProjects, setTotalProjects] = useState(0);
    const [currentProjectPage, setCurrentProjectPage] = useState(1);
    const projectsPerPage = 6;

    // Modal toggle functions
    const toggleNewProject = () => setIsNewProjectOpen(!isNewProjectOpen);
    const toggleEditProject = () => setIsEditProjectOpen(!isEditProjectOpen);

    // Fetch all projects on component mount
    useEffect(() => {
        const fetchAllProjects = async () => {
            try {
                const projectsData = await api.getProjects();
                setProjects(projectsData);
            } catch (error) {
                toast.error("Failed to fetch projects");
                console.log("Failed to load projects. Please try again later.")
            }
        };
        fetchAllProjects();
    }, [isEditProjectOpen, isNewProjectOpen]);

    // Fetch specific project details
    const fetchProject = useCallback(async () => {
        if (selectedProjectId) {
            try {
                const projectData = projects.find(project => project.id === selectedProjectId);
                setSelectedProjectData(projectData);
            } catch (error) {
                toast.error("Failed to fetch project details");
                console.log("Failed to load project details. Please try again later.");
            }
        }
    }, [selectedProjectId, projects]);

    useEffect(() => {
        fetchProject();
    }, [fetchProject]);

    // Handle project deletion
    const deleteProject = async () => {
        try {
            await api.deleteProject(selectedProjectId);
            const updatedProjects = await api.getProjects();
            setProjects(updatedProjects);
            toast.success("Project deleted successfully")
        } catch (error) {
            toast.error("Failed to delete project");
            console.log("Failed to delete project. Please try again later.");
        }
        resetProjectId();
    };

    const setProjectId = (projectId: number | undefined) => setSelectedProjectId(projectId);
    const resetProjectId = () => setSelectedProjectId(undefined);

    // Compute projects to display based on pagination
    const projectData = useMemo(() => {
        const computedProjects = projects.slice(
            (currentProjectPage - 1) * projectsPerPage,
            (currentProjectPage - 1) * projectsPerPage + projectsPerPage
        );
        setTotalProjects(projects.length);
        return computedProjects;
    }, [projects, currentProjectPage]);

    // Component render
    return (
        <div className="p-3 mb-2 text-dark z-20 -mt-12 w-full">
            <Card className="shadow p-3 mb-5 rounded">
                <CardHeader className="border-0 d-flex justify-content-between align-items-center bg-white">
                    <h6 className="mb-2">Projects</h6>
                    <Button color="primary" onClick={toggleNewProject} size="sm">
                        New Project
                    </Button>
                </CardHeader>
                <CardBody>
                    <Table>
                        <thead className="rounded border-t-2 border-b-2">
                        <tr>
                            <th scope="col" className="text-sm p-1">PROJECT</th>
                            <th scope="col" className="text-sm p-1">DESCRIPTION</th>
                            <th scope="col" className="text-sm p-1">MEMBERS</th>
                            <th scope="col" className="text-sm p-1"/>
                        </tr>
                        </thead>
                        <tbody>
                        {projectData.map(project => (
                            <tr key={project.id}>
                                <th scope="row">
                                    <Link to={`/project/${project.id}`} style={{ textDecoration: 'none', color: '#D6A2E8' }}>
                                        <Media><span>{project.title}</span></Media>
                                    </Link>
                                </th>
                                <td style={{ whiteSpace: "unset", wordWrap: "break-word" }}>
                                    <span>{project.description}</span>
                                </td>

                                <td className={"w-100px"}><UserCell project={project}/></td>

                                <td className="text-right">
                                    <UncontrolledDropdown className="me-2" direction="start">
                                        <DropdownToggle
                                            className="btn-icon-only text-black bg-transparent border border-gray-300 rounded"
                                            role="button"
                                            size="sm"
                                            onClick={() => setProjectId(project.id)}
                                        >
                                            ⋮
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem onClick={toggleEditProject}>EDIT</DropdownItem>
                                            <DropdownItem onClick={deleteProject}>DELETE</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </CardBody>
                <CardFooter className="py-4 bg-white flex justify-center">
                    <PaginationComponent
                        total={totalProjects}
                        itemsPerPage={projectsPerPage}
                        currentPage={currentProjectPage}
                        onPageChange={page => setCurrentProjectPage(page)}
                    />
                </CardFooter>
                <Modal isOpen={isNewProjectOpen} toggle={toggleNewProject}>
                    <Container className="m-4 align-self-center" fluid>
                        <ModalHeader toggle={toggleNewProject}>Add New Project</ModalHeader>
                        <CreateProject
                            toggle={toggleNewProject}
                            setProjects={setProjects}
                            projects={projects}
                        />
                    </Container>
                </Modal>
                {isEditProjectOpen && selectedProjectData && selectedProjectId && (
                    <Modal isOpen={isEditProjectOpen} onClose={toggleEditProject}>
                        <Container className="m-4 align-self-center" fluid>
                            <ModalHeader toggle={toggleEditProject}>Edit Project</ModalHeader>
                            <UpdateProject
                                toggle={toggleEditProject}
                                resetProjectId={resetProjectId}
                                projectData={selectedProjectData}
                                projectId={selectedProjectId}
                            />
                        </Container>
                    </Modal>
                )}
            </Card>

            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
};

export default ProjectsTable;
