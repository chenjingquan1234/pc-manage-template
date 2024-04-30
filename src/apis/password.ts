import { RespInfo } from "@/types/api";
import {
  CheckUserHasWiiPassword,
  CheckWiiPassword,
  CipherAuth,
  GetCertToken,
  GetCipherToken,
  ResetUserWiiPassword,
  SaveUserWiiPassword,
  UpdateUserWiiPassword,
} from "@/types/api/password";
import { post, get } from "@/utils/requests";

export default {
  name: "password",
  /**
   * 校验密码格式
   */
  checkWiiPassword: (param: CheckWiiPassword["param"]) => {
    return post<RespInfo<CheckWiiPassword["resp"]>>(
      "/cipherauth/checkWiiPassword",
      param,
      {}
    );
  },

  /**
   * 保存密码
   */
  saveUserWiiPassword: (param: SaveUserWiiPassword["param"]) => {
    return post<RespInfo<SaveUserWiiPassword["resp"]>>(
      "/cipherauth/saveUserWiiPassword",
      param,
      {
        msgConfig: {
          errorMsg: true,
        },
      }
    );
  },

  /**
   * 修改密码
   */
  updateUserWiiPassword: (param: UpdateUserWiiPassword["param"]) => {
    return post<RespInfo<SaveUserWiiPassword["resp"]>>(
      "/cipherauth/updateUserWiiPassword",
      param,
      {
        msgConfig: {
          errorMsg: true,
        },
      }
    );
  },

  /**
   * 获取密码认证凭证
   */
  getCipherToken: (param: GetCipherToken["param"]) => {
    return post<RespInfo<GetCipherToken["resp"]>>(
      "/cipherauth/getCipherToken",
      param,
      {}
    );
  },

  /**
   * 密码认证
   */
  cipherAuth: (param: CipherAuth["param"]) => {
    return post<RespInfo<CipherAuth["resp"]>>(
      "/cipherauth/cipherAuth",
      param,
      {
        msgConfig: {
          errorMsg: true,
        },
      }
    );
  },
  /**
   * 获取认证凭证
   */
  getCertToken: (param: GetCertToken["param"]) => {
    return post<RespInfo<GetCertToken["resp"]>>(
      "/cipherauth/getCertToken",
      param,
      {}
    );
  },

  /**
   * 重置密码
   */
  resetUserWiiPassword: (param: ResetUserWiiPassword["param"]) => {
    return post<RespInfo<ResetUserWiiPassword["resp"]>>(
      "/cipherauth/resetUserWiiPassword",
      param,
      {
        msgConfig: {
          errorMsg: true,
        },
      }
    );
  },

  /**
   * 查询是否开通微警密码
   */
  checkUserHasWiiPassword: (param: CheckUserHasWiiPassword["param"]) => {
    return post<RespInfo<CheckUserHasWiiPassword["resp"]>>(
      "/cipherauth/checkUserHasWiiPassword",
      param,
      {
        msgConfig: {
          errorMsg: true,
        },
      }
    );
  },
};
