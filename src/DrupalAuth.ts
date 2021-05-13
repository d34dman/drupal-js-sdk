import {ApiClientInterface} from './interfaces';
import {Drupal} from './Drupal';

interface DrupalAuthUser {
  uid: string;
  roles: string[];
  name: string;
}
interface DrupalAuthStore {
  csrf_token?: string;
  logout_token?: string;
  current_user?: DrupalAuthUser;
}
export class DrupalAuth {
  drupal: Drupal;
  client: ApiClientInterface;
  store: DrupalAuthStore;

  constructor(drupal: Drupal) {
    this.drupal = drupal;
    this.client = drupal.core.getApiClientService();
    this.store = {};
    this.refreshUserSession();
  }

  refreshUserSession(): Promise<any> {
    this.store = {
      csrf_token: undefined,
      logout_token: undefined,
      current_user: {
        uid: '0',
        roles: ['anonymous'],
        name: 'Anonymous',
      },
    };
    return this.getSessionToken();
  }

  public getSessionToken(): Promise<any> {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    };
    return this.client
      .request('get', '/session/token', config)
      .then((response) => {
        const data = response.data;
        this.store.csrf_token = data;
        this.client.addDefaultHeaders({'X-CSRF-Token': data});
        return response;
      });
  }

  public login(name: string, password: string): Promise<any> {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      params: {
        _format: 'json',
      },
      data: {
        name,
        password,
      },
    };
    return this.client
      .request('post', '/user/login', config)
      .then((response) => {
        const data = response.data;
        this.store = data;
        this.client.addDefaultHeaders({'X-CSRF-Token': data.csrf_token});
        return response;
      });
  }

  public loginStatus(): Promise<boolean> {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      params: {
        _format: 'json',
      },
    };
    return this.client
      .request('get', '/user/login_status', config)
      .then((response) => {
        return response.data !== 0;
      });
  }

  public logout(): Promise<any> {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      params: {
        _format: 'json',
        token: this.store.logout_token,
      },
    };
    return this.client
      .request('post', '/user/logout', config)
      .then((response) => {
        // @TODO Reset user is authenticated status.
        return response;
      });
  }

  public passwordResetByUserName(name: string): Promise<any> {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      params: {
        _format: 'json',
      },
      data: {
        name,
      },
    };
    return this.client
      .request('post', '/user/password', config)
      .then((response) => {
        // @TODO Reset user is authenticated status.
        return response;
      });
  }

  public passwordResetByMail(mail: string): Promise<any> {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      params: {
        _format: 'json',
      },
      data: {
        mail,
      },
    };
    return this.client
      .request('post', '/user/password', config)
      .then((response) => {
        // @TODO Reset user is authenticated status.
        return response;
      });
  }
}
