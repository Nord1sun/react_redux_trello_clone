import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import List from '../List';
import { Card } from 'reactstrap';
import NewListForm from '../NewListForm';

class Board extends PureComponent {
  render() {
    const { board, onNewList, isNewFormOpen, toggleListForm,
      listFormError, updateListTitle, deleteList } = this.props;

    const lists = board ? board.Lists.map(list => {
      return <List key={list.id} list={list} updateTitle={updateListTitle} deleteList={deleteList}/>;
    }) : null;

    return (
      <div className="Board">
        {lists}
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
              <Card className="AddList pull-left">
                Add a list...
              </Card>
            </a>
          )
        }
      </div>
    );
  }
}

Board.propTypes = {
  board: PropTypes.object,
  onNewList: PropTypes.func.isRequired,
  isNewFormOpen: PropTypes.bool.isRequired,
  toggleListForm: PropTypes.func.isRequired,
  listFormError: PropTypes.string,
  updateListTitle: PropTypes.func.isRequired,
  deleteList: PropTypes.func.isRequired
};

export default Board;
