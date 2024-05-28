import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  AccountDetailsValidator,
  FinishSetupValidator,
} from "~/lib/validators/userValidators";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const {
      session: {
        user: { id },
      },
    } = ctx;
    const user = await ctx.db.user.findFirst({
      where: {
        id,
      },
    });
    return user;
  }),

  finishSetup: protectedProcedure
    .input(FinishSetupValidator)
    .mutation(async ({ ctx, input }) => {
      const { gender, birthDay, lengthUnit, weightUnit, height, weight } =
        input;

      if (
        !gender ||
        !birthDay ||
        !lengthUnit ||
        !weightUnit ||
        !height ||
        !weight
      ) {
        return false;
      }

      await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          ...input,
          isSetup: true,
        },
      });

      return true;
    }),

  updateUserProfile: protectedProcedure
    .input(AccountDetailsValidator)
    .mutation(async ({ ctx, input }) => {
      const {
        session: {
          user: { id },
        },
      } = ctx;
      const { name, gender, birthDay, height, weight, lengthUnit, weightUnit } =
        input;

      if (
        !id ||
        !name ||
        !gender ||
        !birthDay ||
        !lengthUnit ||
        !weightUnit ||
        !height ||
        !weight
      ) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const user = await ctx.db.user.update({
        where: {
          id,
        },
        data: input,
      });

      return user;
    }),

  searchFood: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      if (!input) return [];

      const foods = await ctx.db.food.findMany({
        where: {
          OR: [
            {
              description: {
                startsWith: input,
                mode: "insensitive",
              },
            },
          ],
        },
        take: 10,
      });

      return foods;
    }),
});
