
const expect = require('expect');
const {Users} = require('./users');

describe('Users',()=>{

    beforeEach(()=>{
        users = new Users();
        users.users = [
            {
                id: '1',
                name: 'Paul',
                room : 'Techchat'
            },
            {
                id: '2',
                name: 'Robert',
                room : 'Techchat'
            },
            {
                id: '3',
                name: 'Pauline',
                room : 'Linux'
            }
        ]
    });

    it(' : should add new user',()=>{
        var users = new Users();
        var user = {
            id: '45654',
            name : 'Paul',
            room : 'tech chat'
        };
        var resUser = users.addUser(user.id, user.name, user.room);
        expect(users.users).toEqual([user]);
    });

    it(' : should return users for Techchat room',()=>{
        var userList = users.getUserList('Techchat');
        expect(userList).toEqual(['Paul', 'Robert']);
    });

    it(' : should return users for Linux room',()=>{
        var userList = users.getUserList('Linux');
        expect(userList).toEqual(['Pauline']);
    });

    it(' : should remove a user',()=>{
        var user = users.removeUser('2');
        expect(user.id).toBe('2');
        expect(users.users.length).toBe(2);

    });

    it(' : should NOT remove a user',()=>{
        var user = users.removeUser('11');
        expect(user).toNotExist();
        expect(users.users.length).toBe(3);
    });

    it(' : should find user',()=>{
        var user = users.getUser('1');
        expect(user).toEqual({
            id: '1',
            name: 'Paul',
            room : 'Techchat'
        });
    });

    it(' : should not find user',()=>{
        var user = users.getUser('10');
        expect(user).toNotExist();
    });

});