export interface CheckWiiPassword {
  param: {
    password: string;
  };
  resp: {};
}

// fama_wechat,//微警认证小程序
// fama_alipay,//微警认证支付宝小程序
// wiiservice,//微警小程序
// wiiauth;//微警app
type appSource =
  | "fama_wechat"
  | "fama_alipay"
  | "wiiservice"
  | "wiiauth"
  | string;

export interface SaveUserWiiPassword {
  param: {
    appSource: appSource | string;
    cipherCode: string;
    password: string;
    certToken?: string;
    userInfo?: {
      idNum: string;
      idNum: string;
      fullName: string;
      idType: string;
      nation: string;
      sex: string;
      birthDate: string;
      expiryDate: string;
    };
  };
  resp: {};
}

export interface UpdateUserWiiPassword {
  param: {
    appSource: appSource;
    cipherToken: string;
    cipherCode: string;
    password: string;
  };
  resp: {};
}

export interface GetCipherToken {
  param: {
    certToken?: string;
    cipherCode: string;
  };
  resp: string;
}

export interface CipherAuth {
  param: {
    cipherToken: string;
    cipherCode: string;
  };
  resp: {
    authNum: number;
    pass: boolean;
  };
}

export interface GetCertToken {
  param: {
    appSource: appSource;
    cipherCode: string;
    isNia: boolean;
  };
  resp: string;
}

export interface ResetUserWiiPassword {
  param: {
    appSource: appSource;
    certToken: string;
    cipherCode: string;
    password: string;
  };
  resp: {};
}

export interface CheckUserHasWiiPassword {
  param: {
    cipherCode: string;
  };
  resp: boolean;
}
