require('./config');
const app = require('../server');
const request = require('request');
const { User, Board, List } = require('./../models');

describe('Lists', () => {
  const apiUrl = 'http://localhost:3001/api/v1/lists';
  let server, user1, user2, board1, list1;

  beforeAll(done => {
    server = app.listen(8888, () => {
      done();
    });
  });

  afterAll(done => {
    server.close();
    server = null;
    done();
  });

  beforeEach(async (done) => {
    User.create({ fullName: 'Foo Bar', email: 'foobar@gmail.com', password: 'password1' })
      .then(result => {
        user1 = result;
        return User.create({ fullName: 'Bob', email: 'foobar@example.com', password: 'password1' });
      })
      .then(result => {
        user2 = result;
        return Board.create({ title: 'board1', UserId: user1.id });
      })
      .then(board => {
        board1 = board;
        return List.create({ title: 'list1', description: 'lorem ipsum dolor', BoardId: board1.id });
      })
      .then(list => {
        list1 = list;
        return List.create({ title: 'list2', description: 'lorem ipsum dolor', BoardId: board1.id });
      })
      .then(() => {
        done();
      })
      .catch(e => console.error(e));
  });

  describe('POST lists', () => {
    it('creates a new board with a valid token', (done) => {
      const body = { BoardId: board1.id, title: 'New List' };
      request({
        url: `${ apiUrl }?token=${ user1.token }`,
        method: 'POST',
        json: body
      }, async (err, response) => {
        expect(response.statusCode).toBe(200);
        try {
          const lists = await board1.getLists();
          expect(lists[lists.length - 1].title).toEqual('New List');
          expect(lists.length).toEqual(3);
          done();
        } catch (e) {
          console.error(e.stack);
          done.fail();
        }
      });
    });

    it('does not create a board if there is no token', (done) => {
      const body = { BoardId: board1.id, title: 'New List' };
      request({
        url: apiUrl,
        method: 'POST',
        json: body
      }, async (err, response) => {
        expect(response.statusCode).toBe(403);
        try {
          const lists = await board1.getLists();
          expect(lists.length).toEqual(2);
          done();
        } catch (e) {
          console.error(e.stack);
          done.fail();
        }
      });
    });

    it('does not create a board if the token in invalid', (done) => {
      const body = { BoardId: board1.id, title: 'New List' };
      request({
        url: `${ apiUrl }?token=nlknlk1123`,
        method: 'POST',
        json: body
      }, async (err, response) => {
        expect(response.statusCode).toBe(404);
        try {
          const lists = await board1.getLists();
          expect(lists.length).toEqual(2);
          done();
        } catch (e) {
          console.error(e.stack);
          done.fail();
        }
      });
    });

    it('does not create a board if there is title', (done) => {
      const body = { BoardId: board1.id, title: '' };
      request({
        url: `${ apiUrl }?token=${ user1.token }`,
        method: 'POST',
        json: body
      }, async (err, response) => {
        expect(response.statusCode).toBe(400);
        try {
          const lists = await board1.getLists();
          expect(lists.length).toEqual(2);
          done();
        } catch (e) {
          console.error(e.stack);
          done.fail();
        }
      });
    });
  });
});
