import Api from "../api"
/**
 * @param {'course'|'vip'|'offline'|'reward'} type
 * @param {'createVipOrder'|'createRewardOrder'|'postCreateOrder'|'createOfflineOrder'} orderMethod 
 * @param {string} id
 * @param {string} key
 * @param {string} title
 */
async function pay(type, orderMethod, id, key, title) {
  const resKeyMap = {
    'course': 'pay_price',
    'vip': 'pay_price',
    'offline': 'pay_price',
    'reward': 'pay_amount'
  }
  try {

    const appres = await Api[orderMethod]({
      [key]: id,
      // #ifdef APP
      platform: 'app',
      // #endif
      // #ifdef MP-WEIXIN
      platform: 'wxmini',
      // #endif
    })
    if (appres.code === 1) {
      const {
        id,
      } = appres.data

      uni.navigateTo({
        url: `/pages/pay/pay?order_id=${id}&type=${type}&price=${appres.data[resKeyMap[type]]}&title=${title}&action=course`
      })
    }
  } catch (e) {
    //TODO handle the exception
  }
}

module.exports = {
  pay
}