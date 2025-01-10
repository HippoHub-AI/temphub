import { NewChaDto, UpdateChaDto } from "@dto/chat.dto";
import BaseApi from "./_baseApi";

export default class ChatApi extends BaseApi {
  baseUrl: string = "chat/";

  constructor() {
    super();
  }

  async newChat(dto: NewChaDto) {
    const data = await ChatApi.post(`${this.baseUrl}newChat`, dto);
    return data;
  }
  async updateChat(dto: UpdateChaDto) {
    const data = await ChatApi.post(`${this.baseUrl}updateChat`, dto);
    return data;
  }

  async getChatById(dto: { id: string }) {
    const data = await ChatApi.get(`${this.baseUrl}chatById/${dto?.id}`);
    return data;
  }

  async getAllChat(dto: { id: string }) {
    const data = await ChatApi.get(`${this.baseUrl}getAllChatsbyId/${dto?.id}`);
    return data;
  }
}
