import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";

// Assuming this User interface is already defined in your types.
import { User } from "../../utils/types";

// Assuming this API utility is correctly set up to fetch data.
import api from "../../utils/API";

interface UpdateTeamsProps {
    projectId: number;
    toggle: () => void;
    setProjectTeam: React.Dispatch<React.SetStateAction<User[]>>;
}

const UpdateTeams: React.FC<UpdateTeamsProps> = ({ projectId, toggle, setProjectTeam }) => {
    const [availableUsers, setAvailableUsers] = useState<User[]>([]);
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

    useEffect(() => {
        async function fetchData() {
            const users = await api.getAvaliableMembers(projectId);
            setAvailableUsers(users);
        }
        fetchData().catch(console.error);
    }, [projectId]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(event.target.selectedOptions, option => parseInt(option.value));
        setSelectedUserIds(selectedOptions);  // Update the selected user IDs directly

    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Submitting form with selected user IDs:", selectedUserIds);
        await api.addTeamMember(projectId, selectedUserIds)  // Assuming this API call exists
            .then(response => {
                console.log("Team members added successfully:", response);
                toggle();  // This might close the modal or clear the form.
            })
            .catch(error => {
                console.error("Failed to add team members:", error);
            });
    };

    return (
        <Container fluid>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for="team">Add Team Members</Label>
                            <Input
                                type="select"
                                name="userIds"
                                id="team"
                                onChange={handleChange}
                                multiple
                                value={selectedUserIds}  // Ensures the select reflects the current state
                            >
                                {availableUsers.map((user) => (
                                    <option key={user.id} value={user.id}>
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
}

export default UpdateTeams;
