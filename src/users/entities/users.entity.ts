import { Column, Entity } from 'typeorm';

@Entity()
export class User {
  @Column()
  email: string;

  @Column()
  password: string;
}
