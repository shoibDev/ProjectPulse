import React, { useState, useEffect } from "react";
import { Container, Row, FormGroup, Label, Form, Button, Input } from "reactstrap";
import { toast } from "react-toastify";

import api from '../../utils/API';
import { User, Project } from '../../utils/types';

interface UpdateProjectProps {
    toggle: () => void;
    resetProjectId: () => void;
    projectData: Project;
    projectId: number;
}

const UpdateProject: React.FC<UpdateProjectProps> = ({ toggle, resetProjectId, projectData, projectId }) => {
    const [values, setValues] = useState({
        title: projectData.title,
        description: projectData.description,
    });
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const allUsers = await api.getAllUsersExceptCurrent();
                const projectUsers = await api.getProjectUsers(projectData.userIds || []);
                setAllUsers(allUsers);
                setSelectedUsers(projectUsers.map(user => user.id));
            } catch (error) {
                console.error("Failed to fetch users:", error);
                toast.error("Failed to fetch users");
            }
        };

        fetchUsers();
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

        if (!values.title || !values.description) {
            toast.error("Title and Description are required");
            return;
        }

        try {
            await api.removeAllTeamMembers(projectId);
            await Promise.all(
                selectedUsers.map(userId => api.addTeamMember(projectId, userId))
            );
            await api.updateProject(projectId, values);
            toggle();
            resetProjectId();
            toast.success("Project updated successfully");
        } catch (error) {
            console.error("Failed to update project:", error);
            toast.error("Failed to update project");
        }
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
                            onChange={e => setValues({ ...values, title: e.target.value })}
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
                            onChange={e => setValues({ ...values, description: e.target.value })}
                            rows="5"
                        />
                    </FormGroup>
                    <FormGroup className="mt-4">
                        <Label className="block mb-2">Update Team Members</Label>
                        <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                            {allUsers.map(user => (
                                <div key={user.id} className="flex items-center mb-2">
                                    <Input
                                        type="checkbox"
                                        className="accent-purple-500 h-5 w-5 text-purple-600"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => handleCheckboxChange(user.id)}
                                    />
                                    <Label className="ml-3 text-sm text-gray-700 cursor-pointer">
                                        {user.firstName} {user.lastName}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </FormGroup>
                </Row>
                <Button color="success" type="submit">Submit</Button>
            </Form>
        </Container>
    );
};

export default UpdateProject;
