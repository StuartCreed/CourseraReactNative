import { serverOffline } from '../shared/serverOffline';
/*serverOfflineMode is off at the moment as I could not get the below function to work yet so it can work from any location. Either that or I put it on a proper server*/

/*offlineCheck(serverOffline){
  if (serverOffline == true) {
    console.log("Server Offline Mode Selected");
    const baseUrlStatus = "";
  };

  else {
    console.log("Server Offline Mode Selected");
    const baseUrlStatus = "http://192.168.1.98:3001/";
  }
  return(baseUrlStatus)
};

() => this.offlineCheck()
*/

export const baseUrl ="http://192.168.1.98:3001/";
