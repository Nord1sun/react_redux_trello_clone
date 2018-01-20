require('./config');
const app = require('../server');
const request = require('request');
const { User, Board, List, Card, Event } = require('./../models');

describe('Boards', () => {
  const apiUrl = 'http://localhost:3001/api/v1/boards';
  let server, user1, user2, board1, card1;

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
        return Board.create({ title: 'board2', UserId: user1.id });
      })
      .then(() => {
        return Board.create({ title: 'board3', UserId: user2.id });
      })
      .then(() => {
        return List.create({ title: 'list1', description: 'lorem ipsum dolor', BoardId: board1.id });
      })
      .then(list => {
        return Card.create({ title: 'card1', description: 'some description', ListId: list.id });
      })
      .then(card => {
        card1 = card;
        return Event.create({ action: 'some action', UserId: user1.id, CardId: card.id });
      })
      .then(() => {
        return card1.addUsers([user1, user2]);
      })
      .then(() => {
        done();
      })
      .catch(e => console.error(e));
  });

  describe('GET boards', () => {
    it('returns all the requested user\'s boards', done => {
      request(`${ apiUrl }/${ user1.id }`, (err, response, body) => {
        const result = JSON.parse(body);
        expect(response.statusCode).toBe(200);
        expect(result.boards.length).toEqual(2);
        expect(result.boards[0].title).toEqual('board1');
        expect(result.boards[1].title).toEqual('board2');
        done();
      });
    });

    it('returns the requested board with it\'s lists', done => {
      request(`${ apiUrl }/${ user1.id }`, (err, response, body) => {
        const result = JSON.parse(body);
        expect(result.boards[0].Lists[0].title).toEqual('list1');
        done();
      });
    });

    it('does not return other user\'s boards', done => {
      request(`${ apiUrl }/${ user1.id }`, (err, response, body) => {
        const result = JSON.parse(body);
        expect(result.boards.filter(b => b.title === 'boards3')).toEqual([]);
        done();
      });
    });

    it('does not return any boards if there is no id param', done => {
      request(`${ apiUrl }/`, (err, response) => {
        expect(response.statusCode).toBe(404);
        done();
      });
    });
  });

  describe('POST boards', () => {
    it('creates a new board with a valid token', (done) => {
      request.post(`${ apiUrl }?token=${ user1.token }`, (err, response) => {
        expect(response.statusCode).toBe(200);
        user1.getBoards()
          .then(boards => {
            expect(boards[boards.length - 1].title).toEqual('Add board title...');
            expect(boards.length).toEqual(3);
            done();
          })
          .catch(e => {
            console.error(e.stack);
            done.fail();
          });
      });
    });

    it('does not create a board if there is no token', (done) => {
      request.post(apiUrl, (err, response) => {
        expect(response.statusCode).toBe(403);
        Board.count()
          .then(num => {
            expect(num).toEqual(3);
            done();
          })
          .catch(e => {
            console.error(e.stack);
            done.fail();
          });
      });
    });

    it('does not create a board if the token in invalid', (done) => {
      request.post(`${ apiUrl }?token=invalidtoken123`, (err, response) => {
        expect(response.statusCode).toBe(404);
        Board.count()
          .then(num => {
            expect(num).toEqual(3);
            done();
          })
          .catch(e => {
            console.error(e.stack);
            done.fail();
          });
      });
    });
  });

  describe('PUT boards', () => {
    it('updates the board name with a valid token and title', (done) => {
      const body = { title: 'New Title' };
      request({
        url: `${ apiUrl }/${ board1.id }?token=${ user1.token }`,
        method: 'PUT',
        json: body
      }, (err, response) => {
        expect(response.statusCode).toBe(200);
        Board.findById(board1.id)
          .then(board => {
            expect(board.title).toEqual('New Title');
            done();
          })
          .catch(e => {
            console.error(e.stack);
            done.fail();
          });
      });
    });

    it('sends the lists associated with the board', (done) => {
      const body = { title: 'New Title' };
      request({
        url: `${ apiUrl }/${ board1.id }?token=${ user1.token }`,
        method: 'PUT',
        json: body
      }, (err, response, body) => {
        expect(body.board.Lists[0].title).toEqual('list1');
        done();
      });
    });

    it('does not update the board if there is no token', (done) => {
      const body = { title: 'New Title' };
      request({
        url: `${ apiUrl }/${ board1.id }`,
        method: 'PUT',
        json: body
      }, (err, response) => {
        expect(response.statusCode).toBe(403);
        Board.findById(board1.id)
          .then(board => {
            expect(board.title).not.toEqual('New Title');
            done();
          })
          .catch(e => {
            console.error(e.stack);
            done.fail();
          });
      });
    });

    it('does not update the board if the token is invalid', (done) => {
      const body = { title: 'New Title' };
      request({
        url: `${ apiUrl }/${ board1.id }?token=invalid123`,
        method: 'PUT',
        json: body
      }, (err, response) => {
        expect(response.statusCode).toBe(404);
        Board.findById(board1.id)
          .then(board => {
            expect(board.title).not.toEqual('New Title');
            done();
          })
          .catch(e => {
            console.error(e.stack);
            done.fail();
          });
      });
    });

    it('does not update the name if the board does not belong to the user', (done) => {
      const body = { title: 'New Title' };
      request({
        url: `${ apiUrl }/${ board1.id }?token=${ user2.token }`,
        method: 'PUT',
        json: body
      }, (err, response) => {
        expect(response.statusCode).toBe(403);
        Board.findById(board1.id)
          .then(board => {
            expect(board.title).not.toEqual('New Title');
            done();
          })
          .catch(e => {
            console.error(e.stack);
            done.fail();
          });
      });
    });

    it('does not update the board if there is no title in the body', (done) => {
      const body = { foo: 'bar' };
      request({
        url: `${ apiUrl }/${ board1.id }?token=${ user1.token }`,
        method: 'PUT',
        json: body
      }, (err, response) => {
        expect(response.statusCode).toBe(400);
        Board.findById(board1.id)
          .then(board => {
            expect(board.title).not.toEqual('New Title');
            done();
          })
          .catch(e => {
            console.error(e.stack);
            done.fail();
          });
      });
    });
  });

  describe('DELETE boards', () => {
    it('removes the board with a correct token and id', (done) => {
      request.delete(`${ apiUrl }/${ board1.id }?token=${ user1.token }`, (err, response, body) => {
        const result = JSON.parse(body);
        expect(response.statusCode).toBe(200);
        expect(result.message).toEqual(`${ board1.title } deleted successfully`);
        expect(result.board.id).toEqual(board1.id);
        expect(result.board.title).toEqual(board1.title);
        Board.count()
          .then(num => {
            expect(num).toEqual(2);
            done();
          })
          .catch(e => {
            console.error(e.stack);
            done.fail();
          });
      });
    });

    it('does not remove the board if there is no token', (done) => {
      request.delete(`${ apiUrl }/${ board1.id }`, (err, response) => {
        expect(response.statusCode).toBe(403);
        Board.count()
          .then(num => {
            expect(num).toEqual(3);
            done();
          })
          .catch(e => {
            console.error(e.stack);
            done.fail();
          });
      });
    });

    it('does not remove the board if it does not belong to the user', (done) => {
      request.delete(`${ apiUrl }/${ board1.id }?token=${ user2.token }`, (err, response) => {
        expect(response.statusCode).toBe(403);
        Board.count()
          .then(num => {
            expect(num).toEqual(3);
            done();
          })
          .catch(e => {
            console.error(e.stack);
            done.fail();
          });
      });
    });

    it('does not remove the board if the token is incorrect', (done) => {
      request.delete(`${ apiUrl }/${ board1.id }?token=12345`, (err, response) => {
        expect(response.statusCode).toBe(404);
        Board.count()
          .then(num => {
            expect(num).toEqual(3);
            done();
          })
          .catch(e => {
            console.error(e.stack);
            done.fail();
          });
      });
    });

    it('sends a failure response if the board does not exist', (done) => {
      request.delete(`${ apiUrl }/3sd32?token=${ user1.token }`, (err, response) => {
        expect(response.statusCode).toBe(403);
        Board.count()
          .then(num => {
            expect(num).toEqual(3);
            done();
          })
          .catch(e => {
            console.error(e.stack);
            done.fail();
          });
      });
    });
  });
});
