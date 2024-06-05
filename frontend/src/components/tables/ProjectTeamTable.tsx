// Import React and any necessary types
import React, { useMemo, useState } from 'react';
import { User } from '../../utils/types'
import { Button, Card, CardFooter, CardHeader, Col, DropdownItem, DropdownMenu, DropdownToggle, Media, Modal, ModalHeader, Row, Table, UncontrolledDropdown } from 'reactstrap';
import PaginationComponent from './PaginationComponent';
import api from "../../utils/API.tsx";
import UpdateTeams from "../forms/UpdateTeams.tsx";

// Define the types for the props
interface ProjectTeamTableProps {
  projectTeam: User[];
  setProjectTeam: React.Dispatch<React.SetStateAction<User[]>>;
  toggleNewMember: () => void;
  isNewMemberOpen: boolean;
  projectId: number;
  render: () => void;
}

// Define the component using these props
const ProjectTeamTable: React.FC<ProjectTeamTableProps> = ({
  projectTeam,
  setProjectTeam,
  toggleNewMember,
  isNewMemberOpen,
  projectId,
    render,
}) => {

  const [userId, setUserId] = useState<number>(0);

  const [totalTeamMembers, setTotalTeamMembers] = useState(0);
  const [currentTeamMembersPage, setCurrentTeamMembersPage] = useState(1);
  const teamMembersPerPage = 6;

  //pagination for team table
  const teamMembersData = useMemo(() => {
    const computedTeamMembers = projectTeam;

    setTotalTeamMembers(computedTeamMembers.length);

    //current page slice
    return computedTeamMembers.slice(
      (currentTeamMembersPage - 1) * teamMembersPerPage,
      (currentTeamMembersPage - 1) * teamMembersPerPage + teamMembersPerPage
    );
  }, [projectTeam, currentTeamMembersPage]);


  return (
    <Card className="shadow">
      <CardHeader className="border-0">
        <Row className="border-0 d-flex justify-content-between align-items-center bg-white">
          <Col>
            <h6 className="mb-2">Team</h6>
          </Col>

          <Col>
            <div className="col text-right">
              <Button color="primary" onClick={toggleNewMember} size="sm">
                New Member
              </Button>

              <Modal isOpen={isNewMemberOpen} onClose={toggleNewMember}>
                <ModalHeader toggle={toggleNewMember}>Add Member</ModalHeader>
                  <UpdateTeams
                    projectId={projectId}
                    toggle={toggleNewMember}
                    setProjectTeam={setProjectTeam}
                    render={render}
                  />
              </Modal>
            </div>
          </Col>
        </Row>
      </CardHeader>

      <Table className="align-items-center table-flush" responsive>
        <thead className="rounded border-t-2 border-b-2">
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Phone</th>
            <th scope="col" />
          </tr>
        </thead>
        <tbody>
          {teamMembersData.map((user) => {
            return (
              <tr key={user.id} className="teamRow">
                <th>
                  <Media style={{ textDecoration: 'none', color: '#D6A2E8' }}>
                    {user.firstName} {user.lastName}
                  </Media>
                </th>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td className="text-right">
                  <UncontrolledDropdown direction="start">
                    <DropdownToggle
                        className="btn-icon-only text-black bg-transparent border border-gray-300 rounded"
                        role="button"
                        size="sm"
                        onClick={() => setUserId(user.id)}
                    >
                      ⋮
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-arrow" right>
                      <DropdownItem
                          onClick={async () =>
                              await api.removeTeamMember(projectId, userId).then(() => render())
                          }
                      >
                        Remove Team Member
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <CardFooter>
        <PaginationComponent
          total={totalTeamMembers}
          itemsPerPage={teamMembersPerPage}
          currentPage={currentTeamMembersPage}
          onPageChange={(page) => setCurrentTeamMembersPage(page)}
        />
      </CardFooter>
    </Card>
  );
}

export default ProjectTeamTable;
