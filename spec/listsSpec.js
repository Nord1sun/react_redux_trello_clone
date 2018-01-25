require('./config');
const app = require('../server');
const request = require('request');
const { User, Board, List } = require('./../models');

describe('Lists', () => {
  const apiUrl = 'http://localhost:3001/api/v1/lists';
  let server, user1, user2, board1, board2, list1, list2, list3, list4;

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
        return Board.create({ title: 'board2', UserId: user2.id });
      })
      .then(board => {
        board2 = board;
        return List.create({ title: 'list1', description: 'lorem ipsum dolor', BoardId: board1.id, orderNum: 1 });
      })
      .then(list => {
        list1 = list;
        return List.create({ title: 'list2', description: 'lorem ipsum dolor', BoardId: board2.id, orderNum: 2 });
      })
      .then(list => {
        list2 = list;
        done();
      })
      .catch(e => done.fail(e));
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
          expect(lists.length).toEqual(2);
          done();
        } catch (e) {
          done.fail(e);
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
          expect(lists.length).toEqual(1);
          done();
        } catch (e) {
          done.fail(e);
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
          expect(lists.length).toEqual(1);
          done();
        } catch (e) {
          done.fail(e);
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
          expect(lists.length).toEqual(1);
          done();
        } catch (e) {
          done.fail(e);
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
        url: `${ apiUrl }/${ list1.id }?token=${ user1.token }`,
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
      }, (err, response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual('Invalid ID param');
        done();
      });
    });
  });

  describe('DELETE list', () => {
    it('deletes the list with a valid token and id', (done) => {
      request.delete(`${ apiUrl }/${ list1.id }?token=${ user1.token }`, async (err, response) => {
        expect(response.statusCode).toEqual(200);
        try {
          const listCount = await List.count();
          expect(listCount).toEqual(1);
          done();
        } catch (error) {
          done.fail(error);
        }
      });
    });

    it('does not delete the list if it does not belong to the user', (done) => {
      request.delete(`${ apiUrl }/${ list2.id }?token=${ user1.token }`, async (err, response) => {
        expect(response.statusCode).toEqual(403);
        try {
          const listCount = await List.count();
          expect(listCount).toEqual(2);
          done();
        } catch (error) {
          done.fail(error);
        }
      });
    });

    it('does not delete the list if there is no token', (done) => {
      request.delete(`${ apiUrl }/${ list2.id }`, async (err, response) => {
        expect(response.statusCode).toEqual(403);
        try {
          const listCount = await List.count();
          expect(listCount).toEqual(2);
          done();
        } catch (error) {
          done.fail(error);
        }
      });
    });

    it('does not delete the list if the token is invalid', (done) => {
      request.delete(`${ apiUrl }/${ list2.id }?token=asdf123`, async (err, response) => {
        expect(response.statusCode).toEqual(404);
        try {
          const listCount = await List.count();
          expect(listCount).toEqual(2);
          done();
        } catch (error) {
          done.fail(error);
        }
      });
    });

    it('sends an invalid response if the list id param is invalid', (done) => {
      request.delete(`${ apiUrl }/hello123?token=${ user1.token }`, (err, response) => {
        const result = JSON.parse(response.body);
        expect(response.statusCode).toBe(400);
        expect(result.message).toEqual('Invalid ID param');
        done();
      });
    });
  });

  describe('POST lists/reorder', () => {
    beforeEach(async (done) => {
      List.create({ title: 'list3', description: 'lorem ipsum dolor', BoardId: board1.id, orderNum: 2 })
        .then(result => {
          list3 = result;
          return List.create({ title: 'list4', description: 'lorem ipsum dolor', BoardId: board1.id, orderNum: 3 });
        })
        .then(list => {
          list4 = list;
          done();
        })
        .catch(e => done.fail(e));
    });

    it('sets the list to the new order number', (done) => {
      request.post(
        `${ apiUrl }/reorder/${ board1.id }/${ list3.id }/1?token=${ user1.token }`,
        async (err, response) => {
          expect(response.statusCode).toBe(200);
          const list = await List.findById(list3.id);
          expect(list.orderNum).toBe(1);
          done();
        }
      );
    });

    it('normalizes the positions of the other lists', async (done) => {
      request.post(
        `${ apiUrl }/reorder/${ board1.id }/${ list4.id }/2?token=${ user1.token }`,
        async () => {
          list1 = await List.findById(list1.id);
          list3 = await List.findById(list3.id);
          list4 = await List.findById(list4.id);
          expect(list1.orderNum).toBe(1);
          expect(list4.orderNum).toBe(2);
          expect(list3.orderNum).toBe(3);
          done();
        }
      );
    });

    it('does not set the order if the list does not belong to the board', async (done) => {
      request.post(
        `${ apiUrl }/reorder/${ board1.id }/${ list2.id }/1?token=${ user1.token }`,
        async (err, response) => {
          expect(response.statusCode).toBe(403);
          const list = await List.findById(list2.id);
          expect(list.orderNum).toBe(2);
          done();
        }
      );
    });

    it('does not set the order if the token is invalid', async (done) => {
      request.post(
        `${ apiUrl }/reorder/${ board1.id }/${ list3.id }/1?token=invlaidToken`,
        async (err, response) => {
          expect(response.statusCode).toBe(404);
          done();
        }
      );
    });

    it('does not set the order if there is no token', async (done) => {
      request.post(
        `${ apiUrl }/reorder/${ board1.id }/${ list3.id }/1`,
        async (err, response) => {
          expect(response.statusCode).toBe(403);
          done();
        }
      );
    });

    it('does not set the order if the boardId is invlaid', (done) => {
      request.post(
        `${ apiUrl }/reorder/abc123/${ list3.id }/1?token=${ user1.token }`,
        (err, response) => {
          expect(response.statusCode).toBe(400);
          done();
        }
      );
    });

    it('does not set the order if the listId in invlaid', (done) => {
      request.post(
        `${ apiUrl }/reorder/${ board1.id }/abc123/1?token=${ user1.token }`,
        (err, response) => {
          expect(response.statusCode).toBe(400);
          done();
        }
      );
    });
  });
});
