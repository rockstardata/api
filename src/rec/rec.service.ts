import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface Payment {
  amount: number;
  type: string;
  deleted?: boolean;
}

export interface Bill {
  payments?: Payment[];
}

export interface TabData {
  id: string;
  bills?: Bill[];
  [key: string]: any;
}

export interface PaymentSummary {
  tabId: string;
  totalAmount: number;
  paymentCount: number;
  payments: {
    amount: number;
    type: string;
  }[];
}

@Injectable()
export class RecService {
  private readonly API_BASE_URL = 'https://api.last.app/v2';
  private readonly AUTH_TOKEN = '2bd95fcf-31dd-410a-88af-23330e7762e4';

  constructor(private readonly httpService: HttpService) {}

  private getHeaders(locationId: string) {
    return {
      Authorization: `Bearer ${this.AUTH_TOKEN}`,
      locationId,
    };
  }

  async getTabById(tabId: string, locationId: string): Promise<TabData> {
    try {
      const url = `${this.API_BASE_URL}/tabs/${tabId}`;
      const { data } = await firstValueFrom(
        this.httpService.get<TabData>(url, {
          headers: this.getHeaders(locationId),
        })
      );
      return data;
    } catch (error) {
      throw new Error(`Error fetching tab data: ${error.message}`);
    }
  }

  async calculatePayments(tabId: string, locationId: string): Promise<PaymentSummary> {
    const tabData = await this.getTabById(tabId, locationId);
    
    let totalAmount = 0;
    const payments: { amount: number; type: string }[] = [];

    tabData.bills?.forEach(bill => {
      bill.payments?.forEach(payment => {
        if (!payment.deleted && payment.amount) {
          totalAmount += payment.amount;
          payments.push({
            amount: payment.amount,
            type: payment.type || 'unknown'
          });
        }
      });
    });

    return {
      tabId: tabData.id,
      totalAmount,
      paymentCount: payments.length,
      payments
    };
  }
}