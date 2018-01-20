import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardText } from 'reactstrap';

class ListCard extends PureComponent {
  render() {
    const { card } = this.props;
    return (
      <Card className="ListCard">
        <CardBody>
          <CardText>
            {card.description}
          </CardText>
        </CardBody>
      </Card>
    );
  }
}

ListCard.propTypes = {
  card: PropTypes.object.isRequired
};

export default ListCard;
