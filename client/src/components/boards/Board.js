import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import List from '../List';
import { Card } from 'reactstrap';
import NewListForm from '../NewListForm';

class Board extends PureComponent {
  render() {
    const { board, onNewList, isNewFormOpen, toggleListForm, listFormError } = this.props;

    const lists = board ? board.Lists.map(list => {
      return <List key={list.id} list={list}/>;
    }) : null;

    return (
      <div className="Board row justify-content-left">
        {lists}
        <div className="col-sm-3">
          {isNewFormOpen
            ? (
              <NewListForm
                onNewList={onNewList}
                board={board}
                toggle={toggleListForm}
                error={listFormError}
              />
            )
            : (
              <a href="" className="add-list" onClick={toggleListForm}>
                <Card className="AddList">
                  Add a list...
                </Card>
              </a>
            )
          }
        </div>
      </div>
    );
  }
}

Board.propTypes = {
  board: PropTypes.object.isRequired,
  onNewList: PropTypes.func.isRequired,
  isNewFormOpen: PropTypes.bool.isRequired,
  toggleListForm: PropTypes.func.isRequired,
  listFormError: PropTypes.string
};

export default Board;
