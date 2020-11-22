import { observable,computed, action, runInAction } from "mobx";

class Store {
  @observable userInfo = JSON.parse(localStorage.getItem('user_info')) || null;
  @observable theme = localStorage.getItem('sign') || null;
  @observable back = false;
  @observable showDetail = false;
  @computed get userName(){
    return this.userInfo;
  }
  @computed get color(){
    return this.theme;
  }
  @action setUserInfo = (userInfo = {userName: '',userId: '',token: ''}) => {
    runInAction(() => {
      this.userInfo = userInfo
    });
  }
  @action setBack = () => {
    runInAction(() => {
      this.back = true
    })
  }
  @action setShowDetail = () => {
    runInAction(() => {
      this.showDetail = true
    })
  }
  @action setTheme = (theme) => {
    runInAction(() => {
      this.theme = theme
    });
  }
  @action clearUserInfo = () => {
    runInAction(() => {
      this.userInfo = null
    });
  };
}

const UserStore = new Store();

export default UserStore;
