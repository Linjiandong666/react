import ajax from './ajax';
import jsonp from 'jsonp';
import { message } from 'antd';

export const reqLogin=(username,password)=>{
  return ajax('/login',{username,password},'post');
};

export const reqValidateUserInfo = (id) => ajax('/validate/user', {id}, 'POST');

//请求天气
//这里让promise不会立即执行
export const reqWeather = function () {
  //包一层promise（拿到异步请求的返回值weatherImg: dayPictureUrl,
  //         weather）
  return new Promise((resolve)=>{
  jsonp(`http://api.map.baidu.com/telematics/v3/weather?location=深圳&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`,{},function (err,data) {
    if (!err){
      const {dayPictureUrl, weather}=data.results[0].weather_data[0];
      resolve({
        weatherImg: dayPictureUrl,
        weather
      });
    } else {
      message.error('请求天气信息失败~请刷新试试~');
      resolve();
    }
  })
  })
};

export const reqCategories = (parentId) => ajax('/manage/category/list', {parentId});