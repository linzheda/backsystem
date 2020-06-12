const getters = {
  env: state => state.app.env,
  imei: state => state.app.imei,
  tagsView: state => state.app.tagsView,
  theme:state=>state.settings.theme,
  id: state => state.user.id,
  name: state => state.user.name,
  token: state => state.user.token,
  menus:state=>state.user.menus,
};
export default getters
