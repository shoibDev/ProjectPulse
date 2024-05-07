import React, { useState, useMemo } from "react";
import { Ticket, User} from "../../utils/types";

// reactstrap components
import {
  Card,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Table,
  Button,
  Row,
  Col,
  Container,
  Modal,
  ModalHeader,
  CardFooter,
} from "reactstrap";

import PaginationComponent from "./PaginationComponent";
// import CreateTicket from "../Forms/CreateTicket";
// import UpdateTicket from "../Forms/UpdateTicket";
import API from "../../utils/API"

interface ProjectTicketsTableProps {
  projectId: number;
  projectTickets: Ticket[];
  setProjectTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  // projectTeam: User[];
  // selectedTicket: Ticket | null;
  // setSelectedTicketId: (ticketId: number | null) => void;
  toggleEditTicket: () => void;
  toggleCreateTicket: () => void;
  isEditTicketOpen: boolean;
  isNewTicketOpen: boolean;
  // assignedDevs: Developer[]; // Uncomment and define Developer type if you use this
}

const ProjectTicketsTable: React.FC<ProjectTicketsTableProps> = ({
  projectId,
  projectTickets,
  setProjectTickets,
  //projectTeam,
  // selectedTicket,
  // setSelectedTicketId,
  toggleEditTicket,
  toggleCreateTicket,
  isEditTicketOpen,
  isNewTicketOpen,
  // assignedDevs,
}) => {


    //pagination
    const [totalTickets, setTotalTickets] = useState(0);
    const [currentTicketPage, setCurrentTicketPage] = useState(1);
    const ticketsPerPage = 6;
  
    //pagination for tickets table
    const ticketsData = useMemo(() => {
      let computedTickets = projectTickets;
  
      setTotalTickets(computedTickets.length);
  
      //current page slice
      return computedTickets.slice(
        (currentTicketPage - 1) * ticketsPerPage,
        (currentTicketPage - 1) * ticketsPerPage + ticketsPerPage
      );
    }, [projectTickets, currentTicketPage]);
  
  // Component implementation will go here
  return (
    <Card className="shadow">
      <CardHeader>
        <Row className="align-items-center">
          <Col>
            <h3 className="mb-0">Tickets</h3>
          </Col>
          <Col>
            <div className="col text-right">
              <Button color="primary" onClick={toggleCreateTicket} size="sm">
                New Ticket
              </Button>

              <Modal isOpen={isNewTicketOpen} toggle={toggleCreateTicket}>
                <Container className="m-4 align-self-center" fluid>
                  <ModalHeader toggle={toggleCreateTicket}>
                    Create Ticket
                  </ModalHeader>
                  {/* <CreateTicket
                    team={projectTeam}
                    toggle={toggleCreateTicket}
                    setProjectTickets={setProjectTickets}
                  /> */}
                </Container>
              </Modal>
            </div>
          </Col>
        </Row>
      </CardHeader>
      <Table className="align-items-center table-flush" responsive>
        <thead className="thead-light">
          <tr>
            <th scope="col">Ticket Title</th>
            <th scope="col">Description</th>
            <th scope="col">Ticket Author</th>
            <th scope="col" />
          </tr>
        </thead>
        <tbody>
          {ticketsData.map((ticket) => {
            return (
              <tr
                key={ticket.id}
                id={ticket.id}
                className="ticketRow"
                // onClick={() => {
                //   setSelectedTicketId(ticket.id);
                // }}
              >
                <th>
                  <Media>{ticket.title}</Media>
                </th>
                <td
                  style={{
                    whiteSpace: "unset",
                    wordWrap: "break-word",
                  }}
                >
                  {ticket.description}
                </td>
                <td key={ticket.assignedUserId}>
                  {ticket.creator} 
                  {/* {ticket.last_name} */}
                </td>
                <td className="text-right">
                  <UncontrolledDropdown>
                    <DropdownToggle
                      className="btn-icon-only text-light"
                      role="button"
                      size="sm"
                      color=""
                      onClick={() => {
                        setSelectedTicketId(ticket.id);
                      }}
                    >
                      <i className="fas fa-ellipsis-v" />
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-arrow" right>
                      <DropdownItem onClick={toggleEditTicket}>
                        Edit Ticket
                      </DropdownItem>

                      {/* <DropdownItem
                        onClick={() => {
                          deleteTicket(ticket.id);
                        }}
                      >
                        Remove Ticket
                      </DropdownItem> */}
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </td>
              </tr>
            );
          })}

          <Modal isOpen={isEditTicketOpen} toggle={toggleEditTicket}>
            <Container className="m-4 align-self-center" fluid>
              <ModalHeader toggle={toggleEditTicket}>Edit Ticket</ModalHeader>
              {/* <UpdateTicket
                team={projectTeam}
                ticketData={selectedTicket}
                toggle={toggleEditTicket}
                setProjectTickets={setProjectTickets}
                assignedDevs={assignedDevs}
              /> */}
            </Container>
          </Modal>
        </tbody>
      </Table>
      <CardFooter>
        <PaginationComponent
          total={totalTickets}
          itemsPerPage={ticketsPerPage}
          currentPage={currentTicketPage}
          onPageChange={(page) => setCurrentTicketPage(page)}
        />
      </CardFooter>
    </Card>
  );
};


export default ProjectTicketsTable
