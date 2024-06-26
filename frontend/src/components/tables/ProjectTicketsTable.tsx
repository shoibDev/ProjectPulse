import React, { useState, useMemo, useEffect } from "react";
import { Ticket } from "../../utils/types";

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
import api from "../../utils/API";
import CreateTicket from "../forms/CreateTicket";
import UpdateTicket from "../forms/UpdateTicket";

interface ProjectTicketsTableProps {
  projectId: number;
  projectTickets: Ticket[];
  setProjectTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  render: () => void;
  setSelectedTicketId: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const ProjectTicketsTable: React.FC<ProjectTicketsTableProps> = ({
                                                                   projectId,
                                                                   projectTickets,
                                                                   setProjectTickets,
                                                                   render,
                                                                   setSelectedTicketId,
                                                                 }) => {
  const [selectedTicketId, setSelectedTicketIdLocal] = useState<number>();
  const [selectedTicket, setSelectedTicket] = useState<Ticket>({} as Ticket);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [isEditTicketOpen, setIsEditTicketOpen] = useState(false);

  const toggleCreateTicket = () => setIsNewTicketOpen(!isNewTicketOpen);
  const toggleEditTicket = () => setIsEditTicketOpen(!isEditTicketOpen);

  useEffect(() => {
    async function fetchTicket() {
      if (selectedTicketId) {
        const ticket = await api.getTicketById(selectedTicketId);
        setSelectedTicket(ticket);
        setSelectedTicketId(selectedTicketId);
      }
    }
    fetchTicket();
  }, [selectedTicketId]);

  //pagination
  const [totalTickets, setTotalTickets] = useState(0);
  const [currentTicketPage, setCurrentTicketPage] = useState(1);
  const ticketsPerPage = 6;

  //pagination for tickets table
  const ticketsData = useMemo(() => {
    const computedTickets = projectTickets;

    setTotalTickets(computedTickets.length);

    //current page slice
    return computedTickets.slice(
        (currentTicketPage - 1) * ticketsPerPage,
        (currentTicketPage - 1) * ticketsPerPage + ticketsPerPage
    );
  }, [projectTickets, currentTicketPage]);

  const deleteTicket = (id: number | undefined) => {
    api.deleteTicket(id);
    render();
  };

  return (
      <Card className="shadow">
        <CardHeader>
          <Row className="border-0 d-flex justify-content-between align-items-center bg-white">
            <Col>
              <h6 className="mb-0">Tickets</h6>
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
                    <CreateTicket
                        projectId={projectId}
                        toggle={toggleCreateTicket}
                        setProjectTickets={setProjectTickets}
                        render={render}
                    />
                  </Container>
                </Modal>
              </div>
            </Col>
          </Row>
        </CardHeader>
        <Table className="align-items-center table-flush" responsive>
          <thead className="rounded border-t-2 border-b-2">
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
                    onClick={() => {
                      if (ticket.id !== undefined) {
                        setSelectedTicketIdLocal(ticket.id);
                      }
                    }}
                >
                  <th>
                    <Media style={{ textDecoration: 'none', color: '#D6A2E8' }}>{ticket.title}</Media>
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
                  </td>
                  <td className="text-right">
                    <UncontrolledDropdown direction="start">
                      <DropdownToggle
                          className="btn-icon-only text-black bg-transparent border border-gray-300 rounded"
                          role="button"
                          size="sm"
                      >
                        ⋮
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-arrow" right>
                        <DropdownItem onClick={toggleEditTicket}>
                          Edit Ticket
                        </DropdownItem>

                        <DropdownItem
                            onClick={() => {
                              deleteTicket(selectedTicketId);
                            }}
                        >
                          Remove Ticket
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </td>
                </tr>
            );
          })}

          <Modal isOpen={isEditTicketOpen} toggle={toggleEditTicket}>
            <Container className="m-4 align-self-center" fluid>
              <ModalHeader toggle={toggleEditTicket}>Edit Ticket</ModalHeader>
              <UpdateTicket
                  ticket={selectedTicket}
                  toggle={toggleEditTicket}
                  setProjectTickets={setProjectTickets}
                  render={render}
              />
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

export default ProjectTicketsTable;
