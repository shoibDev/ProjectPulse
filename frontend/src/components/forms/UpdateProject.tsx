import React, {useState, useEffect} from "react";
import {Container, Row, FormGroup, Label, Form, Button, Input} from "reactstrap";

import api from '../../utils/API';
import {User, Project} from '../../utils/types';

interface UpdateProjectProps {
    toggle: () => void;
    resetProjectId: () => void;
    projectData: Project;
    projectId: number;
}

const UpdateProject: React.FC<UpdateProjectProps> = ({toggle, resetProjectId, projectData, projectId,}) => {
    const [values, setValues] = useState({
        title: projectData.title,
        description: projectData.description,
    });
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const allUsers = await api.getAllUsersExceptCurrent();
            const projectUsers = await api.getProjectUsers(projectData.userIds || []);
            setAllUsers(allUsers);
            setSelectedUsers(projectUsers.map(user => user.id));
        };

        fetchUsers().then(() => console.log("Users fetched"));
    }, [projectData.userIds]);

    const handleCheckboxChange = (userId: number) => {
        setSelectedUsers(prevSelectedUsers =>
            prevSelectedUsers.includes(userId)
                ? prevSelectedUsers.filter(id => id !== userId)
                : [...prevSelectedUsers, userId]
        );
    };

    const submit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await api.removeAllTeamMembers(projectId);
        await Promise.all(
            selectedUsers.map(userId => api.addTeamMember(projectId, userId))
        );
        await api.updateProject(projectId, values);

        toggle();
        resetProjectId();
    };

    return (
        <Container fluid>
            <Form onSubmit={submit}>
                <Row>
                    <FormGroup>
                        <Label htmlFor="title">Project Title</Label>
                        <Input
                            type="text"
                            name="title"
                            id="title"
                            placeholder="Enter project title"
                            value={values.title}
                            onChange={e => setValues({...values, title: e.target.value})}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="description">Project Description</Label>
                        <Input
                            type="textarea"
                            name="description"
                            id="description"
                            placeholder="Enter description"
                            value={values.description}
                            onChange={e => setValues({...values, description: e.target.value})}
                            rows="5"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Update Team Members</Label>
                        {allUsers.map(user => (
                            <div key={user.id}>
                                <Label check>
                                    <Input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => handleCheckboxChange(user.id)}
                                    />{' '}
                                    {user.firstName} {user.lastName}
                                </Label>
                            </div>
                        ))}
                    </FormGroup>
                </Row>
                <Button color="success" type="submit">Submit</Button>
            </Form>
        </Container>
    );
};

export default UpdateProject;
