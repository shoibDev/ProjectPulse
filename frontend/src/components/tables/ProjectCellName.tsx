import { Project} from "../../utils/types.tsx";
import {useEffect, useState} from "react";
import api from "../../utils/API.tsx";

const ProjectCellName = ({ projectId }: { projectId: number }) => {
    const [project, setProject] = useState<Project>();

    useEffect(() => {
        async function fetchProject() {
            const response = await api.getProjectById(projectId);
            setProject(response);
        }
        fetchProject().then(() => console.log("Project fetched"));
    }, [projectId]);

    return (
        <td className="py-2">
            {project?.title}
        </td>
    );
}

export default ProjectCellName;