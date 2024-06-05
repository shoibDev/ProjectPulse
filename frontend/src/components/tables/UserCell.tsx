import {Project, User} from "../../utils/types.tsx";
import {useEffect, useState} from "react";
import api from "../../utils/API.tsx";

const UserCell = ({ project }: { project: Project }) => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        async function fetchUsers() {
            const response = await api.getProjectUsers(project.userIds || []);
            setUsers(response);
        }
        fetchUsers().then(() => console.log("Users fetched"));
    }, [project.userIds]);

    return (
        <td>
            {users.map((user, key) => (
                <span key={key}>{user.firstName} {user.lastName}<br /></span>
            ))}
        </td>
    );
}

export default UserCell;