require('./config');
const app = require('../server');
const request = require('request');
const { User, Board, List, Card, Event } = require('./../models');

describe('Cards', () => {
  const apiUrl = 'http://localhost:3001/api/v1/cards';
  let server, tom, bob, frank, board1, card1, list1;

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

  beforeEach((done) => {
    User.create({ fullName: 'Tom', email: 'foobar@gmail.com', password: 'password1' })
      .then(result => {
        tom = result;
        return User.create({ fullName: 'Bob', email: 'foobar@example.com', password: 'password1' });
      })
      .then(result => {
        bob = result;
        return Board.create({ title: 'board1', UserId: tom.id });
      })
      .then(board => {
        board1 = board;
        return List.create({ title: 'list1', description: 'lorem ipsum dolor', BoardId: board1.id });
      })
      .then(list => {
        list1 = list;
        return Card.create({ title: 'card1', description: 'some description', ListId: list.id });
      })
      .then(card => {
        card1 = card;
        return Event.create({ action: 'some action', UserId: tom.id, CardId: card.id });
      })
      .then(() => {
        return card1.addUsers([tom]);
      })
      .then(() => {
        done();
      })
      .catch(e => done.fail(e));
  });

  describe('POST card', () => {
    it('creates a card with a valid token', (done) => {
      const body = { ListId: list1.id, description: 'some description' };
      request({
        url: `${ apiUrl }?token=${ tom.token }`,
        method: 'POST',
        json: body
      }, async (err, response) => {
        expect(response.statusCode).toEqual(200);
        try {
          const cardCount = await Card.count();
          expect(cardCount).toEqual(2);
          done();
        } catch (error) {
          done.fail(error);
        }
      });
    });

    it('adds the user to the cards members', (done) => {
      const body = { ListId: list1.id, description: 'some description' };
      request({
        url: `${ apiUrl }?token=${ tom.token }`,
        method: 'POST',
        json: body
      }, async () => {
        try {
          const cards = await Card.findAll();
          const card = cards[cards.length - 1];
          const members = await card.getUsers();
          const memberIds = members.map(m => m.id);
          expect(memberIds.includes(tom.id)).toBe(true);
          done();
        } catch (error) {
          done.fail(error);
        }
      });
    });

    it('does not create the card if there is no token', (done) => {
      const body = { ListId: list1.id, description: 'some description' };
      request({
        url: apiUrl,
        method: 'POST',
        json: body
      }, (err, response) => {
        expect(response.statusCode).toBe(403);
        done();
      });
    });

    it('does not create the card if the token is invalid', (done) => {
      const body = { ListId: list1.id, description: 'some description' };
      request({
        url: `${ apiUrl }?token=asdf123`,
        method: 'POST',
        json: body
      }, (err, response) => {
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toEqual('User not found');
        done();
      });
    });

    it('does not create the card if there is no description', (done) => {
      const body = { ListId: list1.id, description: '' };
      request({
        url: `${ apiUrl }?token=${ tom.token }`,
        method: 'POST',
        json: body
      }, async (err, response) => {
        expect(response.statusCode).toEqual(400);
        try {
          const cardCount = await Card.count();
          expect(cardCount).toEqual(1);
          done();
        } catch (error) {
          done.fail(error);
        }
      });
    });

    it('does not create the card if there is no list id', (done) => {
      const body = { ListId: '', description: 'some description' };
      request({
        url: `${ apiUrl }?token=${ tom.token }`,
        method: 'POST',
        json: body
      }, async (err, response) => {
        expect(response.statusCode).toEqual(400);
        try {
          const cardCount = await Card.count();
          expect(cardCount).toEqual(1);
          done();
        } catch (error) {
          done.fail(error);
        }
      });
    });
  });

  describe('PUT card', () => {
    it('updates the card\'s description with a valid id, description, and token', (done) => {
      const body = { description: 'New Description', completed: false };
      request({
        url: `${ apiUrl }/${ card1.id }?token=${ tom.token }`,
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
        url: `${ apiUrl }/${ card1.id }?token=${ tom.token }`,
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
        url: `${ apiUrl }/asdf123?token=${ tom.token }`,
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
        url: `${ apiUrl }/${ card1.id }?token=${ bob.token }`,
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
        url: `${ apiUrl }/${ card1.id }?token=${ tom.token }`,
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
        url: `${ apiUrl }/${ card1.id }?token=${ bob.token }`,
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
        url: `${ apiUrl }/asdf123?token=${ tom.token }`,
        method: 'DELETE'
      }, (err, response, body) => {
        const result = JSON.parse(body);
        expect(response.statusCode).toBe(400);
        expect(result.message).toEqual('Invalid ID param');
        done();
      });
    });
  });

  describe('GET search_non_members', () => {
    beforeEach((done) => {
      User.create({ fullName: 'Frank', email: 'foobar1@gmail.com', password: 'password1' })
        .then(result => {
          frank = result;
          done();
        })
        .catch(e => done.fail(e));
    });

    it('sends users that match the search term', (done) => {
      request(
        `${ apiUrl }/${ card1.id }/search_non_members/?term=fra&token=${ tom.token }`,
        (error, response, body) => {
          const result = JSON.parse(body);
          expect(response.statusCode).toBe(200);
          const userIds = result.users.map(u => u.id);
          expect(userIds.includes(frank.id)).toBe(true);
          done();
        }
      );
    });

    it('does not send users that are already members', (done) => {
      request(
        `${ apiUrl }/${ card1.id }/search_non_members/?term=Tom&token=${ tom.token }`,
        (error, response, body) => {
          const result = JSON.parse(body);
          expect(response.statusCode).toBe(200);
          expect(result.users).toEqual([]);
          done();
        }
      );
    });

    it('does not send any users if there is no token', (done) => {
      request(
        `${ apiUrl }/${ card1.id }/search_non_members/?term=fra`,
        (error, response) => {
          expect(response.statusCode).toBe(403);
          done();
        }
      );
    });

    it('does not send any users if the token is invalid', (done) => {
      request(
        `${ apiUrl }/${ card1.id }/search_non_members/?term=fra&token=asdf123`,
        (error, response, body) => {
          const result = JSON.parse(body);
          expect(response.statusCode).toBe(404);
          expect(result.message).toEqual('User not found');
          done();
        }
      );
    });

    it('does not send any users if the id is invlaid', (done) => {
      request(
        `${ apiUrl }/asdf34/search_non_members/?term=fra&token=${ tom.token }`,
        (error, response, body) => {
          const result = JSON.parse(body);
          expect(response.statusCode).toBe(400);
          expect(result.message).toEqual('Invalid ID param');
          done();
        }
      );
    });
  });

  describe('POST add_member', () => {
    it('adds a member with valid card and user ids and with a valid token', (done) => {
      request({
        url: `${ apiUrl }/${ card1.id }/add_member/${ bob.id }?token=${ tom.token }`,
        method: 'POST'
      }, async (error, response) => {
        expect(response.statusCode).toBe(200);
        try{
          const members = await card1.getUsers();
          const memberIds = members.map(m => m.id);
          expect(memberIds.includes(bob.id)).toBe(true);
          done();
        } catch (error) {
          done.fail(error);
        }
      });
    });

    it('does not allow a non-member to add a member', async (done) => {
      try {
        const frank = await User.create({ fullName: 'Frank', email: 'foobar1@gmail.com', password: 'password1' });
        request({
          url: `${ apiUrl }/${ card1.id }/add_member/${ bob.id }?token=${ frank.token }`,
          method: 'POST'
        }, (error, response) => {
          expect(response.statusCode).toBe(403);
          done();
        });
      } catch (error) {
        done.fail(error);
      }
    });

    it('does not add the member if there is no token', (done) => {
      request({
        url: `${ apiUrl }/${ card1.id }/add_member/${ bob.id }`,
        method: 'POST'
      }, (error, response) => {
        expect(response.statusCode).toBe(403);
        done();
      });
    });

    it('does not add the member if the token is invalid', (done) => {
      request({
        url: `${ apiUrl }/${ card1.id }/add_member/${ bob.id }?token=asdf123`,
        method: 'POST'
      }, (error, response, body) => {
        const result = JSON.parse(body);
        expect(response.statusCode).toBe(404);
        expect(result.message).toEqual('User not found');
        done();
      });
    });

    it('does not add the member if the card id is invalid', (done) => {
      request({
        url: `${ apiUrl }/asdf132/add_member/${ bob.id }?token=${ tom.token }`,
        method: 'POST'
      }, (error, response, body) => {
        const result = JSON.parse(body);
        expect(response.statusCode).toBe(400);
        expect(result.message).toEqual('Invalid ID param');
        done();
      });
    });

    it('does not add the member if the member id is invalid', (done) => {
      request({
        url: `${ apiUrl }/${ card1.id }/add_member/asdf123?token=${ tom.token }`,
        method: 'POST'
      }, (error, response, body) => {
        const result = JSON.parse(body);
        expect(response.statusCode).toBe(400);
        expect(result.message).toEqual('Invalid ID param');
        done();
      });
    });

    it('does not add the member if there is no card', (done) => {
      request({
        url: `${ apiUrl }/${ Math.round( Math.random()*10000000 ) }/add_member/${ bob.id }?token=${ tom.token }`,
        method: 'POST'
      }, (error, response, body) => {
        const result = JSON.parse(body);
        expect(response.statusCode).toBe(404);
        expect(result.message).toEqual('Card not found');
        done();
      });
    });

    it('does not add the member if the member id is incorrect', (done) => {
      request({
        url: `${ apiUrl }/${ card1.id }/add_member/${ Math.round( Math.random()*10000000 ) }?token=${ tom.token }`,
        method: 'POST'
      }, (error, response, body) => {
        const result = JSON.parse(body);
        expect(response.statusCode).toBe(404);
        expect(result.message).toEqual('User not found');
        done();
      });
    });
  });

  describe('DELETE member', () => {
    beforeEach((done) => {
      User.create({ fullName: 'Frank', email: 'foobar1@gmail.com', password: 'password1' })
        .then(result => {
          frank = result;
          return card1.addUser(frank);
        })
        .then(() => done())
        .catch(e => done.fail(e));
    });

    it('removes the member with valid card and user ids and with a valid token', (done) => {
      request({
        url: `${ apiUrl }/${ card1.id }/remove_member/${ frank.id }?token=${ tom.token }`,
        method: 'DELETE'
      }, async (error, response) => {
        expect(response.statusCode).toBe(200);
        try{
          const members = await card1.getUsers();
          const memberIds = members.map(m => m.id);
          expect(memberIds.includes(frank.id)).toBe(false);
          done();
        } catch (error) {
          done.fail(error);
        }
      });
    });

    it('does not allow a non-member to remove a member', (done) => {
      try {
        request({
          url: `${ apiUrl }/${ card1.id }/remove_member/${ frank.id }?token=${ bob.token }`,
          method: 'DELETE'
        }, (error, response) => {
          expect(response.statusCode).toBe(403);
          done();
        });
      } catch (error) {
        done.fail(error);
      }
    });

    it('does not remove the member if there is no token', (done) => {
      request({
        url: `${ apiUrl }/${ card1.id }/remove_member/${ bob.id }`,
        method: 'DELETE'
      }, (error, response) => {
        expect(response.statusCode).toBe(403);
        done();
      });
    });

    it('does not remove the member if the token is invalid', (done) => {
      request({
        url: `${ apiUrl }/${ card1.id }/remove_member/${ bob.id }?token=asdf123`,
        method: 'DELETE'
      }, (error, response, body) => {
        const result = JSON.parse(body);
        expect(response.statusCode).toBe(404);
        expect(result.message).toEqual('User not found');
        done();
      });
    });

    it('does not remove the member if the card id is invalid', (done) => {
      request({
        url: `${ apiUrl }/asdf132/remove_member/${ bob.id }?token=${ tom.token }`,
        method: 'DELETE'
      }, (error, response, body) => {
        const result = JSON.parse(body);
        expect(response.statusCode).toBe(400);
        expect(result.message).toEqual('Invalid ID param');
        done();
      });
    });

    it('does not remove the member if the member id is invalid', (done) => {
      request({
        url: `${ apiUrl }/${ card1.id }/remove_member/asd123?token=${ tom.token }`,
        method: 'DELETE'
      }, (error, response, body) => {
        const result = JSON.parse(body);
        expect(response.statusCode).toBe(400);
        expect(result.message).toEqual('Invalid ID param');
        done();
      });
    });
  });
});
