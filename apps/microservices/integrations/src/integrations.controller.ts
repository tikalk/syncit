import { Controller, Delete, Get, Param, Req, Res } from '@nestjs/common';
import * as integrations from './integrations';
import { prisma } from './prisma';

@Controller()
export class IntegrationsController {
  @Get(':integration/:actions')
  async integrations(
    @Param() params,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const appHandler = integrations[params.integration][params.actions];
    return appHandler(request, response);
  }

  @Delete(':integration/:actions/:credId')
  async integrationsDelete(@Param() params, @Req() request, @Res() response) {
    try {
      const { user } = await prisma.session.findFirstOrThrow({
        where: { id: request.cookies['syncit-session-id'] },
        include: { user: true },
      });

      await prisma.credential.deleteMany({
        where: {
          type: params.integration,
          userId: user.id,
          id: parseFloat(params.credId),
        },
      });
      response.status(200).send('ok');
    } catch (e) {
      console.error('integrationsDelete', e);
      response.status(500).send(e);
    }
  }
}
