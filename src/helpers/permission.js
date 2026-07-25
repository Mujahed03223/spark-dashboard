export default class Permission {
  setControls(path) {
    let status;
    if (localStorage.getItem("spark_dash_User_Type") != "superadmin") {
      if (localStorage.getItem("spark_controls")) {
        let controls = JSON.parse(localStorage.getItem("spark_controls"));
        const found = controls.find((control) => control.url == path);

        if (found) {
          status = false;
        } else {
          status = true;
        }
      }
    } else {
      status = false;
    }
    return status;
  }
  allowed(path) {
    let status;
    if (localStorage.getItem("spark_dash_User_Type") != "superadmin") {
      if (localStorage.getItem("spark_dash_permissions")) {
        let controls = JSON.parse(
          localStorage.getItem("spark_dash_permissions")
        );
        const found = controls.find((control) => control?.url == path);

        // console.log(found?.name);

        if (found) {
          status = false;
        } else {
          status = true;
        }
      }
    } else {
      status = false;
    }
    return status;
  }
}
