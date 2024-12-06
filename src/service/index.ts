import * as coinReq from "./coin";
import * as userReq from "./user";
import * as corsReq from "./cors"
export default {
    ...coinReq,
    ...userReq,
    ...corsReq
}