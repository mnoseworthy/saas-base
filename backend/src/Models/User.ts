import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity
} from 'typeorm';
import {  Resolver, Query, Mutation, ObjectType, Field, ID, Arg, InputType } from "type-graphql";

/*
  Model Declaration
*/
@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: Number;

  @Field(() => String)
  @Column()
  email: string;

  @Field(() => String)
  @Column()
  uuid: string;
}

/*
  Inputs
*/
@InputType()
export class CreateUserInput {
  @Field()
  email: string;
  @Field()
  uuid: string;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  email: string;
}
/*
  Resolver & Reducer
*/
@Resolver()
export class UserResolver {
  /*
    CREATE
  */
  /*
    mutation{
      CreateUser(
        data:{
          email:"matt@inspectar.com",
          uuid:"1234-1234-1234"
        }
      )
      {  
        email,
        id,
        uuid
      }
    }
  */
  @Mutation(() => User)
  async CreateUser(@Arg("data") data: CreateUserInput){
    const user = User.create(data);
    await user.save();
    return user;
  }
  /*
    READ
  */
  /*
    {GetUsers {
      id,
      email,
      uuid
    }}
  */
  @Query(() => [User])
  GetUsers() {
    return User.find()
  }
  /*
    {GetUser(id:1,uuid:"1234-1234-1234") {
      id,
      email,
      uuid
    }}
  */
  @Query(() => User)
  GetUser(
    @Arg("id", { nullable: true }) id: Number,
    @Arg("uuid", { nullable: true }) uuid: String,
  ) {
    if (id == null && uuid != null ) {
      return User.findOne({ where: { uuid } });
    } else if (id != null && uuid == null ){
      return User.findOne({ where: { id } });
    } else {
      return User.findOne({ where: { id,uuid } });
    }
  }
  /*
    UPDATE
  */
  /*
    mutation{UpdateUser(id:"1",data:{email:"matt@inspectar.com"}) {
      id,
      email
    }}
  */
  @Mutation(() => User)
  async UpdateUser(@Arg("id") id: string, @Arg("data") data: UpdateUserInput) {
    const user = await User.findOne({ where: { id } });
    if (!user) throw new Error("User not found!");
    Object.assign(user, data);
    await user.save();
    return user;
  }
  /*
    DELETE
  */
  /*
    mutation{DeleteUser(id:"1")}
  */
  @Mutation(() => Boolean)
  async DeleteUser(@Arg("id") id: string) {
    const user = await User.findOne({ where: { id } });
    if (!user) throw new Error("User not found!");
    await user.remove();
    return true;
  }
}



