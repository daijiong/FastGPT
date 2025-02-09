import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@/service/response';
import { connectToDatabase, Chat } from '@/service/mongo';
import { authUser } from '@fastgpt/service/support/user/auth';

export type Props = {
  chatId: string;
  customTitle?: string;
  top?: boolean;
};

/* 更新聊天标题 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();
    const { chatId, customTitle, top } = req.body as Props;

    const { userId } = await authUser({ req, authToken: true });

    await Chat.findOneAndUpdate(
      {
        chatId,
        userId
      },
      {
        ...(customTitle ? { customTitle } : {}),
        ...(top ? { top } : { top: null })
      }
    );
    jsonRes(res);
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
