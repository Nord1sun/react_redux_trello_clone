import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardText, CardHeader, CardBody, CardFooter, Input } from 'reactstrap';
import ListCard from './ListCard';


class List extends PureComponent {
  render() {
    const { list, updateTitle } = this.props;
    const cards = list.Cards.map(card => {
      return <ListCard key={card.id} card={card}/>;
    });

    return (
      <Card className="List pull-left">
        <CardHeader>
          <Input
            type="textarea"
            rows="1"
            className="TitleInput"
            onBlur={(e) => updateTitle(list.id, e)}>{list.title}
          </Input>
          <CardText>{list.description}</CardText>
        </CardHeader>
        <CardBody className="ListBody">
          {cards}
        </CardBody>
        <a href="">
          <CardFooter>
            Add a card...
          </CardFooter>
        </a>
      </Card>
    );
  }
}

List.propTypes = {
  list: PropTypes.object.isRequired,
  updateTitle: PropTypes.func.isRequired
};

export default List;
