import httpCommon from "./http-common";

class ReferralService {
  create(data) {
    return httpCommon.post("/referral", data);
  }

  getAll() {
    return httpCommon.get("/referral");
  }

  update(data) {
    return httpCommon.put("/referral", data);
  }

  sendReward(data) {
    return httpCommon.put("/referral/send-reward", data);
  }

  setPercentage(data) {
    return httpCommon.put("/referral/update-referral-percentage", data);
  }

  delete(id) {
    return httpCommon.delete("/referral/" + id);
  }
}

const referralService = new ReferralService();

export default referralService;
