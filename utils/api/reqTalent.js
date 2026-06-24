import { wxRequest } from "../wxRequest";

// 个人端

// 职位列表
export const getJobListReq = (data) => wxRequest('/rcapi/job/list', data, 'get')

// 职位详情
export const getJobDetailReq = (data) => wxRequest('/rcapi/job/jobDeatil', data, 'get')
// 获取二维码
export const getRcCode = (data) => wxRequest('/common/getRcCode', data, 'get')

// 下拉列表数据
export const formSelectDataReq = (data) => wxRequest('/rcapi/job/formSelectData', data, 'get')

// 添加岗位
export const addPostDataReq = (data) => wxRequest('/rcapi/job/releaseJob', data, 'post')

// 收藏岗位
export const collectionJobReq = (data) => wxRequest('/rcapi/job/collectionJob', data, 'post')

// 添加或修改求职意向
export const addOrEditJobHuntingReq = (data) => wxRequest('/rcapi/jobIntention/addOrEdit', data, 'post')

// 获取意向
export const getJobHuntingReq = (data) => wxRequest('/rcapi/jobIntention/get', data, 'get')

// 删除意向
export const delJobHuntingReq = (data) => wxRequest('/rcapi/jobIntention/del', data, 'post')



// 删除正在招聘的职位
export const deleteZpingReq = (data) => wxRequest('/rcapi/job/deljob', data, 'post')



// 获取在线简历
export const getLineResume = (data) => wxRequest('/rcapi/user/getResumeinfo', data, 'get')

// 获取公司信息
export const getCompanyUserinfo = (data) => wxRequest('/rcapi/user/getCompnayInfo', data, 'get')

// 修改在线简历
export const userEditResumeReq = (data) => wxRequest('/rcapi/user/userEditResume', data, 'post')


// 公司信息编辑
export const EditCompnayinfoReq = (data) => wxRequest('/rcapi/user/EditCompnayinfo', data, 'post')

// 附件简历列表
export const resumeFilelistReq = (data) => wxRequest('/rcapi/resumeFile/list', data, 'post')

// 附件简历上传
export const resumeFileaddReq = (data) => wxRequest('/rcapi/resumeFile/add', data, 'post')

// 附件简历删除
export const resumeFiledelReq = (data) => wxRequest('/rcapi/resumeFile/del', data, 'post')

// 人才联系岗位添加
export const contactJobReq = (data) => wxRequest('/rcapi/job/contactlog', data, 'post')

// 一些统计数据
export const userStaReq = (data) => wxRequest('/rcapi/user/userSta', data, 'post')

// 一些统计数据
export const toudiReq = (data) => wxRequest('/rcapi/resumeFile/toudi', data, 'post')

// 这是年度会员季度会员的list
export const vipListDetailReq = (data) => wxRequest('/rcapi/vip/vipListDetail', data, 'post')

// 这是特惠年度会员季度会员的list
export const vipListDetailList = (data) => wxRequest('/rcapi/vip/vipListDetailList', data, 'post')

// 获得单条价格
export const singePriceReq = (data) => wxRequest('/rcapi/vip/singePrice', data, 'post')

//banner图信息
export const getBanner = (data) => wxRequest('/rcapi/job/getBanner', data, 'POST')


