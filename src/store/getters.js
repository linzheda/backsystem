import utils from "@/utils/utils";
const getters = {
  env: state => state.app.env,
  imei: state => state.app.imei,
  tagsView: state => state.app.tagsView,
  cachedViews: state => state.app.cachedViews,
  theme:state=>state.settings.theme,
  id: state => {return myGet(state.user.id,'id')},
  name: state => {return myGet(state.user.name,'name')},
  token: state =>{return myGet(state.user.token,'token')},
  menus:state=>state.user.menus||null,
};

function myGet(obj,key) {
  return utils.isNotEmpty(obj)? obj : (utils.isNotEmpty(localStorage[key] )? localStorage[key] : null)
}

export default getters
