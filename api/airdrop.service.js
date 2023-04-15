import httpCommon from "./http-common";

class AirdropService {
  create = (data) => {
    return httpCommon.post("/airdrops", data);
  };

  getAll = () => {
    return httpCommon.get("/airdrops");
  };
}

export default new AirdropService();
