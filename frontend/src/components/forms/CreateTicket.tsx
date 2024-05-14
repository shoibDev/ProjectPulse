import React, { useState } from "react";
import { Ticket } from "../../utils/types.tsx";
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
import api from "../../utils/API.tsx";

interface CreateTicketProps {
    toggle: () => void;
    projectId: number;
    SetProjectTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
}

const CreateTicket: React.FC<CreateTicketProps> = ({ toggle, projectId, SetProjectTickets }) => {
    const [ticketValues, setTicketValues] = useState<Ticket>({
        title: '',
        description: '',
        priority: 'low',
        type: 'issue',
        status: 'new',
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTicketValues({ ...ticketValues, [name]: value });
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!ticketValues.title) newErrors.title = "Title is required";
        if (!ticketValues.description) newErrors.description = "Description is required";
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            try {

                await api.createTicket(projectId, ticketValues);
                //SetProjectTickets(prevTickets => [...prevTickets, ticketValues]);
                toggle(); // Close the modal or form after submission
            } catch (error) {
                console.error("Error getting creator:", error);
                // Handle the error (e.g., display an error message)
            }
        }
    };

    return (
        <Container fluid>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label
                                htmlFor="title"
                                className="lease-form-label mandatory-entry"
                            >
                                Title
                            </Label>
                            <Input
                                id="title"
                                type="text"
                                name="title"
                                className="lease-form-input"
                                placeholder="Enter ticket title"
                                value={ticketValues.title}
                                onChange={handleChange}
                            />
                            {errors.title && (
                                <div style={{ fontSize: 12, color: "red" }}>{errors.title}</div>
                            )}
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for="ticketDescription">Ticket Description</Label>
                            <Input
                                type="textarea"
                                name="description"
                                id="ticketDescription"
                                placeholder="Enter description"
                                value={ticketValues.description}
                                onChange={handleChange}
                                rows="5"
                            />
                            {errors.description && (
                                <div style={{ fontSize: 12, color: "red" }}>{errors.description}</div>
                            )}
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for="type">Type</Label>
                            <Input
                                type="select"
                                name="type"
                                id="type"
                                value={ticketValues.type}
                                onChange={handleChange}
                            >
                                <option>issue</option>
                                <option>bug</option>
                                <option>error</option>
                                <option>feature request</option>
                                <option>other</option>
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label for="priority">Priority</Label>
                            <Input
                                type="select"
                                name="priority"
                                id="priority"
                                value={ticketValues.priority}
                                onChange={handleChange}
                            >
                                <option>low</option>
                                <option>medium</option>
                                <option>high</option>
                                <option>immediate</option>
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label for="status">Status</Label>
                            <Input
                                type="select"
                                name="status"
                                id="status"
                                value={ticketValues.status}
                                onChange={handleChange}
                            >
                                <option>new</option>
                                <option>open</option>
                                <option>in progress</option>
                                <option>resolved</option>
                                <option>additional info required</option>
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

export default CreateTicket;
