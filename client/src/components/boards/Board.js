import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sortable from 'sortablejs';
import ListContainer from '../../containers/ListContainer';
import { Card } from 'reactstrap';
import NewListForm from '../NewListForm';

class Board extends Component {
  constructor(props) {
    super(props);
    this.setListDrag = this.setListDrag.bind(this);
  }

  componentDidUpdate() {
    this.setListDrag();
  }

  setListDrag() {
    Sortable.create(this.lists, {
      onEnd: (e) => {
        const boardId = e.from.id;
        const listId = e.item.id;
        const orderNum = e.newIndex + 1;
        this.props.reorderLists(boardId, listId, orderNum);
      }
    });
  }

  render() {
    const { board, onNewList, isNewFormOpen, toggleListForm,
      listFormError, updateListTitle, deleteList } = this.props;

    const lists = board ? board.Lists.map(list => {
      return (
        <ListContainer
          key={list.id}
          list={list}
          updateTitle={updateListTitle}
          deleteList={deleteList}/>
      );
    }) : null;

    if (board) {
      return (
        <div className="Board">
          <div
            className="lists"
            ref={(lists) => { this.lists = lists; }}
            id={board.id}>
            {lists}
          </div>
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
  deleteList: PropTypes.func.isRequired,
  reorderLists: PropTypes.func.isRequired
};

export default Board;
