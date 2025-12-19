/*
  Warnings:

  - You are about to alter the column `status` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(2))`.
  - The values [REFUNDED] on the enum `Payment_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [READY,RETURNED] on the enum `Shipping_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Order` MODIFY `status` ENUM('PYMT_PDG', 'PYMT_EXP', 'PYMT_CNC', 'PYMT_SCS', 'SHIP_PDG', 'SHIP_SHP', 'SHIP_DLV', 'ORDR_CNC') NOT NULL DEFAULT 'PYMT_PDG';

-- AlterTable
ALTER TABLE `Payment` MODIFY `status` ENUM('PENDING', 'PAID', 'FAILED', 'EXPIRED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `Shipping` MODIFY `status` ENUM('PENDING', 'SHIPPED', 'DELIVERED') NOT NULL DEFAULT 'PENDING';
