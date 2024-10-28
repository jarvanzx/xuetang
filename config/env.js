/**
 * 全局配置文件
 */
// 环境模式（production：生产环境，development：测试）
const ENV = 'production';

// 接口基础域名
// const API_BASE_URL = process.env.NODE_ENV === 'production' ? "https://xdxcx.qifudaren.net" : "http://120.79.97.130:8080";
const IMG_BASE_URL = ENV === 'production' ? "https://jzxt.qifudaren.net" : "http://120.79.97.130:8080";
const API_BASE_URL = ENV === 'production' ? "https://jzxt.qifudaren.net" : "https://jzxt.qifudaren.net";
const FROM = 1;
const IMG_URL = ENV === 'production' ? "https://xdxcx.qifudaren.net/jeecg-boot/sys/common/static/" :
  "http://120.79.97.130:8080/jeecg-boot/sys/common/static/";
const IMG_VERSION = ""; // 图片资源版本
const ENV_VERSION = ""; // 小程序版本类型
const USER_ID_KEY = "USERID";
const TOKEN_KEY = "token";
const AMAP_KEY = "de53567d547c1392f94d1673464dddbc"
const ALIY_KEY =
  "O+Xi1dt47jJ3dY07c4Lv1+fl1+iekbkpgdJ6POnT1W7SqH8qUaBCAZI36S7CzvewEFk9wfCqpgZY89lc1kopRlBPwyJuTqZiaEzrtIHn9w4yvJ4Jbk8u4ip162DjIrCC6qQyNyII3R8wYX6y7q4KBJWeolR4GMGZeqiFaDy2gbUltfflF7soSaplR9P8f6u0vBd0PW7GJVA2jnuz8XdkBLURxPhJuKVrKfj8gF9flLmNQmaG/IzcHP/Fk6NXF+bJMQlYASNrXltQqGEqCvDVhop+hNHOsuB+n0r5j70Pgjx+LKDgIvpkmQ=="

module.exports = {
  ENV,
  API_BASE_URL,
  FROM,
  IMG_URL,
  IMG_VERSION,
  ENV_VERSION,
  USER_ID_KEY,
  TOKEN_KEY,
  IMG_BASE_URL,
  AMAP_KEY,
  ALIY_KEY
}