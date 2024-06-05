import { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    ListGroup,
    ListGroupItem
} from "reactstrap";
import api from "../../utils/API.tsx";
import { User } from "../../utils/types.tsx";
import UpdateUser from "../forms/UpdateUser"; // Assuming you have a form component for updating user details

const UserTable = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [selectedUserData, setSelectedUserData] = useState<User | undefined>();

    useEffect(() => {
        const fetchUsers = async () => {
            const users = await api.getAllUsersExceptCurrent();
            setUsers(users);
        };

        fetchUsers().then(() => console.log("Users fetched"));
    }, []);

    useEffect(() => {
        if (selectedUserId) {
            const userData = users.find(user => user.id === selectedUserId);
            setSelectedUserData(userData);
        }
    }, [selectedUserId, users]);

    return (
        <Container className="mt--7" fluid>
            <Row>
                <Col md="6" className="mb-4">
                    <Card className="shadow">
                        <CardHeader className="mb-2">Organization</CardHeader>
                        <ListGroup flush className="m-4">
                            {users.map((user, key) => (
                                <ListGroupItem
                                    action // this prop makes the list items clickable
                                    key={key}
                                    onClick={() => {
                                        setSelectedUserId(user.id); // Set selected user ID
                                    }}
                                    active={user.id === selectedUserId} // Correctly applying active class
                                >
                                    {user.firstName} {user.lastName}
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </Card>
                </Col>
                <Col md="6">
                    <Card className="shadow">
                        <CardHeader className="mb-2">Edit User Information</CardHeader>
                        {selectedUserId && selectedUserData && (
                            <UpdateUser user={selectedUserData} setUsers={setUsers} />
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UserTable;
