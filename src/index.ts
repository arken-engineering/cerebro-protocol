import util from '@arken/node/util';
import { initTRPC } from '@trpc/server';
import { serialize, deserialize } from '@arken/node/util/rpc';
import type { Application, ApplicationModelType, ApplicationServiceType } from '@arken/node/types';
import { z } from 'zod';
import { createRouter as createCoreRouter } from './modules/core/core.router';
import type * as Arken from '@arken/node/types';
import * as dotenv from 'dotenv';

export const t = initTRPC.context<{}>().create();
export const router = t.router;
export const procedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

export const createRouter = (service: any) =>
  router({
    ask: procedure
      .input(
        z.object({
          mod: z.string().describe('mod'),
          messages: z.array(z.string()).describe('messages'),
          tags: z.array(z.string()).optional().describe('tags'),
          data: z.any().optional().describe('data'),
        })
      )
      .query(({ input, ctx }) => (service.ask as any)(input, ctx)),

    info: procedure.query(({ input, ctx }) => (service.info as any)(input, ctx)),

    auth: procedure
      .input(
        z.object({
          data: z.any(),
          signature: z.object({ hash: z.string(), address: z.string() }),
        })
      )
      .mutation(({ input, ctx }) => {
        return {
          status: 1,
          data: {
            maxClients: 100,
          },
        };
      }),

    core: createCoreRouter(t),
  });

export type Router = ReturnType<typeof createRouter>;

dotenv.config();

export default class Server implements Application {
  router: Router;
  service: ApplicationServiceType = {};
  model: ApplicationModelType = {};

  server: any;
  http: any;
  https: any;
  isHttps: boolean;
  cache: any;
  db: any;
  services: any;
  applications: any;
  application: any;
  filters: Record<string, any> = { applicationId: null };
}
