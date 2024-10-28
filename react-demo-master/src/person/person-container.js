import React from 'react';
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import {
    Button,
    Card,
    CardHeader,
    Col,
    Modal,
    ModalBody,
    ModalHeader,
    Row
} from 'reactstrap';
import PersonForm from "./components/person-form";
import * as API_USERS from "./api/person-api";
import PersonTable from "./components/person-table";

class PersonContainer extends React.Component {
    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.toggleDeleteConfirmation = this.toggleDeleteConfirmation.bind(this);
        this.reload = this.reload.bind(this);
        this.handleDeletePerson = this.handleDeletePerson.bind(this);

        this.state = {
            selected: false,
            tableData: [],
            isLoaded: false,
            errorStatus: 0,
            error: null,
            selectedPersonId: null, // ID of the person to delete
            deleteConfirmation: false // Control for delete confirmation modal
        };
    }

    componentDidMount() {
        this.fetchPersons();
    }

    fetchPersons() {
        return API_USERS.getPersons((result, status, err) => {
            if (result !== null && status === 200) {
                this.setState({
                    tableData: result,
                    isLoaded: true
                });
            } else {
                this.setState(({ errorStatus: status, error: err }));
            }
        });
    }

    toggleForm() {
        this.setState({ selected: !this.state.selected });
    }

    reload() {
        this.setState({ isLoaded: false });
        this.toggleForm();
        this.fetchPersons();
    }

    toggleDeleteConfirmation(personId) {
        this.setState({
            deleteConfirmation: !this.state.deleteConfirmation,
            selectedPersonId: personId // Set the person ID to delete
        });
    }

    handleDeletePerson() {
        const { selectedPersonId } = this.state;
        if (selectedPersonId) {
            API_USERS.deletePerson(selectedPersonId, (result, status, err) => {
                if (status === 204) { // Assuming 204 No Content on successful deletion
                    console.log("Successfully deleted person with id:", selectedPersonId);
                    this.setState(prevState => ({
                        tableData: prevState.tableData.filter(person => person.id !== selectedPersonId),
                        deleteConfirmation: false // Close the delete confirmation modal
                    }));
                } else {
                    console.error("Failed to delete person", err);
                    this.setState(({ errorStatus: status, error: err }));
                }
            });
        }
    }

    render() {
        return (
            <div>
                <CardHeader>
                    <strong> Person Management </strong>
                </CardHeader>
                <Card>
                    <br />
                    <Row>
                        <Col sm={{ size: '8', offset: 1 }}>
                            <Button color="primary" onClick={this.toggleForm}>Add Person</Button>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col sm={{ size: '8', offset: 1 }}>
                            {this.state.isLoaded && 
                                <PersonTable 
                                    tableData={this.state.tableData} 
                                    onDelete={this.toggleDeleteConfirmation} // Pass the delete function
                                />}
                            {this.state.errorStatus > 0 && 
                                <APIResponseErrorMessage
                                    errorStatus={this.state.errorStatus}
                                    error={this.state.error}
                                />}
                        </Col>
                    </Row>
                </Card>

                <Modal isOpen={this.state.selected} toggle={this.toggleForm} className={this.props.className} size="lg">
                    <ModalHeader toggle={this.toggleForm}> Add Person: </ModalHeader>
                    <ModalBody>
                        <PersonForm reloadHandler={this.reload} />
                    </ModalBody>
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal isOpen={this.state.deleteConfirmation} toggle={() => this.toggleDeleteConfirmation(null)}>
                    <ModalHeader toggle={() => this.toggleDeleteConfirmation(null)}>Confirm Deletion</ModalHeader>
                    <ModalBody>
                        <p>Are you sure you want to delete this person?</p>
                        <Button color="danger" onClick={this.handleDeletePerson}>Delete</Button>
                        <Button color="secondary" onClick={() => this.toggleDeleteConfirmation(null)}>Cancel</Button>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default PersonContainer;
