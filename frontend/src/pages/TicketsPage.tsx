import Header from "../components/header/Header"
import TicketsTable from "../components/tables/TicketsTable"


const TicketsPage: React.FC = () => {
  return (
    <div>
      <Header title='TICKETS'/>
      <TicketsTable />
    </div>
  )
}

export default TicketsPage
