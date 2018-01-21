require('./config');
const app = require('../server');
const request = require('request');
const { User, Board, List, Card, Event } = require('./../models');

describe('Cards', () => {
  const apiUrl = 'http://localhost:3001/api/v1/cards';
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
        return card1.addUsers([user1]);
      })
      .then(() => {
        done();
      })
      .catch(e => done.fail(e));
  });

  describe('PUT card', () => {
    it('updates the card\'s description with a valid id, description, and token', (done) => {
      const body = { description: 'New Description', completed: false };
      request({
        url: `${ apiUrl }/${ card1.id }?token=${ user1.token }`,
        method: 'PUT',
        json: body
      }, async (err, response) => {
        expect(response.statusCode).toBe(200);
        try {
          const card = await Card.find();
          expect(card.description).toEqual('New Description');
          done();
        } catch (error) {
          done.fail(error);
        }
      });
    });

    it('does not update the card with no token', (done) => {
      const body = { description: 'New Description', completed: false };
      request({
        url: `${ apiUrl }/${ card1.id }`,
        method: 'PUT',
        json: body
      }, (err, response) => {
        expect(response.statusCode).toBe(403);
        done();
      });
    });

    it('does not update the card with no description', (done) => {
      request({
        url: `${ apiUrl }/${ card1.id }?token=${ user1.token }`,
        method: 'PUT'
      }, (err, response, body) => {
        const result = JSON.parse(body);
        expect(response.statusCode).toBe(400);
        expect(result.message).toEqual('Invalid body - needs a description and completed attribute');
        done();
      });
    });

    it('does not update the card with an invalid ID', (done) => {
      const body = { description: 'New Description', completed: false };
      request({
        url: `${ apiUrl }/asdf123?token=${ user1.token }`,
        method: 'PUT',
        json: body
      }, (err, response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual('Invalid ID param');
        done();
      });
    });

    it('does not update the card with an invalid token', (done) => {
      const body = { description: 'New Description', completed: false };
      request({
        url: `${ apiUrl }/${ card1.id }?token=invalidToken`,
        method: 'PUT',
        json: body
      }, (err, response) => {
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toEqual('User not found');
        done();
      });
    });

    it('does not update the card if the current user is not a member of the card', (done) => {
      const body = { description: 'New Description', completed: false };
      request({
        url: `${ apiUrl }/${ card1.id }?token=${ user2.token }`,
        method: 'PUT',
        json: body
      }, (err, response) => {
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toEqual('Unauthorized');
        done();
      });
    });
  });

  describe('DELETE card', () => {
    it('deletes the card with a valid token, id, and user', (done) => {
      request({
        url: `${ apiUrl }/${ card1.id }?token=${ user1.token }`,
        method: 'DELETE'
      }, async (err, response) => {
        expect(response.statusCode).toBe(200);
        const cardCount = await Card.count();
        expect(cardCount).toEqual(0);
        done();
      });
    });

    it('does not delete the card if the user is not one of the members', (done) => {
      request({
        url: `${ apiUrl }/${ card1.id }?token=${ user2.token }`,
        method: 'DELETE'
      }, (err, response, body) => {
        const result = JSON.parse(body);
        expect(response.statusCode).toBe(401);
        expect(result.message).toEqual('Unauthorized');
        done();
      });
    });

    it('does not delete the card if there is no token', (done) => {
      request({
        url: `${ apiUrl }/${ card1.id }`,
        method: 'DELETE'
      }, (err, response) => {
        expect(response.statusCode).toBe(403);
        done();
      });
    });

    it('does not delete the card if the token is invalid', (done) => {
      request({
        url: `${ apiUrl }/${ card1.id }?token=asdf123`,
        method: 'DELETE'
      }, (err, response, body) => {
        const result = JSON.parse(body);
        expect(response.statusCode).toBe(404);
        expect(result.message).toEqual('User not found');
        done();
      });
    });

    it('sends an invalid response if the card id param is invalid', (done) => {
      request({
        url: `${ apiUrl }/asdf123?token=${ user1.token }`,
        method: 'DELETE'
      }, (err, response, body) => {
        const result = JSON.parse(body);
        expect(response.statusCode).toBe(400);
        expect(result.message).toEqual('Invalid ID param');
        done();
      });
    });
  });
});
