import { MigrationInterface, QueryRunner } from 'typeorm';

export class testMigration1623301145511 implements MigrationInterface {
  name = 'testMigration1623301145511';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `tbl_attendance_log` (`log_id` int NOT NULL AUTO_INCREMENT, `attendance_dt` datetime(6) NOT NULL COMMENT '출근기록' DEFAULT CURRENT_TIMESTAMP(6), `commute_dt` date NULL COMMENT '퇴근기록', `staffSId` int NULL, UNIQUE INDEX `REL_ee69d3032b7f4ff0b8e583ed07` (`staffSId`), PRIMARY KEY (`log_id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      'CREATE TABLE `tbl_staff` (`s_id` int NOT NULL AUTO_INCREMENT, `s_nm` varchar(50) COLLATE "utf8_general_ci" NULL COMMENT \'직원명\', PRIMARY KEY (`s_id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      "CREATE TABLE `tbl_attendance_info` (`ri_id` int NOT NULL AUTO_INCREMENT, `attendance_dt` datetime(6) NOT NULL COMMENT '출근일' DEFAULT CURRENT_TIMESTAMP(6), `staffSId` int NULL, UNIQUE INDEX `REL_b906f9d34c99e7cd2ab626bb8c` (`staffSId`), PRIMARY KEY (`ri_id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      'ALTER TABLE `tbl_attendance_log` ADD CONSTRAINT `FK_ee69d3032b7f4ff0b8e583ed075` FOREIGN KEY (`staffSId`) REFERENCES `tbl_staff`(`s_id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `tbl_attendance_info` ADD CONSTRAINT `FK_b906f9d34c99e7cd2ab626bb8cb` FOREIGN KEY (`staffSId`) REFERENCES `tbl_staff`(`s_id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `tbl_attendance_info` DROP FOREIGN KEY `FK_b906f9d34c99e7cd2ab626bb8cb`',
    );
    await queryRunner.query(
      'ALTER TABLE `tbl_attendance_log` DROP FOREIGN KEY `FK_ee69d3032b7f4ff0b8e583ed075`',
    );
    await queryRunner.query(
      'DROP INDEX `REL_b906f9d34c99e7cd2ab626bb8c` ON `tbl_attendance_info`',
    );
    await queryRunner.query('DROP TABLE `tbl_attendance_info`');
    await queryRunner.query('DROP TABLE `tbl_staff`');
    await queryRunner.query(
      'DROP INDEX `REL_ee69d3032b7f4ff0b8e583ed07` ON `tbl_attendance_log`',
    );
    await queryRunner.query('DROP TABLE `tbl_attendance_log`');
  }
}
