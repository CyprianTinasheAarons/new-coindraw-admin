import httpCommon from "./http-common";

class DistributeService {
  create = (data) => {
    return httpCommon.post("/distributes", data);
  };

  getAll = () => {
    return httpCommon.get("/distributes");
  };
}

export default new DistributeService();
