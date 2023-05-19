import httpCommon from "./http-common";

class DiscountService {
    create(data) {
        return httpCommon.post("/discount", data);
    }
    
    get(data) {
        return httpCommon.get("/discount/"+ data.id, data);
    }
    
    getAll() {
        return httpCommon.get("/discount/");
    }

    update(data) {
        return httpCommon.put("/discount/"+ data.id, data);
    }
    
    delete(id) {
        return httpCommon.delete("/discount/" + id);
    }
}

const discountService = new DiscountService();

export default discountService;