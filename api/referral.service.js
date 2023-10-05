import httpCommon from "./http-common";

class ReferralService {
  create(data) {
    return httpCommon.post("/referral", data);
  }

  get(id) {
    return httpCommon.get("/referral/" + id);
  }

  updateData(data) {
    return httpCommon.put("/referral/profile/" + data.id, data.data);
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
  sendEmail(data) {
    return httpCommon.post("/referral/send-email", data);
  }

  requestPayout(data) {
    return httpCommon.post("/referral/request-payout", data);
  }

  requestNewCode(data) {
    return httpCommon.post("/referral/request-new-code", data);
  }

  requestDateExtension(data) {
    return httpCommon.post("/referral/request-date-extension", data);
  }

  acceptPayout(data) {
    return httpCommon.put("/referral/accept-payout", data);
  }

  acceptNewCode(data) {
    return httpCommon.put("/referral/accept-new-code", data);
  }

  acceptDateExtension(data) {
    return httpCommon.put("/referral/accept-date-extension", data);
  }

  applyAsReferrer(data) {
    return httpCommon.post("/referral/apply-as-referrer", data);
  }

  acceptReferrer(data) {
    return httpCommon.post("/referral/accept-referrer", data);
  }

  updatePayoutDetails(data) {
    return httpCommon.put("/referral/update-payout-details", data);
  }
}

const referralService = new ReferralService();

export default referralService;
