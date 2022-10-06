import { Body, Controller, Delete, Get, Param, Req, Res } from '@nestjs/common';
import * as integrations from '@syncit2.0/integrations';
import { PrismaClient } from '@prisma/client';
import { getUserDataFromSessionId } from '@syncit2.0/core/utils';

const prisma = new PrismaClient();

@Controller('integrations')
export class IntegrationsController {
  @Get(':integration/:actions')
  async integrations(
    @Param() params,
    @Req() request: Request,
    @Res() response: Response
  ) {
    const appHandler = integrations[params.integration][params.actions];
    return appHandler(request, response);
  }

  @Delete(':integration/:actions/:credId')
  async integrationsDelete(@Param() params, @Req() request, @Res() response) {
    const userData = await getUserDataFromSessionId(request.cookies.sessionID);
    await prisma.credential.deleteMany({
      where: {
        type: params.integration,
        userId: userData.id,
        id: parseFloat(params.credId),
      },
    });
    response.status(200).send('ok');
  }
}
