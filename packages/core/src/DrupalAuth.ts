import {ClientInterface} from './interfaces';
import {Drupal} from './Drupal';

interface DrupalAuthUser {
  uid: string;
  roles: string[];
  name: string;
}
interface DrupalAuthStore {
  csrfToken?: string;
  logoutToken?: string;
  currentUser?: DrupalAuthUser;
}
export class DrupalAuth {
  drupal: Drupal;
  client: ClientInterface;
  store: DrupalAuthStore;

  constructor(drupal: Drupal) {
    this.drupal = drupal;
    this.client = drupal.getClient();
    this.store = {};
    this.refreshUserSession();
  }

  refreshUserSession(): Promise<any> {
    this.store = {
      csrfToken: undefined,
      logoutToken: undefined,
      currentUser: {
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
      .call('get', '/session/token', config)
      .then((response) => {
        const data = response.data;
        this.store.csrfToken = data;
        this.client.addDefaultHeaders({'X-CSRF-Token': data});
        return response;
      });
  }

  public login(name: string, pass: string): Promise<any> {
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
        pass,
      },
    };
    return this.client
      .call('post', '/user/login', config)
      .then((response) => {
        const data = response.data;
        this.store = data;
        this.client.addDefaultHeaders({'X-CSRF-Token': data.csrfToken});
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
      .call('get', '/user/login_status', config)
      .then((response) => {
        return response.data !== 0;
      });
  }

  public forcedLogout(): Promise<boolean> {
    if (this.store.logoutToken) {
      return this.logout()
      // @TODO Reset user is authenticated status.
        .then(() => true);
    }
    const config = {
      withCredentials: true,
    };
    return this.client
      .call('get', '/user/logout', config)
      // @TODO Reset user is authenticated status.
      .then(() => true);
  }

  public logout(): Promise<any> {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      params: {
        _format: 'json',
        token: this.store.logoutToken,
      },
    };
    return this.client
      .call('post', '/user/logout', config)
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
      .call('post', '/user/password', config)
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
      .call('post', '/user/password', config)
      .then((response) => {
        // @TODO Reset user is authenticated status.
        return response;
      });
  }

  public register(name: string, mail: string): Promise<any> {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      params: {
        _format: 'json',
      },
      data: {
        name: {
          value: name,
        },
        mail: {
          value: mail,
        },
      },
    };
    return this.client
      .call('post', '/user/register', config)
      .then((response) => {
        // @TODO Reset user is authenticated status.
        return response;
      });
  }
}
