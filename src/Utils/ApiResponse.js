class ApiResponse {
    constructor(
        statusCode,
        message="success",
        data,
        // success=true
    ) {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode<400
    }
} 

module.exports = ApiResponse