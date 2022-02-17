import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly users = [
    {
      id: 1,
      email: 'dragomir@twognation.com',
      password: '12345',
    },
  ];

  async findOne(email: string) {
    return this.users.find((user) => user.email === email);
  }
}
