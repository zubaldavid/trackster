import React, { Component } from 'react';
import {
  Button,
  Table
} from 'semantic-ui-react'

const headers = [
  'Invoice', 'Quote Number', 'Point of Contact', 'Solictation', 'Revision','Employee',
  'Received', 'Description', 'Status', 'Due Date','Due Time', 'Date Sent','Date PO',
  'PO Number', 'Comment',
]

class WonBids extends Component {
  render() {
    return (
      <div>
        <Table celled>
          <Table.Header>
            <Table.Row>
              {headers.map(header =>
                <Table.HeaderCell>{header}</Table.HeaderCell>
              )}
            </Table.Row>
          </Table.Header>
          <Table.Body>
          </Table.Body>
        </Table>
      </div>
    )
  }
}

export default WonBids