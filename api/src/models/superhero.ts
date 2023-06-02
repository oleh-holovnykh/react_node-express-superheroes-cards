import { Model, Column, DataType, Table, HasMany, PrimaryKey, AllowNull, AutoIncrement } from 'sequelize-typescript';

@Table({
  tableName: 'superheroes',
  createdAt: false,
  updatedAt: false,
})

export class Superhero extends Model {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
  })
  nickname!: string;

  @Column({
    type: DataType.STRING,
    field: 'real_name',
  })
  realName!: string;

  @Column({
    type: DataType.STRING,
    field: 'origin_description',
  })
  originDescription!: string;

  @Column({
    type: DataType.STRING,
  })
  superpowers!: string;

  @Column({
    type: DataType.STRING,
    field: 'catch_phrase',
  })
  catchPhrase!: string;

  @AllowNull(true)
  @Column({
    type: DataType.JSON,
    field: 'images_urls',
  })
  imagesURLs!: string[];

  // @HasMany(() => Image)
  // images?: Image[];
}
