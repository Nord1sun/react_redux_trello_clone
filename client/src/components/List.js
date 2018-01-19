import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardText, CardHeader, CardBody } from 'reactstrap';


class List extends PureComponent {
  render() {
    const { list } = this.props;
    return (
      <div className="col-sm-4">
        <Card>
          <CardHeader>
            <CardTitle>{list.title}</CardTitle>
            <CardText>{list.description}</CardText>
          </CardHeader>
        </Card>
      </div>
    );
  }
}

List.propTypes = {
  list: PropTypes.object.isRequired
};

export default List;
