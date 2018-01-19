import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import List from '../List';

class Board extends PureComponent {
  render() {
    const { board } = this.props;

    const lists = board ? board.Lists.map(list => {
      return <List key={list.id} list={list}/>;
    }) : null;

    return (
      <div className="Board row justify-content-left">
        {lists}
      </div>
    );
  }
}

Board.propTypes = {
  board: PropTypes.object.isRequired
};

export default Board;
