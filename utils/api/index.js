import { wxRequest } from "../wxRequest";

// 登录
export const loginphoneReq = (data) => wxRequest('/rcapi/user/loginphone', data, 'get')

// 省市区
export const getRegionReq = (data) => wxRequest('/crm/company/getRegionChildList', data, 'get')

// 人才列表
export const talentListReq = (data) => wxRequest('/rcapi/talent/list', data, 'get')

// 职位
export const jobLabelSelectReq = (data) => wxRequest('/rcapi/talent/jobLabelSelect', data, 'get')

// 人才详情
export const resumeDetailReq = (data) => wxRequest('/rcapi/talent/resumeDetail', data, 'get')

// 收藏
export const collectionResume = (data) => wxRequest('/rcapi/talent/collectionResume', data, 'get')

// 缓存再登录
export const getuserinfoReq = (data) => wxRequest('/rcapi/user/getuserinfo', data, 'get')

// 生成订单接口 - vip相关
export const createVipOrderReq = (data) => wxRequest('/rcapi/vip/buyVip', data, 'get')

// 获取订单详情接口 - vip相关
export const getVipOrderReq = (data) => wxRequest('/xxx/xxx/xxx', data, 'get')

// 微信支付唤起得到五个参数
export const evokePaymentReq = (data) => wxRequest('/rcapi/vip/vipPay', data, 'get')

// 编辑信息接口
export const userinfoEditReq = (data) => wxRequest('/rcapi/user/userinfoEdit', data, 'POST')

// 联系人才增加接口
export const contactTalentReq = (data) => wxRequest('/rcapi/talent/contactlog', data, 'POST')

// 联系人才增加接口
export const getDxtOpenidReq = (data) => wxRequest('/api/tool/getDxtOpenid', data, 'POST')

