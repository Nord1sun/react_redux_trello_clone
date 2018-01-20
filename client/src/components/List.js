import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardText, CardHeader, CardBody, CardFooter } from 'reactstrap';
import ListCard from './ListCard';


class List extends PureComponent {
  render() {
    const { list } = this.props;
    const cards = list.Cards.map(card => {
      return <ListCard key={card.id} card={card}/>;
    });

    return (
      <div className="col-sm-3">
        <Card className="List">
          <CardHeader>
            <CardTitle tag="h6">{list.title}</CardTitle>
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
      </div>
    );
  }
}

List.propTypes = {
  list: PropTypes.object.isRequired
};

export default List;
