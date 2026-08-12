export class ApiResponse<T = unknown> {
  success: true;
  message: string;
  data: T | null;

  constructor(data: T | null = null, message = 'Success') {
    this.success = true;
    this.message = message;
    this.data = data;
  }
}
