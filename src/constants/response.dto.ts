

export class AppResponseDto {
    constructor(statusCode: Number, message: string, data: Object) {

        this.statusCode = statusCode
        this.message = message
        this.data = data

    }

    statusCode: Number;

    message: string = "";

    data: Object;
}