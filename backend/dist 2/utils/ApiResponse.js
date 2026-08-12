export class ApiResponse {
    success;
    message;
    data;
    constructor(data = null, message = 'Success') {
        this.success = true;
        this.message = message;
        this.data = data;
    }
}
