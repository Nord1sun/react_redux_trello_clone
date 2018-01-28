import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sortable from 'sortablejs';
import ListContainer from '../../containers/lists/ListContainer';
import NewListFormContainer from '../../containers/lists/NewListFormContainer';

class Board extends Component {
  constructor() {
    super();
    this.setListDrag = this.setListDrag.bind(this);
  }

  componentDidUpdate() {
    this.setListDrag();
  }

  setListDrag() {
    Sortable.create(this.lists, {
      draggable: ".List",
      onEnd: (e) => {
        const boardId = e.from.id;
        const listId = e.item.id;
        const orderNum = e.newIndex + 1;
        this.props.reorderLists(boardId, listId, orderNum);
      }
    });
  }

  render() {
    const { board } = this.props;

    if (board) {
      return (
        <div className="Board">
          <div className="lists" ref={(lists) => { this.lists = lists; }} id={board.id}>
            {board.Lists.map(list => <ListContainer key={list.id} list={list}/>)}
          </div>
          <NewListFormContainer />
        </div>
      );
    } else {
      return <p className="text-center light-text">
        You have no boards yet. Click new board in the navigation to create one.
      </p>;
    }
  }
}

Board.propTypes = {
  board: PropTypes.object,
  reorderLists: PropTypes.func.isRequired
};

export default Board;
