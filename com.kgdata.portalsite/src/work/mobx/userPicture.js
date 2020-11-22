import { observable,computed, action, runInAction } from "mobx";

class Store {
  @observable tabValue = JSON.parse(localStorage.getItem('tabValue')) || null;
  @observable queryPersonOpt = JSON.parse(localStorage.getItem('queryPersonOpt')) || null;
  @observable queryGroupOpt = JSON.parse(localStorage.getItem('queryGroupOpt')) || null;
  @observable querySeatOpt = JSON.parse(localStorage.getItem('querySeatOpt')) || null;

  @action setTabValue = (value) => {
      runInAction(() => {
          this.tabValue = value
      })
  }
  @action setQueryPersonOpt = (queryPersonOpt) => {
    console.log(queryPersonOpt,'queryPersonOpt')
    runInAction(() => {
      this.queryPersonOpt = queryPersonOpt
    });
  }

  @computed get getPersonOpt () {
      return this.queryPersonOpt
  }
  @action setQueryGroupOpt = (queryGroupOpt) => {
    runInAction(() => {
      this.queryGroupOpt = queryGroupOpt
    });
  }
  @action setQuerySeatOpt = (querySeatOpt) => {
    runInAction(() => {
      this.querySeatOpt = querySeatOpt
    });
  }
  
}

const userPictureStore = new Store();

export default userPictureStore;
