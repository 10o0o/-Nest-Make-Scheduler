import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class AddAttendanceLog1623206519490 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tbl_attendance_log',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 's_id',
            type: 'int',
          },
          {
            name: 'attendance_dt',
            type: 'DATE',
            isGenerated: true,
            isNullable: false,
          },
          {
            name: 'commute_dt',
            type: 'DATE',
            isGenerated: true,
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'tbl_attendance_log',
      new TableForeignKey({
        columnNames: ['s_id'],
        referencedTableName: 'tbl_staff',
        referencedColumnNames: ['s_id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> { }
}
