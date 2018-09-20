var expect = require('expect');
const {addAvatar, removeAvatar, charAvatars, connectedClients} = require('./avatar');
const {port, server} = require('./../server');

var client1;

var io = require('socket.io-client');

var socketURL = `http://localhost:${port}`;
var options ={
    transports: ['websocket'],
    'force new connection': true
  };


describe('Avatars',()=>{
    before(()=>{
        server.listen(port);
    })
    
    after(() => server.close()); 
    beforeEach( () => client1 = io.connect(socketURL, options));

    it('should allow connected user select only one avatar and add it into avatar pool after disconnection', (done)=>{
        var name = "stan";

        var secondName = "wendy";
        client1.on('connect', ()=>{
            client1.emit('avatarSelected', {
                name
            });

            client1.emit('avatarSelected', {
                secondName
            });
            var clientId = client1.id;

            addAvatar(client1.id, name);
            expect(connectedClients[client1.id].avatar).toBe(name);
            expect(charAvatars).toNotContain(name);

            client1.disconnect();

            removeAvatar(clientId, name, (res)=>{
                expect(charAvatars).toContain(name);
                done();
            });
        });     
    });



});













