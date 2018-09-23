
const expect = require('expect');
const {Users} = require('./users');
const {Room, AllRooms} = require('./rooms');

describe('Room object',()=>{

    beforeEach(()=>{
        allUsers = new Users();
        roomA = new Room('Techchat', allUsers);
        roomB = new Room('Linux', allUsers);


        roomA.removeAvatarFromPool('stan');
        roomA.removeAvatarFromPool('eric');
        roomB.removeAvatarFromPool('wendy');
        roomB.removeAvatarFromPool('randy');


        allUsers.users = [
            {
                id: '1',
                name: 'Paul',
                room : 'Techchat',
                avatar : 'stan'
            },
            {
                id: '2',
                name: 'Robert',
                room : 'Techchat',
                avatar : 'eric'
            },
            {
                id: '3',
                name: 'Pauline',
                room : 'Linux',
                avatar : 'wendy'
            },
            {
                id: '4',
                name: 'Steve',
                room : 'Linux',
                avatar : 'randy'
            }
        ]
    });

    it(' : should return room name', ()=>{
        expect( roomA.getName() ).toBe('Techchat');
    });

    it(' : should add a user to a room', ()=>{
        var user = allUsers.getUser('1');
        roomA.addUserToRoom(user.id);
        expect( roomA.getUserList() ).toInclude(user);
    });

    it(' : should remove a user from a room',()=>{
        var user = allUsers.getUser('1');
        roomA.addUserToRoom(user.id);
        roomA.removeUserFromRoom(user.id);    
        expect( roomA.getUserList()  ).toNotInclude(user);
    });

    it(' : should adds users avatar back into pool and sets user avatar to generic',()=>{
        var user = allUsers.getUser('1');
        roomA.addUserToRoom(user.id);
        roomA.removeUserFromRoom(user.id);    
        expect( roomA.getAvatars()  ).toInclude('stan');
        expect(user.avatar).toBe('generic')
    });

    it(' : should remove avatar from pool',()=>{
        var user = allUsers.getUser('1');
        roomA.addUserToRoom(user.id);
        roomA.assignAvatarToUser(user.id, user.avatar);    
        expect( roomA.getAvatars()  ).toNotInclude(user.avatar);
    });
});

