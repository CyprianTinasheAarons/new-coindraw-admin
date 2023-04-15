import http from './http-common';


class TransactionService  {
        getAll(){
                return http.get('/transactions');
        }

        get(id){
            return http.get(`/transactions/${id}`);
        }

        create(data){
            return http.post('/transactions', data);
        }

        update(id, data){
            return http.put(`/transactions/${id}`, data);
        }

        delete(id){
            return http.delete(`/transactions/${id}`);
        }

        deleteAll(){
            return http.delete(`/transactions`);
        }

        findByTitle(title){
            return http.get(`/transactions?title=${title}`);
        }
}

export default new TransactionService();