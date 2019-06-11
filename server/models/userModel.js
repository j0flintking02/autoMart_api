
export default class UserModel {
  constructor() {
    this.users = [{
      id: 1,
      email: 'jonathanaurugai@gmail.com',
      first_name: 'Jonathan',
      last_name: 'Aurugai',
      password: 'Root1234',
      address: 'Kampala',
      is_admin: true,
    },
    {
      id: 2,
      email: 'johndoe@gmail.com',
      first_name: 'John',
      last_name: 'Doe',
      password: 'Root1234',
      address: 'Kampala',
      is_admin: false,
    },
    ];
  }

  addUser(rawData) {
    this.users.push(rawData);
  }

  checkuser(rawData) {
    return this.users.find(user => user.email === rawData.email);
  }

  totalUsers() {
    return this.users.length;
  }
}
