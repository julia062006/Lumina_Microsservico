import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class HttpService {
    readonly instance: AxiosInstance;

    constructor(cfg: ConfigService) {
        this.instance = axios.create({
            baseURL: cfg.get('BACKEND_URL', 'http://localhost:3000'),
            timeout: 5000,
            headers: { 'x-api-key': cfg.get('INTERNAL_API_KEY', '') },
        });
    }
}