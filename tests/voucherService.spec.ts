import { jest } from "@jest/globals";

import voucherService from "services/voucherService";
import voucherRepository from "repositories/voucherRepository";

describe("Create voucher tests", () => {
    it("should create a vocuher", async () => {
        const code = 'teste123';
        const discount = 20;

        jest.
            spyOn(voucherRepository, 'getVoucherByCode').
            mockImplementationOnce((): any => { });

        jest.
            spyOn(voucherRepository, 'createVoucher').
            mockImplementationOnce((): any => { return true });

        const promise = await voucherService.createVoucher(code, discount);

        expect(promise).not.toBeNull();
    });

    it("should not create a vocuher, if the voucher already exists", () => {
        expect(async () => {
            const code = 'teste123';
            const discount = 20;

            jest.
                spyOn(voucherRepository, 'getVoucherByCode').
                mockImplementationOnce((): any => { return true });

            await voucherService.createVoucher(code, discount);
        })
        .rejects.toEqual({ type: "conflict", message: "Voucher already exist." });
    });
});

describe("Apply voucher tests", () => {
    it("should apply a vocuher", async () => {
        const voucher = {
            id: 1,
            code: 'teste123',
            discount: 20,
            used: false
        };

        const code = 'teste123';
        const amount = 100;

        jest.
            spyOn(voucherRepository, 'getVoucherByCode').
            mockImplementationOnce((): any => { return voucher });

        const finalAmount = amount - voucher.discount;

        jest.
            spyOn(voucherRepository, 'useVoucher').
            mockImplementationOnce((): any => { return true });

        const promise = await voucherService.applyVoucher(code, amount);

        expect(promise).toEqual({
            amount,
            discount: voucher.discount,
            finalAmount,
            applied: finalAmount !== amount
        });
    });

    it("should not apply a vocuher if do not exist the voucher", () => {
        expect(async () => {
            const code = 'teste123';
            const amount = 100;

            jest.
                spyOn(voucherRepository, 'getVoucherByCode').
                mockImplementationOnce((): any => { return undefined });

            await voucherService.applyVoucher(code, amount);
        })
        .rejects.toEqual({ type: "conflict", message: "Voucher does not exist." });
    });
});