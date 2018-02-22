import { Permit } from "./providers/user/user";
import { AdminPermit } from "./providers/admin/admin";

export function debounce(callback, delay) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback.apply(context, args);
    }, delay);
  };
};

export function getPermitValidity(product: Permit | AdminPermit) {
  if (product.rev === 1) {
    return 'revoked';
  }
  const now = parseInt("" + Date.now() / 1000, 10);
  if (product.fr < now) {
    return now < product.to ? 'active' : 'expired';
  }
  return 'inactive';
};
