import React, {useState, useEffect} from "react";
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
import {User, Project} from "../../utils/types";

interface CreateProjectProps {
    toggle?: () => void;
    setProjects?: React.Dispatch<React.SetStateAction<Project[]>>;
    projects?: Project[];
    render?: () => void;
}

const CreateProject: React.FC<CreateProjectProps> = ({toggle, setProjects, projects, render}) => {
    const [project, setProject] = useState<Project>({
        title: "",
        description: "",
        userIds: []
    });
    const [availableTeamMembers, setAvailableTeamMembers] = useState<User[]>([]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = event.target;
        const value = target.type === 'select-multiple' ?
            Array.from((target as HTMLSelectElement).selectedOptions, option => option.value) :
            target.value;

        setProject(prev => ({
            ...prev,
            [target.name]: value
        }));
    };

    useEffect(() => {
        let isRendered = true;

        async function fetchUsers() {
            const users = await api.getAllUsersExceptCurrent();
            if (isRendered) setAvailableTeamMembers(users);
        }

        fetchUsers().then(() => console.log("Users fetched"));

        return () => {
            isRendered = false;
        };
    }, []);

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const newProject = await api.createProject(project);
        if (setProjects && projects) {
            setProjects(prevProjects => [...prevProjects, newProject]);
        }

        // Handle all addTeamMember operations concurrently
        const teamMemberPromises = project.userIds && newProject.id ? project.userIds.map(userId =>
            api.addTeamMember(newProject.id, userId)
        ) : [];

        await Promise.all(teamMemberPromises);

        if (render) {
            render();
        }
        setProject({title: "", description: "", userIds: []});

        if (toggle) {
            toggle();
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
                                value={project.userIds ? project.userIds.map(String) : undefined} // Convert number[] to string[] since value is expecting string
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
