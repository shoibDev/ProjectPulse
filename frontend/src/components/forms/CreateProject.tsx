import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";

import api from '../../utils/API';
import { User, Project } from "../../utils/types";

const CreateProject = ({ toggle, setProjects, projects, render }) => {
  const [project, setProject] = useState<Project>({
    title: "",
    description: "",
    userIds: []
  });
  const [availableTeamMembers, setAvailableTeamMembers] = useState<User[]>([]);

  const handleChange = (event) => {
    const { name, type, value, selectedOptions } = event.target;
    let newValue = value;

    if (type === "select-multiple") {
      newValue = Array.from(selectedOptions, (option) => option.value);
    }    

    setProject(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  useEffect(() => {
    let isRendered = true;

    async function fetchUsers() {
      const users = await api.getAllUsersExceptCurrent();
      if (isRendered) setAvailableTeamMembers(users);
    }

    fetchUsers();

    return () => {
      isRendered = false;
    };
  }, []);

  async function submit(event) {
    event.preventDefault();

    try {
      const newProject = await api.createProject(project);
      if (setProjects && projects) {
        setProjects([...projects, newProject]);
      }

      project.userIds.forEach(async (userId) => {
        console.log(userId);
        await api.addTeamMember(newProject.id, userId);
      });

      if (render) {
        render(); // Assuming this toggles a re-render or state update elsewhere
      }

    } catch (err) {
      console.error(err);
    }

    setProject({ title: "", description: "", userIds: [] });

    if (toggle) {
      toggle(); // Used for closing modal or similar UI component
    }
  }

  return (
    <Container fluid>
      <Form onSubmit={submit}>
        <Row>
          <Col>
            <FormGroup>
              <Label htmlFor="name" className="lease-form-label mandatory-entry">
                Project Title
              </Label>
              <Input
                id="title"
                type="text"
                name="title"
                className="lease-form-input"
                placeholder="Enter project title"
                value={project.title}
                onChange={handleChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Label for="description">Project Description</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                placeholder="Enter description"
                value={project.description}
                onChange={handleChange}
                rows="5"
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Label for="team">Add Team Members</Label>
              <Input
                type="select"
                name="userIds"
                id="team"
                value={project.userIds}
                onChange={handleChange}
                multiple
              >
                {availableTeamMembers.map((user, key) => (
                  <option key={key} value={user.id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </Col>
        </Row>

        <Button color="success" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default CreateProject;
