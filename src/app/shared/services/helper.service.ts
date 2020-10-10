import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from '../../../environments/environment';
import { NzModalService } from 'ng-zorro-antd/modal';


@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private message: NzMessageService,
    private modal: NzModalService,
    private titleService: Title) {

  }

  presentMessageModal(type, title, message) {

    switch (type) {
      case 'success':
        this.modal.success({
          nzTitle: title,
          nzContent: message
        });
        break
      case 'error':
        this.modal.error({
          nzTitle: title,
          nzContent: message
        });
        break
      case 'warning':
        this.modal.warning({
          nzTitle: title,
          nzContent: message
        });
        break
      case 'info':
        this.modal.info({
          nzTitle: title,
          nzContent: message
        });
        break
    }
  }

  presentMessage(type, message) {
    this.message.create(type, message);
  }

  presentMessageWithLoading(message) {
    this.message.loading(message);
  }

  dismissMessage(id) {
    this.message.remove(id);
  }

  setTitle(title: string): void {
    this.titleService.setTitle(title + ' | ' + environment.appName);
  }
}
