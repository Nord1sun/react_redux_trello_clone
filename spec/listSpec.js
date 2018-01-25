require('./config');
const { User, Board, List } = require('./../models');

describe('List', () => {
  let board1, list1, list2;

  beforeEach((done) => {
    User.create({ fullName: 'Foo Bar', email: 'foobar@gmail.com', password: 'password1' })
      .then(user => {
        return Board.create({ title: 'Some title', UserId: user.id });
      })
      .then(board => {
        board1 = board;
        return List.create({ title: 'list1', BoardId: board1.id });
      })
      .then(list => {
        list1 = list;
        return List.create({ title: 'list2', BoardId: board1.id });
      })
      .then(list => {
        list2 = list;
        return List.create({ title: 'list3', BoardId: board1.id });
      })
      .then(() => {
        done();
      })
      .catch(e => done.fail(e));
  });

  it('sets the order number automatically', () => {
    expect(list1.orderNum).toEqual(1);
    expect(list2.orderNum).toEqual(2);
  });
});
