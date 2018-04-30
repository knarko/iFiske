import { Permit } from "./providers/user/user";
import { AdminPermit } from "./providers/admin/admin";

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
