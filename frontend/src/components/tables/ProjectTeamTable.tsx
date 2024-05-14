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
}

// Define the component using these props
const ProjectTeamTable: React.FC<ProjectTeamTableProps> = ({
  projectTeam,
  setProjectTeam,
  toggleNewMember,
  isNewMemberOpen,
  projectId
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
        <Row className="align-items-center">
          <Col>
            <h3 className="mb-0">Team</h3>
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
                  />
              </Modal>
            </div>
          </Col>
        </Row>
      </CardHeader>

      <Table className="align-items-center table-flush" responsive>
        <thead className="thead-light">
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
                  <Media>
                    {user.firstName} {user.lastName}
                  </Media>
                </th>
                <td>{user.email}</td>
                <td className="text-right">
                  <UncontrolledDropdown direction="right">
                    <DropdownToggle
                        className="btn-icon-only text-light"
                        href="#pablo"
                        role="button"
                        size="sm"
                        onClick={() => setUserId(user.id)}
                    >
                      ⋯
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-arrow" right>
                      <DropdownItem
                          onClick={() =>
                              api.removeTeamMember(projectId, userId)
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
