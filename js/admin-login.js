(function initialiseAdminLogin() {
  const status = document.getElementById("login-status");
  const button = document.getElementById("login-button");
  const identity = window.netlifyIdentity;

  const setStatus = (message, state = "") => {
    if (!status) return;
    status.textContent = message;
    status.dataset.state = state;
  };

  const hasAdminRole = (user) => {
    const roles = user?.app_metadata?.roles;
    return Array.isArray(roles) && roles.includes("admin");
  };

  const enterAdmin = async (user) => {
    if (!hasAdminRole(user)) {
      setStatus("This account is valid but does not have portfolio administrator access.", "error");
      button.disabled = false;
      await identity.logout();
      return;
    }

    setStatus("Access confirmed. Opening the dashboard…", "success");
    try {
      await user.jwt(true);
    } finally {
      window.location.assign("/admin/");
    }
  };

  if (!identity) {
    setStatus("Secure sign-in could not be loaded. Please refresh and try again.", "error");
    return;
  }

  identity.on("init", (user) => {
    if (user) {
      enterAdmin(user);
      return;
    }
    setStatus("Use your invited administrator account to continue.");
    button.disabled = false;
  });

  identity.on("login", (user) => {
    identity.close();
    enterAdmin(user);
  });

  identity.on("error", () => {
    setStatus("Sign-in was not completed. Check the invitation email or try again.", "error");
    button.disabled = false;
  });

  button.addEventListener("click", () => {
    setStatus("Opening secure sign-in…");
    identity.open("login");
  });

  identity.init();
})();
