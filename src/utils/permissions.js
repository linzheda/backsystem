import utils from "@/utils/utils";
class permissions {
    static hasCnt(flag,meta){
        let result = 0;
        let arr;
        if(utils.isNotEmpty(meta['btnPermissions'])){
             arr = meta['btnPermissions'].split(",");
        }else{
            return 0;
        }
        //校验
        if (flag.includes('||')) {
            let values = flag.split('||');
            for (let item of arr) {
                if (values.includes(item)) {
                    result++;
                }
            }
        } else {
            for (let item of arr) {
                if (item === flag) {
                    result = 1;
                    break;
                }
            }
        }
        return result;
    }
}

export default permissions;