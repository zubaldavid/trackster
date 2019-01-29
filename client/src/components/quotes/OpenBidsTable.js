import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PaginateTables from '../PaginateTables'
import {
  Button,
  Grid,
  Header,
  Icon,
  Menu,
  Pagination,
  Table
} from 'semantic-ui-react'

const headers = [
  'QuoteNumber','Agency', 'Solictation', 'Revision', 'Point of Contact','Employee',
  'Received', 'Description', 'Status', 'Due Date','Due Time', 'Date Sent','Date PO',
  'PO Number'
]

function TableHeader(props) {
  return (
    <Table.Header>
      <Table.Row>
        {headers.map(header =>
          <Table.HeaderCell>{header}</Table.HeaderCell>
        )}
      </Table.Row>
    </Table.Header>
  )
}


class OpenBidsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allQuotes: [],
      currentQuotes: [],
      currentPage: null,
      totalPages: null
    };
  }

  compontentDidMount () {
    this.getQuotesList();
    console.log('Open Bids Table did mount.');
  }

  getQuotesList = () => {
    fetch('/api/openQ_bids')
    .then(res => res.json())
    .then(data => {
      this.setState({allQuotes:data});
      console.log("state", this.state.allQuotes)
    })
  }

  onPageChanged = (data) => {
    const { allQuotes} = this.state;
    const { currentPage, totalPages, pageLimit } = data;

    const offset = (currentPage - 1) * pageLimit;
    const currentQuotes = allQuotes.slice(offset, offset + pageLimit);

    this.setState({ currentPage, currentQuotes, totalPages });
  };

  render() {
    const {allQuotes, currentQuotes, currentPage, totalPages} = this.state;
    const limit = 25;
    const totalQuotes = allQuotes.length;
    const numberPages = totalQuotes / limit;
  //  if(totalQuotes === 0) return NULL;

    const style = {
        edit: { marginLeft:'4%'},
        table: {width: '92%'},
        grid : {float: 'right'}
    };
    return (
      <div>
      <Button onClick={this.getQuotesList}>Get</Button>
        <Grid style={style.grid}>
          <PaginateTables
            data={totalQuotes}
            pageSize={25}
            startingPage={1}
          />
          <Header> Total Pages: {totalQuotes}</Header>
          <Header> Pages {currentPage} / {totalPages}</Header>
        </Grid>
      <Table compact size='small'>
        <TableHeader/>
          <Table.Body>
            {currentQuotes.map(q =>
              <Table.Row key={q.id}>
                <Table.Cell>{q.quote}</Table.Cell>
                <Table.Cell>{q.agency}</Table.Cell>
                <Table.Cell>{q.solicitation}</Table.Cell>
                <Table.Cell>{q.revision}</Table.Cell>
                <Table.Cell>{q.point_of_contact}</Table.Cell>
                <Table.Cell>{q.employee}</Table.Cell>
                <Table.Cell>{q.received_date}</Table.Cell>
                <Table.Cell>{q.description}</Table.Cell>
                <Table.Cell>{q.status}</Table.Cell>
                <Table.Cell>{q.due_date}</Table.Cell>
                <Table.Cell>{q.due_time}</Table.Cell>
                <Table.Cell>{q.sent_date}</Table.Cell>
                <Table.Cell>{q.po_receive_date}</Table.Cell>
                <Button style={style.edit}><Icon name='edit'/></Button>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    )
  }
}

export default OpenBidsTable
