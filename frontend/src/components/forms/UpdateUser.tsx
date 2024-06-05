import {User} from "../../utils/types.tsx";
import React, {useState} from "react";
import {Button, Col, Form, FormGroup, Input, Label, Row} from "reactstrap";
import api from "../../utils/API.tsx";

interface UpdateUserProps {
    user: User;
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const UpdateUser: React.FC<UpdateUserProps> = ({ user, setUsers }) => {
    const [values, setValues] = useState<User>(user);  // Initialize with the user passed in props

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setValues({...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await api.editUser(values.id, values);
        // Update the users state in the parent component
        setUsers(prevUsers => prevUsers.map(u => u.id === values.id ? values : u));

    };

    // Define removeUser if needed
    const removeUser = async () => {
        // Example: await api.deleteUser(values.id);
        setUsers(prevUsers => prevUsers.filter(u => u.id !== values.id));

    };

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Row className="m-4">
                    <Col md="6">
                        <FormGroup>
                            <Label for="firstName" className="text-muted">
                                First Name
                            </Label>
                            <Input
                                type="text"
                                name="firstName"
                                id="firstName"
                                value={values.firstName}
                                onChange={handleChange}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <Label for="lastName" className="text-muted">
                                Last Name
                            </Label>
                            <Input
                                type="text"
                                name="lastName"
                                id="lastName"
                                value={values.lastName}
                                onChange={handleChange}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <Label for="role" className="text-muted">
                                Authorization Level
                            </Label>
                            <Input
                                type="select"
                                name="role"
                                id="role"
                                value={values.role}
                                onChange={handleChange}
                            >
                                <option value="admin">Admin</option>
                                <option value="project manager">Project Manager</option>
                                <option value="developer">Developer</option>
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>

                <FormGroup className="m-4">
                    <Label for="email" className="text-muted">
                        Email
                    </Label>
                    <Input
                        type="text"
                        name="email"
                        id="email"
                        value={values.email}
                        onChange={handleChange}
                    />
                </FormGroup>
                <Row className="m-4">
                    <Col md="6">
                        <Button color="success" type="submit">
                            Submit
                        </Button>
                    </Col>
                    <Col md="6" className="text-right">
                        <Button color="danger" type="button" onClick={removeUser} size="sm">
                            Remove User
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default UpdateUser;
