import { Validators } from '@angular/forms';

import { Permit } from './providers/user/userTypes';
import { AdminPermit } from './providers/admin/adminTypes';

export function getPermitValidity(product: Permit | AdminPermit) {
  if (product.rev === 1) {
    return 'revoked';
  }
  const now = parseInt('' + Date.now() / 1000, 10);
  if (product.fr < now) {
    return now < product.to ? 'active' : 'expired';
  }
  return 'inactive';
}

export const validators = {
  password: [Validators.required, Validators.minLength(6), Validators.maxLength(16)],
  fullname: [Validators.required, Validators.minLength(5), Validators.maxLength(50)],
  phone: [Validators.required, Validators.pattern(/^\+?[\d\-\s\(\)]{5,25}$/)],
  username: [Validators.required, Validators.minLength(5), Validators.maxLength(25)],
  activationCode: [Validators.required, Validators.pattern(/^\d{4}$/)],
};

export const resolveOrRejectAllPromises = async (promises: Promise<any>[]) => {
  const results = [];
  const errors = [];

  await Promise.all(
    promises.map(promise => {
      return promise.then(
        result => {
          results.push(result);
        },
        error => {
          errors.push(error);
        },
      );
    }),
  );

  if (errors.length) {
    return Promise.reject(errors);
  }
  return results;
};
