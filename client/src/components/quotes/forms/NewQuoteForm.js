import React, { Component } from 'react';
import {dateFormat} from '../../Formats';
import {getQuoters} from '../FetchCalls'
import DatePicker from "react-datepicker";
import PropTypes from 'prop-types';
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import {
  Button,
  Form,
  Grid,
  Icon,
  Input,
  Popup,
} from 'semantic-ui-react'

const statusList = [
  { value: 'none', label: '' },
  { value: 'submitted', label:'Submitted' },
  { value: 'awarded', label: 'Awarded',  },
  { value: 'dead', label: 'Dead' },
]

const revisionList = [
  {  value: '0', label: '0' },
  {  value: '1', label: '1' },
  {  value: '2', label: '2' },
  {  value: '3', label: '3' },
  {  value: '4', label: '4' },
  {  value: '5', label: '5' },
]


class NewQuoteForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      agency: null,
      bid: {},
      employees: [],
      agencies: [],
      pointsOfContact: [],
      errors: {},
      fields: {},
      // Select option states
      agency: '',
      employee: '',
      poc: '',
      revision: 0,
      status: '',
      //Dates
      receivedDate: 0,
      dueDate: 0,
      dueTime: 0,
      dateSent:0,
      datePO: 0,
    };
  }
  // Input field handler
  handleInputChange = (e) => {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({fields});
  }

  // All the select handlers for the quote form
  handleAgency = (agency) => { this.setState({agency}); console.log(agency);}
  handleEmployee = (employee) => { this.setState({employee}); console.log(employee);}
  handlePOC = (poc) => { this.setState(poc); console.log(poc);}
  handleRevision = (revision) => { this.setState({revision}); console.log(revision);}
  handleStatus = (status) => { this.setState({status}); console.log(status);}

  handleReceived = (receivedDate) => { this.setState({receivedDate}); console.log(receivedDate);}
  handleDueDate = (dueDate) => { this.setState({dueDate}); console.log(dueDate);}
  handleDueTime = (dueTime) => { this.setState({dueTime}); console.log(dueTime);}
  handleDateSent = (dateSent) => { this.setState({dateSent}); console.log(dateSent);}
  handleDatePO = (datePO) => { this.setState({datePO}); console.log(datePO);}

  //Add new agency to the database
  addAgency = () => {
    fetch('api/dropdowns/agencies', {
      method: 'post',
      headers: {'Content-Type': 'aplication/json'},
      body: JSON.stringify({})
    })
    .then(res => res.json())
    .then(res => {
      this.setState({});
    });
  };

  // Add a new bid to the database
  handleAddQuote = () => {
    fetch('api/quote/open_bids', {
      method: 'post',
      headers: {'Content-Type': 'aplication/json'},
      body: JSON.stringify({})
    })
    .then(res => res.json())
    .then(res => {
      this.setState({});
    });
  };

  getQuoteNumber = () => {
    fetch('/api/quote/open_bids/quote')
    .then(res => res.json())
    .then(q => {
      console.log("Not clean:", q);
      this.state.fields.quote_number = q[0].quote;
      console.log("quote", this.state.fields.quote_number);
    });
  }

  // Gets a single bid with id
  getSingleBid = (id, agency, employee, poc, revision) => {
    let url = ('/api/quote/open_bids/id/?id=' + id);
    fetch(url)
    .then(res => res.json())
    .then(data => {
      this.setState({bid:data});
      console.log("bid details", this.state.bid);
      this.state.fields.quote_number = this.state.bid[0].quote;
      agency = this.state.bid[0].agency;
      poc = this.state.bid[0].point_of_contact;
      this.state.fields.solicitation = this.state.bid[0].solicitation;
      revision = this.state.bid[0].revision;
      employee = this.state.bid[0].employee;
      this.state.fields.received = dateFormat(this.state.bid[0].received_date);
      this.state.fields.description = this.state.bid[0].description;
      this.state.fields.status = this.state.bid[0].status;
      this.state.fields.due_date = this.state.bid[0].due_time;
      this.state.fields.due_time = dateFormat(this.state.bid[0].due_date);
      this.state.fields.date_sent = dateFormat(this.state.bid[0].date_sent);
    });
  };

  getAgencies = () => {
    fetch('/api/dropdowns/agencies')
    .then(res => res.json())
    .then(res => {
      let agencyList = res.map(r => ({label: r.agency, value: r.agency}));
      this.setState({agencies:agencyList});
    })
  }

  getContacts = () => {
    fetch('/api/dropdowns/poc')
    .then(res => res.json())
    .then(res => {
      let contacts = res.map(r => ({label: r.point_of_contact, value: r.point_of_contact}));
      this.setState({pointsOfContact:contacts});
    })
  }

  getQuoters = () => {
    fetch('/api/users/quoters')
    .then(res => res.json())
    .then(res => {
      let employeeList = res.map(r => ({label: r.first_name, value: r.first_name}));
      this.setState({employees:employeeList});
    })
  }

  chooseAction = () => {
    if (this.props.edit === 'tue') {
      this.getSingleBid(this.props.id);
    }
    if (this.props.new === 'new quote')  {
      this.getQuoteNumber(this.state.fields.quote_number);
    }
  }

  componentDidMount () {
    this.chooseAction();
    this.getAgencies();
    this.getContacts();
    this.getQuoters();
    console.log('Quotes Form mounted');
  }

  render() {
    const {employees, id, agencies, pointsOfContact, agency, status,poc} = this.state;
    const style = {
        form : { left: '15%', height:'80%', width: '80%'},
        button:{ flex: 1, flexDirection: 'row', alignItems: 'center'},
        popup: { height: '70px', width: '600px' }
    };
    return (
      <div>
      <Popup style={style.popup} position='bottom left' trigger={<Button icon='plus' content='New Agency'/>} on='click'>
        <Grid divided columns='equal'>
         <Grid.Column>
            <Input fluid placeholder='...'/>
         </Grid.Column>
         <Grid.Column>
            <Button onClick={this.addAgency}> Submit</Button>
         </Grid.Column>
        </Grid>
      </Popup>
      <br/>
      <br/>
        <div>{this.props.id} </div>
      <Grid.Row centered>
        <Form style={style.form} onSubmit={this.submitForm}>
         <Form.Group>
           <Form.Field required width={5}>
             <label>Quote Number</label>
             <Input
              placeholder='Quote Number'
              name='quote_number'
              type='text'
              value={this.state.fields.quote_number}
              onChange={this.handleInputChange}
             />
           </Form.Field>
           <Form.Field required width={5}>
             <label>Agency</label>
             <Select fluid placeholder='Agency'
             name='agency'
             options={agencies}
             value={agency}
             onChange={this.handleAgency}
             />
           </Form.Field>
           <Form.Field required width={5}>
             <label>Point of Contact</label>
             <Select
             placeholder='Point of Contact'
             name='point_of_contact'
             options={pointsOfContact}
             value={poc}
             onChange={this.handlePOC}
             />
           </Form.Field>
         </Form.Group>

         <Form.Group >
           <Form.Field required width={6} >
             <label>Solicitation</label>
             <Input placeholder='Solicitation Number'
               name='solicitation'
               value={this.state.fields.solicitation}
               onChange={this.handleInputChange}
             />
           </Form.Field>
           <Form.Field width={2}>
             <label>Revision</label>
             <Select
             compact
             options={revisionList}
             defaultValue= '0'
             name='revision'
             value={this.state.fields.revision}
             onChange={this.handleRevision}
             />
           </Form.Field>
           <Form.Field required width={7}>
             <label>Employee</label>
              <Select
               placeholder=''
               name='employee'
               type='text'
               options={employees}
               value={this.state.fields.employee}
               onChange={this.handleEmployee}
              />
           </Form.Field>
         </Form.Group>

         <Form.Group >
           <Form.Field required width={5}>
             <label>Received</label>
             <DatePicker
               selected={this.state.receivedDate}
               onChange={this.handleReceived}
             />
           </Form.Field>
           <Form.Field required width={5}>
             <label>Description</label>
             <Input fluid placeholder='Description'
               name='description'
               value={this.state.fields.description}
               onChange={this.handleInputChange}
             />
           </Form.Field>
           <Form.Field required width={5}>
             <label>Status</label>
             <Select
               options={statusList}
               defaultValue= ' '
               name='status'
               value={status}
               onChange={this.handleStatus}
             />
           </Form.Field>
         </Form.Group>

         <Form.Group >
           <Form.Field required width={5}>
             <label>Due Date</label>
              <DatePicker
                selected={this.state.dueDate}
                onChange={this.handleDueDate}
              />
           </Form.Field>
           <Form.Field required width={5}>
             <label>Due Time</label>
             <DatePicker
               selected={this.state.dueTime}
               onChange={this.handleDueTime}
               showTimeSelect
               dateFormat="Pp"
             />
           </Form.Field>
           <Form.Field width={5}>
             <label>Date Sent</label>
             <DatePicker
               selected={this.state.dateSent}
               onChange={this.handleDateSent}
             />
            </Form.Field>
         </Form.Group>

         <Form.Group >
           <Form.Field width={5}>
             <label>Date PO Received</label>
             <DatePicker
               selected={this.state.datePO}
               onChange={this.handleDatePO}
             />
           </Form.Field>
           <Form.Field width={5}>
             <label>PO Number</label>
             <Input fluid placeholder='PO Number'
             name='po_number'
             value={this.state.fields.po_number}
             onChange={this.handleInputChange}
             />
           </Form.Field>
           <Form.Field width={5}>
             <label>Comments</label>
             <Input fluid placeholder='Comments'
             name='comments'
             value={this.state.fields.comments}
             onChange={this.handleInputChange}
             />
           </Form.Field>
         </Form.Group>
        </Form>
        </Grid.Row>
        <br/>
        <br/>
        <Grid centered>
        <Button primary >
           <Icon name='arrow up'/>
               Submit
        </Button>
        </Grid>
      </div>
    )
  }
}

NewQuoteForm.propTypes = {
  id: PropTypes.Number,
  edit: PropTypes.String,
  new: PropTypes.string
}

export default NewQuoteForm;
