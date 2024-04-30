/**
 * 这种是用在后端格式是{code,message,data},数据放在data里面
 */
export type RespInfo<T = undefined> = T extends undefined
  ? {
      retCode: number;
      retMessage: string;
      timestamp: number;
    }
  : {
      retCode: number;
      retMessage: string;
      timestamp: number;
      data: T;
    };
