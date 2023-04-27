import httpCommon from "./http-common";

class ReferralService {
  create(data) {
    return httpCommon.post("/referral", data);
  }

  get(data) {
    return httpCommon.get("/referral", data);
  }

  getAll() {
    return httpCommon.get("/referral/referrers");
  }

  getAllByReferrer(data) {
    return httpCommon.get("/referral/referrals", data);
  }

  getReferredUsers(data) {
    return httpCommon.get("/referral/referred-users", data);
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

  delete() {
    return httpCommon.delete("/referral");
  }
}

const referralService = new ReferralService();

export default referralService;
