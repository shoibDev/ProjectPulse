import { useEffect, useState } from 'react';
import api from '../../utils/API'
import { Ticket } from '../../utils/types'
import PaginationComponent from "./PaginationComponent";
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Table } from 'reactstrap';


const TicketsTable = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [ticketsPerPage] = useState(15);


  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.getTickets();
        console.log(response)
        setTickets(response);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, []);

  // Pagination
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-3 mb-2 bg-light text-dark z-20 -mt-12 w-full">
      <Card className="shadow p-3 mb-5 rounded bg-white">
        <CardHeader className="border-0 d-flex justify-content-between align-items-center">
          <h3 className="mb-2">Tickets</h3>
        </CardHeader>
        <CardBody>
          <Table>
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Ticket Name</th>
                <th>Ticket Description</th>
                <th>Ticket Author</th>
              </tr>
            </thead>
            <tbody>
              {currentTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>
                    <Link to={`/protected/home/projectview/${ticket.projectId}`}>
                      {ticket.projectId}
                    </Link>
                  </td>
                  <td>{ticket.title}</td>
                  <td>{ticket.description}</td>
                  <td>{ticket.creator}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <ul className="pagination">
        {Array.from({ length: Math.ceil(tickets.length / ticketsPerPage) }).map((_, index) => (
          <li key={index}>
            <button onClick={() => paginate(index + 1)}>{index + 1}</button>
          </li>
        ))}
      </ul>
        </CardBody>
      </Card>
    </div>
  )
}

export default TicketsTable
