import axios from 'axios';
import cogoToast from '../components/cogo-toast';
import { logout, useAuthStore } from '../stores/auth';

class Api {
  constructor() {
    this.baseUrl = '/api';
  }

  // prep() {
  //   this.token = useAuthStore.getState().token;
  //   if (this.token) {
  //     this.config = {
  //       headers: { authToken: `Bearer ${this.token}` },
  //     };
  //   }
  // }
  config(options) {
    const token = useAuthStore.getState().token;
    if (token) {
      return {
        headers: { Authorization: `Bearer ${token}` },
        ...options,
      };
    }
  }

  async runAxios(thePromise) {
    try {
      const { data } = await thePromise();
      return data;
    } catch (e) {
      const { status, data } = e.response;

      if (status === 401) {
        logout();
      }

      cogoToast.error(`${status}: ${data.message}`, {
        position: 'bottom-right',
      });
      throw e;
    }
  }

  get(url) {
    return this.runAxios(() => axios.get(`${this.baseUrl}/${url}`, this.config()));
  }

  post(url, params) {
    return this.runAxios(() => axios.post(`${this.baseUrl}/${url}`, params, this.config()));
  }

  patch(url, params) {
    return this.runAxios(() => axios.patch(`${this.baseUrl}/${url}`, params, this.config()));
  }

  delete(url, params) {
    return this.runAxios(() =>
      axios.delete(`${this.baseUrl}/${url}`, this.config({ data: params }))
    );
  }
}

export default new Api();
