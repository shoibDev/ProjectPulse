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
        <td className="py-2">
            {users.map((user, index) => (
                <span key={index}
                      className="inline-block bg-purple-200 text-purple-800 text-xs px-2 rounded-full uppercase font-semibold tracking-wide mr-2 mb-2">
            {user.firstName} {user.lastName}
        </span>
            ))}
        </td>
    );
}

export default UserCell;