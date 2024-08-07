import { useEffect, useMemo, useState } from 'react';
import api from '../../utils/API'
import { Ticket } from '../../utils/types'
import PaginationComponent from "./PaginationComponent";
import { Link } from 'react-router-dom';
import { Card, CardBody, CardFooter, CardHeader, Table } from 'reactstrap';
import ProjectCellName from "./ProjectCellName.tsx";


const TicketsTable = () => {
  const [userTickets, setUserTickets] = useState<Ticket[]>([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [currentTicketsPage, setCurrentTicketsPage] = useState(1);
  const ticketsPerPage = 10;


  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.getTickets();
        console.log(response)
        setUserTickets(response);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, []);

  const ticketsData = useMemo(() => {
    const computedTickets = userTickets;

    setTotalTickets(computedTickets.length);

    return computedTickets.slice(
      (currentTicketsPage - 1) * ticketsPerPage,
      (currentTicketsPage - 1) * ticketsPerPage + ticketsPerPage
    );
  }, [userTickets, currentTicketsPage]);

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'immediate':
        return 'bg-purple-600 text-white'; // Distinctive purple for the most urgent tickets
      case 'high':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-black';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-200 text-gray-800'; // Fallback for undefined or other priorities
    }
  };


  return (
      <div className="p-3 mb-2 bg-light text-dark z-20 -mt-12 w-full">
        <Card className="shadow p-3 mb-5 rounded bg-white">
          <CardHeader className="border-0 d-flex justify-content-between align-items-center bg-white">
            <h6 className="mb-2">Tickets</h6>
          </CardHeader>
          <CardBody>
            <Table>
              <thead className="rounded border-t-2 border-b-2">
              <tr>
                <th>Project Name</th>
                <th>Ticket Name</th>
                <th>Ticket Description</th>
                <th>Ticket Priority</th>
              </tr>
              </thead>
              <tbody>
              {ticketsData.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>
                      <Link to={`/project/${ticket.projectId}`} style={{ textDecoration: 'none', color: '#D6A2E8' }}>
                        <ProjectCellName projectId={ticket.projectId} />
                      </Link>
                    </td>
                    <td>{ticket.title}</td>
                    <td>{ticket.description}</td>
                    <td>
                  <span className={`inline-block text-xs px-2 rounded-full uppercase font-semibold tracking-wide mr-2 mb-2 ${getPriorityClass(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                    </td>
                  </tr>
              ))}
              </tbody>
            </Table>
            <CardFooter className="py-4 bg-white flex justify-center">
              <PaginationComponent
                  total={totalTickets}
                  itemsPerPage={ticketsPerPage}
                  currentPage={currentTicketsPage}
                  onPageChange={(page) => setCurrentTicketsPage(page)}
              />
            </CardFooter>
          </CardBody>
        </Card>
      </div>
  );
}

export default TicketsTable
