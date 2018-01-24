import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ListContainer from '../../containers/ListContainer';
import { Card } from 'reactstrap';
import NewListForm from '../NewListForm';

class Board extends PureComponent {
  render() {
    const { board, onNewList, isNewFormOpen, toggleListForm,
      listFormError, updateListTitle, deleteList } = this.props;

    const lists = board ? board.Lists.map(list => {
      return <ListContainer key={list.id} list={list} updateTitle={updateListTitle} deleteList={deleteList}/>;
    }) : null;

    if (board) {
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
              <a
                href=""
                className={board && board.Lists.length ? "add-list shift-down" : "add-list"}
                onClick={toggleListForm}
              >
                <Card className="AddList pull-left">
                  Add a list...
                </Card>
              </a>
            )
          }
        </div>
      );
    } else {
      return <p className="text-center light-text">You have no boards yet. Click new board in the navigation to create one.</p>;
    }
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
