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
    it('creates a new list with a valid token', (done) => {
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

    it('does not create a list if there is no token', (done) => {
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

    it('does not create a list if the token in invalid', (done) => {
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

    it('does not create a list if there is no title', (done) => {
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

  describe('PUT lists', () => {
    it('changes the title with a valid token', (done) => {
      const body = { title: 'New Title' };
      request({
        url: `${ apiUrl }/${ list1.id }?token=${ user1.token }`,
        method: 'PUT',
        json: body
      }, async (err, response) => {
        expect(response.statusCode).toBe(200);
        try {
          const list = await List.findById(list1.id);
          expect(list.title).toEqual('New Title');
          done();
        } catch (error) {
          done.fail(error);
        }
      });
    });

    it('does not change the title if there is no token', (done) => {
      const body = { title: 'New Title' };
      request({
        url: `${ apiUrl }/${ list1.id }`,
        method: 'PUT',
        json: body
      }, async (err, response) => {
        expect(response.statusCode).toBe(403);
        try {
          const list = await List.findById(list1.id);
          expect(list.title).toEqual('list1');
          done();
        } catch (error) {
          done.fail(error);
        }
      });
    });

    it('does not change the title if the token in invalid', (done) => {
      const body = { title: 'New Title' };
      request({
        url: `${ apiUrl }/${ list1.id }?token=asdf123`,
        method: 'PUT',
        json: body
      }, async (err, response) => {
        expect(response.statusCode).toBe(404);
        try {
          const list = await List.findById(list1.id);
          expect(list.title).toEqual('list1');
          done();
        } catch (error) {
          done.fail(error);
        }
      });
    });

    it('does not change the title if there is no title in the request body', (done) => {
      request({
        url: `${ apiUrl }/${ list1.id }?token=asdf123`,
        method: 'PUT'
      }, (err, response) => {
        expect(response.statusCode).toBe(400);
        done();
      });
    });

    it('sends an invalid response if the list id param is invalid', (done) => {
      const body = { title: 'New Title' };
      request({
        url: `${ apiUrl }/random?token=${ user1.token }`,
        method: 'PUT',
        json: body
      }, async (err, response) => {
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toEqual('List not found');
        done();
      });
    });
  });
});
