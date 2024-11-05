import {
  request,
  login,
  toUploadFile
} from "../utils/request"

const Api = {
  toUploadFile,
  login,
  // 微信小程序登录
  loginByThirdlogin: data => request("/api/xiluedu.user/thirdlogin", "post", data), // code  platform：wxmini
  aliQuickLogin: data => request("/api/xiluedu.user/oneClickLogin", "post", data), // code  platform：wxmini
  // 
  getUserInfo: data => request("/api/xiluedu.user/info", "get", data), //
  loginByCode: data => request("/api/xiluedu.user/wxlogin", "post", data), // code  platform：wxmini
  postOpenIdByCode: data => request("/api/xiluedu.user/get_wx_open_id", "post", data), // code  platform：wxmini
  getMobileByCode: data => request("/api/xiluedu.user/get_wx_mobile", "post", data), // phone_code  platform：wxmini
  // 获取轮播图
  getBanners: data => request("/api/xiluedu.banner/banners", "get", data), // group :首页 => index
  // 免费专区 => free
  // 微课专区 => wei
  // 商城首页顶部 => shop_index
  // 商城首页推荐专题 => shop_home_recommend
  // 商品列表顶部 => shop_goods_recommend
  // 获取免费课程列表
  getFreeCourse: data => request("/api/xiluedu.course_free/course_free", "get", data),
  // 线下课程列表
  getOfflineCourse: data => request("/api/xiluedu.offline_course/lists", "get", data), // page  pagesize
  // 树状分类（带层级）
  getCourseCategory: data => request("/api/xiluedu.course_category/list_tree", "get", data), // category_id
  // 获取课程详情
  getCourseDetail: data => request("/api/xiluedu.course/detail", "get", data), //course_id
  // 首页推荐音频和推荐系列课程教师信息
  getCourseCollection: data => request("/api/xiluedu.user/course_collection", "get", data), //course_id 收藏列表
  getCourseComments: data => request("/api/xiluedu.course_comment/lists", "get", data), //course_id 课程评价
  getCourseRank: data => request("/api/xiluedu.activity/gift_log", "get", data), //学习排名
  postStudyTime: data => request("/api/xiluedu.course/play_time", "post", data), //course_id 学习时间
  getVipList: data => request("/api/xiluedu.vip/lists", "get", data), //VIP
  createVipOrder: data => request("/api/xiluedu.vip_order/create_order", "post", data), //VIP order
  createOfflineOrder: data => request("/api/xiluedu.offline_order/create_order", "post", data), //线下课程 order
  getHomeDashbord: data => request("/api/home/dashbord", "get", data), //group: index
  createRewardOrder: data => request("/api/xiluedu.reward_order/create_order", "post", data), // 打赏订单
  toPayOrder: data => request("/api/xiluedu.pay/pay", "post", data), // 唤起支付
  getHomeRecommendCourse: data => request("/api/home/recommend_course", "get", data), //home_teacher_id: 1
  getForumList: data => request("/api/xiluedu.forum/lists", "get", data), //topic_id: 0 成长圈
  getForumCircleHeader: data => request("/api/xiluedu.forum/circle_header", "get", data), //
  getForumMyList: data => request("/api/xiluedu.forum/my_lists", "get", data), //topic_id: 0 成长圈为0, 发布到笔记为1
  deleteNotes: data => request("/api/xiluedu.forum/del_forum", "post", data), //forum_id 删除笔记
  updateNotes: data => request("/api/xiluedu.forum/update_forum", "post", data), //forum_id 修改笔记
  addForum: data => request("/api/xiluedu.forum/add_forum", "post",
    data), //topic_id: 0 成长圈为0, 发布到笔记为1  content:'',images: ''
  getTeacherDetail: data => request("/api/xiluedu/teacher/detail", "get", data), //教师详情
  getCourseList: data => request("/api/xiluedu/course/lists", "get", data), //课程分类 0-所有 1-免费专区 2-微课专区
  getBookCount: data => request("/api/xiluedu.course/book_board", "get", data), //书籍数量api/xiluedu.article/board 
  getTeacherList: data => request("/api/xiluedu/teacher/lists", "get", data), //教师列表
  courseCommentFav: data => request("/api/xiluedu.course_comment/comment_like", "post", data),
  getShopCategory: data => request("/addons/shopro/category", "get", data),
  getShopGoodList: data => request("/addons/shopro/goods.goods", "get", data),
  getShopGoodDetail: data => request("/addons/shopro/goods.goods/detail", "get", data),
  getShopGoodComment: data => request("/addons/shopro/goods.comment", "get", data),
  postCommonUpload: data => request("/api/common/upload", "post", data),
  getForumDetail: data => request("/api/xiluedu.forum/detail", "get", data),
  postAddComment: data => request("/api/xiluedu.forum_comment/add_comment", "post", data),
  getCommentList: data => request("/api/xiluedu.forum_comment/lists", "get", data),
  postToggleFav: data => request("/api/xiluedu.forum/toggle_fav", "post", data),
  postSaveCircle: data => request("/api/xiluedu.forum/save_circle", "post", data),
  getCourceDetail: data => request("/api/xiluedu/course/detail", "get", data),
  addCourseComment: data => request("/api/xiluedu.course_comment/add_comment", "post", data),
  getCourceGuessLike: data => request("/api/xiluedu.course/guess_like", "get", data),
  postToggleCollect: data => request("/api/xiluedu.course/toggle_collection", "post", data),
  postCreateOrder: data => request("/api/xiluedu.course_order/create_order", "post", data),
  postUpdateCart: data => request("/addons/shopro/cart/update", "post", data),
  getCart: data => request("/addons/shopro/cart", "get", data),
  postCalcOrder: data => request("/addons/shopro/order.order/calc", "post", data),
  postCalcOrder: data => request("/addons/shopro/order.order/calc", "post", data),
  getAddressDefault: data => request("/addons/shopro/user.address/default", "get", data),
  getAddressList: data => request("/addons/shopro/user.address", "get", data),
  getAreaList: data => request("/addons/shopro/data.area", "get", data),
  postAddress: data => request("/addons/shopro/user.address/add", "post", data),
  getDetailAddress: data => request("/addons/shopro/user.address/detail", "get", data),
  postDetailAddress: data => request("/addons/shopro/user.address/edit", "post", data),
  postGoodsCreateOrder: data => request("/addons/shopro/order.order/create", "post", data),
  getDetailOrder: data => request("/addons/shopro/order.order/detail", "get", data),
  getOrderList: data => request("/addons/shopro/order.order", "get", data),
  getCouponList: data => request("/addons/shopro/coupon", "get", data),
  getUserCoupon: data => request("/addons/shopro/user.coupon", "get", data),
  postCouponGet: data => request("/addons/shopro/coupon/get", "post", data),
  getArticleCategoryList: data => request("/api/xiluedu.article_category/lists", "get", data),
  getArticleList: data => request("/api/xiluedu.article/lists", "get", data),
  postFavorite: data => request("/addons/shopro/user.goods_log/favorite", "post", data),
  getGoodsFavs: data => request("/addons/shopro/user.goods_log", "get", data),
  shopOrderPrePay: (data, header) => request("/addons/shopro/pay/prepay", "post", data, header),
  withdrawalLog: (data) => request("/addons/shopro/withdraw", "get", data),
  commissionLog: (data) => request("/addons/shopro/commission.order/index", "get", data),
  postFeedback: (data) => request("/api/xiluedu.feedback/feedback", "post", data),
  getMyStudy: (data) => request("/api/xiluedu.user/study", "get", data),
  getMyInvite: data => request("/api/xiluedu.user/my_invite", "get", data),
  getFeedTypes: (data) => request("/api/xiluedu.feedback/feedback_reasons", "get", data),
  getPosterQrcode: (data) => request("/api/xiluedu.user/poster", "get", data),
  getAgreement: (data) => request("/api/xiluedu.singlepage/article", "get", data),
  postUserInfo: (data) => request("/api/xiluedu.user/profile", "post", data),
  getCourseByCode: (data) => request("/api/xiluedu.course/code_course", "get", data),
  postCodeToCourse: (data) => request("/api/xiluedu.course/exchange_course", "post", data),
  postGoodsComment: (id, data) => request("/addons/shopro/order.order/comment?id=" + id, "post", data),
  replyGoodsComment: data => request("/addons/shopro/order.order/reply_comment", "post", data),
  getLottery: (data) => request("/api/xiluedu.lottery/lottery_detail", "get", data),
  getLotteryList: (data) => request("/api/xiluedu.lottery/lottery", "get", data),
  go_lottery: (data) => request("/api/xiluedu.lottery/go_lottery", "post", data),

  postLottery: (data) => request("/api/xiluedu.lottery/go_lottery", "post", data),
  course_file_list: (data) => request("/api/xiluedu/course/course_file_list", "get", data),
  messageList: (data) => request("/api/xiluedu.message/user_list", "get", data),
  messageRead: (data) => request("/api/xiluedu.message/read", "post", data),
  getMessageSumary: (data) => request("/api/xiluedu.message/summary", "get", data),
  applyWithdraw: (data, header) => request("/addons/shopro/withdraw/apply", "post", data, header),
  saveWithdrawAccount: (data) => request("/addons/shopro/user.account/save", "post", data),
  getWithdrawAccount: (data) => request("/addons/shopro/user.account", "get", data),
  cartDelete: (data) => request("/addons/shopro/cart/delete", "delete", data),
  postChapterCollect: (data) => request("/api/xiluedu.course/course_file_collection", "post", data),
  getChapterCollect: (data) => request("/api/xiluedu.user/course_file_collection", "get", data),
  confirmOrder: (data) => request("/addons/shopro/order.order/confirm", "post", data),
  applyAftersale: (data) => request("/addons/shopro/order.aftersale/add", "post", data),
  getExpress: (data) => request("/addons/shopro/order.express", "get", data),
  getSearchKey: (data) => request("/api/xiluedu/course/hot_key_word_list", "get", data),
  getOrderCoupons: (data) => request("/addons/shopro/order.order/coupons", "post", data),








































  // getJobs: data => request("/jeecg-boot/xindong/jobs", "get", data),
  // bindPhone: data => request("/jeecg-boot/xindong/phone", "put", data),
  // // /jeecg-boot/xindong/isshow/poster
  // getPoster: data => request("/jeecg-boot/xindong/isshow/poster", "get", data),
  // getQrcode: data => request("/jeecg-boot/xindong/service/qrcode", "get", data),
  // getRecommendUser: data => request("/jeecg-boot/xindong/user/random", "get", data),
  // getWallList: data => request("/jeecg-boot/xindong/wall", "get", data),
  // getUserInfoById: data => request("/jeecg-boot/xindong/info", "get", data),
  // editUserInfo : data => request("/jeecg-boot/xindong/users/edit", "put", data),
  // // 推广业绩管理
  // getPromotionPerformances: data => request("/jeecg-boot/promotion/performances", "get", data),
  // // 推广员个人信息
  // getPromotersProfile: data => request("/jeecg-boot/promoters/profile", "get", data),
  // // 获取当前推广员的业绩
  // getPromotersPerformances: data => request("/jeecg-boot/promoters/performances", "get", data),
  // // 获取图形验证码
  // getRandomImage: data => request("/jeecg-boot/sys/randomImage/1629428467008", "get", data),
  // getAnnouncement: data => request("/jeecg-boot/announcement", "get", data),
  // //  推广业账号密码登录
  // loginByAccount: data => request("/jeecg-boot/sys/login", "post", data),
  // 推广员个人信息（小程序接口） /promoters/profile
  // 获取当前推广员的业绩（小程序接口） /promoters/performances
  // uploadFile: data => request("/lbsu/common/upload", "post", data),
  // getActiveList: data => request("/lbsu/activity/activity/list", "get", data),
  // deleteActive: data => request("/lbsu/activity/activity/delete", "get", data),
  // siteLogin: data => request("/lbsu/site/login", "post", data),
  // getGoodsList: data => request("/lbsu/activity/goods/list", "get", data),
  // createGoods: data => request("/lbsu/activity/goods/create", "post", data),
  // getGoodsView: data => request("/lbsu/activity/goods/view", "post", data),
  // deleteGoods: data => request("/lbsu/activity/goods/delete", "post", data),
  // updateGoods: data => request("/lbsu/activity/goods/update", "post", data),
  // createOrder: data => request("/lbsu/activity/order/create", "post", data),
  // deleteOrder: data => request("/lbsu/activity/order/delete", "post", data),
  // getGoodsOrders: data => request("/lbsu/activity/goods/orders", "post", data),
  // getOrderList: data => request("/lbsu/activity/order/list", "get", data),
  // getOrderView: data => request("/lbsu/activity/order/view", "get", data),
  // toOrderUse: data => request("/lbsu/activity/order/use", "get", data),
  // toMarkOrder: data => request("/lbsu/activity/order/mark", "get", data),
  // deleteGoodsOrder: data => request("/lbsu/activity/order/goods-delete", "post", data),
  // getRechargeList: data => request("/lbsu/recharge/list", "post", data),
  // paySubmit: data => request("/lbsu/recharge/submit", "post", data),
  // getPointsList: data => request("/lbsu/common/points-log", "get", data),

  // deleteGoods2: data => request("/lbsu/activity/order/goods-delete", "post", data),

}
export default Api;