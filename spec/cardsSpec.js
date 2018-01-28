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
          const eventCount = await Event.count();
          expect(eventCount).toEqual(1);
          done();
        } catch (error) {
          done.fail(error);
        }
      });
    });

    it('adds the board owner as a member', async (done) => {
      const body = { ListId: list1.id, description: 'some description' };
      try {
        await card1.addUser(bob);
        await card1.removeUser(tom);
        request({
          url: `${ apiUrl }?token=${ bob.token }`,
          method: 'POST',
          json: body
        }, async () => {
          const cards = await Card.findAll();
          const card = cards[cards.length - 1];
          const users = await card.getUsers();
          const userIds = users.map(u => u.id);
          expect(userIds.includes(tom.id)).toBe(true);
          done();
        });
      } catch (error) {
        done.fail(error);
      }
    });

    it('adds the user to the new card\'s members', (done) => {
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
          const eventCount = await Event.count();
          expect(eventCount).toEqual(1);
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

  fdescribe('PUT move', () => {
    let list2, list1Card2, list1Card3, list2Card1, list2Card2, list2Card3, body;

    beforeEach(async (done) => {
      try {
        list2 = await List.create({
          title: 'list2',
          description: 'lorem ipsum dolor',
          BoardId: board1.id
        });
        list1Card2 = await Card.create({ title: 'list1Card2', description: 'some description', ListId: list1.id });
        list1Card3 = await Card.create({ title: 'list1Card3', description: 'some description', ListId: list1.id });
        list2Card1 = await Card.create({ title: 'list2Card1', description: 'some description', ListId: list2.id });
        list2Card2 = await Card.create({ title: 'list2Card2', description: 'some description', ListId: list2.id });
        list2Card3 = await Card.create({ title: 'list2Card3', description: 'some description', ListId: list2.id });
        await list1Card2.addUser(tom);
        await list1Card3.addUser(tom);
        await list2Card1.addUser(tom);
        await list2Card2.addUser(tom);
        await list2Card3.addUser(tom);
        done();
      } catch (e) {
        done.fail(e);
      }
    });

    describe('a valid request', () => {
      beforeEach(() => {
        body = {
          fromListId: list1.id,
          toListId: list2.id,
          orderNum: 3
        };
      });

      it('moves the card to the correct list', (done) => {
        request({
          url: `${ apiUrl }/move/${ list1Card2.id }?token=${ tom.token }`,
          method: 'PUT',
          json: body
        }, async (err, response) => {
          expect(response.statusCode).toBe(200);
          try {
            await list1Card2.reload();
            expect(list1Card2.ListId).toEqual(list2.id);
            done();
          } catch (e) {
            done.fail(e);
          }
        });
      });

      it('normalizes the positions of the cards in the destinantion list', (done) => {
        request({
          url: `${ apiUrl }/move/${ list1Card2.id }?token=${ tom.token }`,
          method: 'PUT',
          json: body
        }, async () => {
          try {
            await list2Card1.reload();
            await list2Card2.reload();
            await list2Card3.reload();
            await list1Card2.reload();
            expect(list2Card1.orderNum).toEqual(1);
            expect(list2Card2.orderNum).toEqual(2);
            expect(list1Card2.orderNum).toEqual(3);
            expect(list2Card3.orderNum).toEqual(4);
            done();
          } catch (e) {
            done.fail(e);
          }
        });
      });

      it('normalizes the positions of the cards in the origin list', (done) => {
        request({
          url: `${ apiUrl }/move/${ list1Card2.id }?token=${ tom.token }`,
          method: 'PUT',
          json: body
        }, async () => {
          try {
            await card1.reload();
            await list1Card3.reload();
            expect(card1.orderNum).toEqual(1);
            expect(list1Card3.orderNum).toEqual(2);
            done();
          } catch (e) {
            done.fail(e);
          }
        });
      });

      it('creates an event for the card', (done) => {
        request({
          url: `${ apiUrl }/move/${ list1Card2.id }?token=${ tom.token }`,
          method: 'PUT',
          json: body
        }, async () => {
          try {
            await list1Card2.reload();
            const events = await list1Card2.getEvents();
            const event = events[0];
            expect(event.action).toEqual(`moved this card from the ${ list1.title } list to the ${ list2.title } list`);
            done();
          } catch (e) {
            done.fail(e);
          }
        });
      });
    });

    describe('an invalid request', () => {
      it('does not move the card if the user is not a member of the card', async (done) => {
        body = {
          fromListId: list1.id,
          toListId: list2.id,
          orderNum: 3
        };

        try {
          list2 = await List.create({
            title: 'list2',
            description: 'lorem ipsum dolor',
            BoardId: board1.id
          });
          list1Card2 = await Card.create({ title: 'list1Card2', description: 'some description', ListId: list1.id });
        } catch (e) {
          done.fail(e);
        }

        request({
          url: `${ apiUrl }/move/${ list1Card2.id }?token=${ bob.token }`,
          method: 'PUT',
          json: body
        }, (err, response) => {
          expect(response.statusCode).toBe(401);
          expect(response.body.message).toEqual('Unauthorized');
          done();
        });
      });
    });

    describe('missing data -', () => {
      let bodyCopy;

      beforeEach(() => {
        bodyCopy = Object.assign({}, body);
      });

      it('no token', (done) => {
        request({
          url: `${ apiUrl }/move/${ list1Card2.id }`,
          method: 'PUT',
          json: body
        }, (err, response) => {
          expect(response.statusCode).toBe(403);
          done();
        });
      });

      it('no fromListId', (done) => {
        delete bodyCopy.fromListId;
        request({
          url: `${ apiUrl }/move/${ list1Card2.id }?token=${ tom.token }`,
          method: 'PUT',
          json: bodyCopy
        }, (err, response) => {
          expect(response.statusCode).toBe(400);
          done();
        });
      });

      it('no toListId', (done) => {
        delete bodyCopy.toListId;
        request({
          url: `${ apiUrl }/move/${ list1Card2.id }?token=${ tom.token }`,
          method: 'PUT',
          json: bodyCopy
        }, (err, response) => {
          expect(response.statusCode).toBe(400);
          done();
        });
      });

      it('no orderNum', (done) => {
        delete bodyCopy.orderNum;
        request({
          url: `${ apiUrl }/move/${ list1Card2.id }?token=${ tom.token }`,
          method: 'PUT',
          json: bodyCopy
        }, (err, response) => {
          expect(response.statusCode).toBe(400);
          done();
        });
      });
    });

    describe('invalid data -', () => {
      it('bad token', (done) => {
        request({
          url: `${ apiUrl }/move/${ list1Card2.id }?token=asd123`,
          method: 'PUT',
          json: body
        }, (err, response) => {
          expect(response.statusCode).toBe(404);
          expect(response.body.message).toEqual('User not found');
          done();
        });
      });

      it('bad toListId', (done) => {
        const invalidBody = Object.assign({}, body);
        invalidBody.toListId = 'asdf123';
        request({
          url: `${ apiUrl }/move/${ list1Card2.id }?token=${ tom.token }`,
          method: 'PUT',
          json: invalidBody
        }, (err, response, body) => {
          expect(response.statusCode).toBe(400);
          expect(body.message).toEqual('Invalid request body');
          done();
        });
      });

      it('bad fromListId', (done) => {
        const invalidBody = Object.assign({}, body);
        invalidBody.fromListId = 'asdf123';
        request({
          url: `${ apiUrl }/move/${ list1Card2.id }?token=${ tom.token }`,
          method: 'PUT',
          json: invalidBody
        }, (err, response, body) => {
          expect(response.statusCode).toBe(400);
          expect(body.message).toEqual('Invalid request body');
          done();
        });
      });

      it('bad cardId', (done) => {
        request({
          url: `${ apiUrl }/move/asdf123?token=${ tom.token }`,
          method: 'PUT',
          json: body
        }, (err, response, body) => {
          expect(response.statusCode).toBe(400);
          expect(body.message).toEqual('Invalid ID param');
          done();
        });
      });
    });
  });
});
