import { useState, useEffect, useMemo } from "react";
import api from '../../utils/API'

import CreateProject from '../forms/CreateProject'
import UpdateProject from "../forms/UpdateProject";

import { Link } from "react-router-dom";
import PaginationComponent from "./PaginationComponent";
import { Project } from '../../utils/types'

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

const ProjectsTable = () => {

  const [projects, setProjects] = useState<Project[]>([]);

  const [selectedProjectId, setSelectedProjectId] = useState<number>();
  const [selectedProjectData, setSelectedProjectData] = useState<Project>();

  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const toggleNewProject = () => setIsNewProjectOpen(!isNewProjectOpen);

  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const toggleEditProject = () => setIsEditProjectOpen(!isEditProjectOpen);

  const setProjectId = (event) => setSelectedProjectId(event.target.id);
  const resetProjectId = () => setSelectedProjectId(null);

  const [render, setRender] = useState(false);
  const toggleRender = () => setRender(!render);


  //pagination
  const [totalProjects, setTotalProjects] = useState(0);
  const [currentProjectPage, setCurrentProjectPage] = useState(1);
  const projectsPerPage = 6;

  useEffect(() => {
    async function fetchProject() {
      try {
        const projectsData = await api.getProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects or user information:", error);
      }
    }

    fetchProject();
  }, [render, !isEditProjectOpen]);


  const fetchProject = async () => {
    if (selectedProjectId) {
      try {
        const [projectData] = await Promise.all([
          api.getProjectById(selectedProjectId),
        ]);
        setSelectedProjectData(projectData);
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    fetchProject();
  }, [selectedProjectId]);


  const projectData = useMemo(() => {
    const computedProjects = projects;

    setTotalProjects(computedProjects.length);

    return computedProjects.slice(
      (currentProjectPage - 1) * projectsPerPage,
      (currentProjectPage - 1) * projectsPerPage + projectsPerPage
    );
  }, [projects, currentProjectPage]);


  return (
    <div className="p-3 mb-2 bg-light text-dark z-20 -mt-12 w-full">
      <Card className="shadow p-3 mb-5 rounded bg-white">
        <CardHeader className="border-0 d-flex justify-content-between align-items-center">
          <h3 className="mb-2">Projects</h3>
          <Button color="primary" onClick={toggleNewProject} size="sm">
            New Project
          </Button>
        </CardHeader>
        <CardBody>
          <Table>
            <thead className="thead-light">
              <tr>
                <th scope="col">PROJECT</th>
                <th scope="col">DESCRIPTION</th>
                <th scope="col">MEMBERS</th>
                <th scope="col" />
              </tr>
            </thead>
            <tbody>
              {projectData.map((project) => (
                <tr key={project.id}>
                  <th scope="row">
                    <Link to={`/project/${project.id}`}>
                      <Media>
                        <span> {project.title} </span>
                      </Media>
                    </Link>
                  </th>
                  <td
                    style={{
                      whiteSpace: "unset",
                      wordWrap: "break-word",
                    }}
                  >
                    <span>{project.description}</span>
                  </td>
                  <td>{project.userIds}</td>
                  <td className="text-right">
                    <UncontrolledDropdown className="me-2" direction="start">
                      <DropdownToggle
                        className="btn-icon-only"
                        role="button"
                        size="sm"
                        id={project.id}
                        onClick={(e) => setProjectId(e)}
                      >
                        ...
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem
                          id={project.id}
                          onClick={() => toggleEditProject(project.id)}
                        >
                          EDIT
                        </DropdownItem>
                        <DropdownItem onClick={() => deleteProject(project.id)}>
                          DELETE
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
        <CardFooter className="py-4">
          <PaginationComponent
            total={totalProjects}
            itemsPerPage={projectsPerPage}
            currentPage={currentProjectPage}
            onPageChange={(page) => setCurrentProjectPage(page)}
          />
        </CardFooter>
        <Modal isOpen={isNewProjectOpen} toggle={toggleNewProject}>
          <Container className="m-4 align-self-center" fluid>
            <ModalHeader toggle={toggleNewProject}>Add New Project</ModalHeader>
            <CreateProject
              toggle={toggleNewProject}
              setProjects={setProjects}
              projects={projects}
              render={toggleRender}
            />
          </Container>
        </Modal>
        <Modal
          isOpen={isEditProjectOpen && selectedProjectData !== null}
          onClose={toggleEditProject}
        >
          <Container className="m-4 align-self-center" fluid>
            <ModalHeader toggle={toggleEditProject}>Edit Project</ModalHeader>
            <UpdateProject
              toggle={toggleEditProject}
              setProjects={setProjects}
              resetProjectId={resetProjectId}
              projectData={selectedProjectData}
              projectId={selectedProjectId}
            />
          </Container>
        </Modal>
      </Card>

    </div>
  );
};

export default ProjectsTable;
