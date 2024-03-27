export interface LoginDetails {
  username: string;
  password: string;

  onError(reason: number): void
}
