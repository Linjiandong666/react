import ajax from './ajax';

export const reqLogin=(username,password)=>{
  return ajax('/login',{username,password},'post');
};