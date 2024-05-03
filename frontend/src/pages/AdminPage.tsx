import{
  Table,
}from "reactstrap";


const AdminPage = () => {
  const tableStyle = {

    border: '2px solid black' // Adjust the color and width as needed
  };

  const cellStyle = {
    border: '1px solid black', // This styles the individual table cells
    padding: '8px', // Adds padding inside the cells
    textAlign: 'center' // Centers the text inside the cells
  };

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={cellStyle}>Header 1</th>
          <th style={cellStyle}>Header 2</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={cellStyle}>Data 1</td>
          <td style={cellStyle}>Data 2</td>
        </tr>
      </tbody>
    </table>
  );
};


export default AdminPage
