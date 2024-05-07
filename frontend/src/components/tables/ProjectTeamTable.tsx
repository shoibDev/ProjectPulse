// Import React and any necessary types
import React, { useMemo, useState } from 'react';
import { User } from '../../utils/types'
import { Button, Card, CardFooter, CardHeader, Col, DropdownItem, DropdownMenu, DropdownToggle, Media, Modal, ModalHeader, Row, Table, UncontrolledDropdown } from 'reactstrap';
import PaginationComponent from './PaginationComponent';

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


  const [totalTeamMembers, setTotalTeamMembers] = useState(0);
  const [currentTeamMembersPage, setCurrentTeamMembersPage] = useState(1);
  const teamMembersPerPage = 6;

  //pagination for team table
  const teamMembersData = useMemo(() => {
    let computedTeamMembers = projectTeam;

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
                {/* <AddTeamMember
                  projectId={projectId}
                  toggle={toggleNewMember}
                  setProjectTeam={setProjectTeam}
                /> */}
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
                  <UncontrolledDropdown>
                    <DropdownToggle
                      className="btn-icon-only text-light"
                      href="#pablo"
                      role="button"
                      size="sm"
                      color=""
                      onClick={(e) => e.preventDefault()}
                    >
                      <i className="fas fa-ellipsis-v" />
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-arrow" right>
                      {/* <DropdownItem
                        onClick={() =>
                          removeTeamMember(projectId, user.user_id)
                        }
                      >
                        Remove Team Member
                      </DropdownItem> */}
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
