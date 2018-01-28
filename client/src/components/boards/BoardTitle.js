import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Input, Button, Alert } from 'reactstrap';
import Loader from '../elements/Loader';

class TitleForm extends Component {
  render() {
    const { toggleTitleForm, isFormVisible, selectedBoard,
      updateTitle, error, isFetching } = this.props;
    return (
      <div>
        {error ? <Alert color="danger">{error}</Alert> : null}
        {isFetching
          ? <Loader />
          : (
            isFormVisible
              ? (
                <Form onSubmit={(e) => updateTitle(selectedBoard, e)}>
                  <FormGroup key={selectedBoard.id}>
                    <Input type="text" name="title" defaultValue={selectedBoard.title}/>
                  </FormGroup>
                  <Button color="success" size="sm" className="form-button">Update</Button>
                  <a href="" onClick={toggleTitleForm}>cancel</a>
                </Form>
              )
              : <a href="" className="title-link" onClick={toggleTitleForm}>{selectedBoard.title}</a>)
        }
      </div>
    );
  }
}

TitleForm.propTypes = {
  selectedBoard: PropTypes.object.isRequired,
  toggleTitleForm: PropTypes.func.isRequired,
  isFormVisible: PropTypes.bool.isRequired,
  updateTitle: PropTypes.func.isRequired,
  error: PropTypes.string,
  isFetching:PropTypes.bool.isRequired
};

export default TitleForm;
