import React, { useEffect, useState } from "react";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import api from "../../utils/API";

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

interface UpdateUserProps {
    user: User;
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const UpdateUser: React.FC<UpdateUserProps> = ({ user, setUsers }) => {
    const [principal, setPrincipal] = useState<User>(user); // Initialize with the user passed in props
    const [values, setValues] = useState<User>(user); // Initialize with the user passed in props

    useEffect(() => {
        const fetchPrincipal = async () => {
            const principalData = await api.getPrincipal();
            setPrincipal(principalData);
        };

        fetchPrincipal().then(() => console.log("Principal fetched"));
    }, [values.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setValues({...values, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //await api.editUser(values.id, values);
        setUsers(prevUsers => prevUsers.map(u => u.id === values.id ? values : u));
    };

    const removeUser = async () => {
        //await api.deleteUser(values.id);
        setUsers(prevUsers => prevUsers.filter(u => u.id !== values.id));
    };

    // Determine if the role selection should be disabled
    const canChangeRole = principal.role === 'admin' && user.role !== 'admin';

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
                                disabled={!canChangeRole}
                            >
                                <option value="admin">Admin</option>
                                <option value="manager">Project Manager</option>
                                <option value="DEVELOPER">Developer</option>
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
