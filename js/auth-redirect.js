(function redirectIdentityCallbacks() {
  const hash = window.location.hash;
  const isIdentityCallback = /(?:invite|confirmation|recovery|access|refresh)_token=|error_description=/i.test(hash);
  if (isIdentityCallback && window.location.pathname !== "/admin-login/") {
    window.location.replace(`/admin-login/${hash}`);
  }
})();
