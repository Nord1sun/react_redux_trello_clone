import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardBody, Input } from 'reactstrap';
import ListCardContainer from '../containers/ListCardContainer';
import NewCardFormContainer from '../containers/NewCardFormContainer';
import DeleteListModalContainer from '../containers/DeleteListModalContainer';
import Sortable from 'react-sortablejs';

class List extends PureComponent {
  constructor() {
    super();
    this.state = {
      isDeleteModalOpen: false
    };
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
  }

  toggleDeleteModal(e) {
    if (e) e.preventDefault();
    this.setState({
      isDeleteModalOpen: !this.state.isDeleteModalOpen
    });
  }

  componentDidUpdate() {
    const copies = document.getElementsByClassName('copy');
    for (let copy of copies) {
      copy.remove();
    }

    const cards = document.getElementsByClassName('ListCard');
    for (let card of cards) {
      if (card.style.display === 'none') {
        card.style.display = 'block';
      }
    }
  }

  onSortChange(order, sortable, e) {
    const fromListId = e.from.parentElement.id;
    const toListId = e.to.parentElement.id;

    if (e.item.style.display !== "none") {
      const clone = e.item.cloneNode(true);
      clone.className += " copy";
      e.item.setAttribute("style", "display: none");

      if (fromListId === toListId && e.oldIndex < e.newIndex) {
        e.to.insertBefore(clone, e.to.children[e.newIndex + 1]);
      } else {
        e.to.insertBefore(clone, e.to.children[e.newIndex]);
      }
    } else {
      this.props.moveCard({
        fromListId,
        toListId,
        cardId: e.item.id,
        orderNum: e.newIndex + 1
      });
    }
  }

  render() {
    const { list, updateTitle, selectedBoard } = this.props;

    return (
      <Card className="List" id={list.id}>
        <CardHeader>
          <Input
            type="textarea"
            rows="1"
            className="TitleInput"
            defaultValue={list.title}
            onBlur={(e) => updateTitle(list.id, e)}
            disabled={selectedBoard.notOwned}
          />
          <a href="/" className="DeleteList" onClick={this.toggleDeleteModal}>X</a>
        </CardHeader>
        <CardBody className="ListBody">
          <div ref={body => this.listBody = body} className="list-body" id={list.id} key={list.id}>
            <Sortable
              options={{ group: 'cards', animation: 150, draggable: '.ListCard' }}
              onChange={this.onSortChange}
            >
              {list.Cards.map(card =>
                <ListCardContainer key={card.id} card={card}/>
              )}
            </Sortable>
          </div>
        </CardBody>
        <NewCardFormContainer list={list}/>
        <DeleteListModalContainer
          list={list}
          toggle={this.toggleDeleteModal}
          isOpen={this.state.isDeleteModalOpen}
        />
      </Card>
    );
  }
}

List.propTypes = {
  list: PropTypes.object.isRequired,
  updateTitle: PropTypes.func.isRequired,
  deleteList: PropTypes.func.isRequired,
  selectedBoard:PropTypes.object.isRequired,
  moveCard: PropTypes.func.isRequired
};

export default List;
