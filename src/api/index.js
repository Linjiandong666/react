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
  let cancel=null;
                //包一层promise（拿到异步请求的返回值weatherImg: dayPictureUrl, weather）
  const promise=new Promise((resolve)=>{
  cancel=jsonp(`http://api.map.baidu.com/telematics/v3/weather?location=深圳&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`,{},function (err,data) {
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
  });

  return{
    promise,
    //取消ajax请求的方法
    cancel
  };
};



//动态请求商品数据
export const reqCategories = (parentId) => ajax('/manage/category/list', {parentId});

export const reqAddCategory = (parentId, categoryName) => ajax('/manage/category/add', {parentId, categoryName}, 'POST');

//暴露修改名称时的请求方法
export const reqUpdateCategoryName = (categoryId, categoryName) => ajax('/manage/category/update', {categoryId, categoryName}, 'POST');